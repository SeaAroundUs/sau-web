'use strict';

angular.module('sauWebApp')
  .directive('regionDataCatchChart', function() {
    var catchChartCtrl = function($scope, $location, $filter, $rootScope, $timeout, sauAPI, regionDimensions, regionMeasures,
                                  regionDimensionLimits, regionDataCatchChartColors, regionDataCatchChartOptions,
                                  ga, spinnerState, sauChartUtils, regionDataCatchChartTitleGenerator, createQueryUrl) {

      // chart dropdowns
      $scope.dimensions = regionDimensions[$scope.region.name];
      $scope.measures = regionMeasures[$scope.region.name];
      $scope.limits = regionDimensionLimits[$scope.region.name];
      $scope.colors = regionDataCatchChartColors;
      $scope.managedSpecies = false;
      $scope.reportedLine = true;

      // eez declaration
      $scope.declarationYear = {
        visible: false,
        exists: $scope.region.name === 'eez' && $scope.region.id,
        year: null
      };

      // init chart model from URL and defaults
      $scope.formModel = getFormModel();

      // default color
      $scope.color = $scope.colors.Accent;

      // google analytics helper
      $scope.dropdownGA = function(label, value) {
        ga.sendEvent({
          category: 'CatchInfo',
          action: 'Dropdown',
          label: value ? label + ' :: ' + value : label
        });
      };

      // toggle scientific names
      $scope.toggleTaxonNames = function() {
        $scope.formModel.useScientificName = !$scope.formModel.useScientificName;
        sauChartUtils.toggleTaxonNames($scope);
        $scope.updateDeclarationYear();
      };

      // toggle rfmo managed species
      $scope.toggleManagedSpecies = function() {
        $scope.formModel.managedSpecies = !$scope.formModel.managedSpecies;
      };

      // toggle reported catch line
      $scope.toggleReportedLine = function() {
        $scope.reportedLine = !$scope.reportedLine;
      };

      // chart options
      $scope.options = regionDataCatchChartOptions;
      $scope.options.chart.legend = {
        updateState: false,
          dispatch: {
          /* When the user clicks on a taxon in the legend, take them to the "Key Information on Taxon" page.*/
          legendClick: function(taxon) {
            if ($scope.formModel.dimension.value === 'taxon' && taxon.key !== 'Others') {
              $scope.$apply(function() { $location.path('/taxa/' + taxon.entity_id); });
            }
          }
        }
      };

      // get chart data
      getChartData();


      /*
       * watchers
       */

      // update chart when dropdowns or region changes
      $scope.$watch('formModel', getChartData, true);
      $scope.$watch('formModel', updateURL, true);
      $scope.$watch('formModel', updateYLabel, true);
      $scope.$watch('region', function(newRegion, oldRegion) {
        if (newRegion.id !== oldRegion.id || newRegion.name !== oldRegion.name) {
          $location.path('/' + newRegion.name + '/' + newRegion.ids.join(','), false);
        }

        $scope.formModel = getFormModel();
      }, true);
      $scope.$on('$locationChangeSuccess', function() {
        $scope.formModel = getFormModel();
      });
      $scope.$watch('color', function() {
        $scope.options.chart.color = !!$scope.color[11] ? $scope.color[11] : $scope.color[9];
      });
      $scope.$watch('options', function(newOptions) {
        $timeout(function() { $scope.api.refresh(newOptions); });
      }, true);
      $scope.$watch('declarationYear', updateDeclarationYear, true);
      $scope.$watch('reportedLine', updateReportedLine);
      $scope.$watch(function() { return $scope.formModel.managedSpecies; }, updateReportedLine);


      /*
       * helper functions
       */

      function updateDeclarationYear() {
        if ($scope.declarationYear.exists) {
          $scope.declarationYear.visible ? drawDeclarationYear() : hideDeclarationYear();
        }
      }

      function hideDeclarationYear() {
        $scope.declarationYear.visible = false;
        d3.select('.chart-container svg .nv-stackedarea g#declaration-year').remove();
      }

      function drawDeclarationYear() {
        $scope.declarationYear.visible = true;
        $timeout(function() {
          sauAPI.Region.get({ region: $scope.region.name, region_id: $scope.region.id }, function(res) {
            var decYear = Math.max(1950, res.data.declaration_year);
            var chart = $scope.api.getScope().chart;
            var container = d3.select('.chart-container svg .nv-stackedarea');
            container.select('#declaration-year').remove();
            var x = chart.xAxis.scale()(decYear);
            var g = container.append('g');
            g.attr('id', 'declaration-year');
            g.append('line')
              .attr({
                x1: x,
                y1: 0.0,
                x2: x,
                y2: chart.yAxis.scale()(0)
              })
              .style('stroke', '#2daf51')
              .style('stroke-width', '1');

            g.append('text')
              .attr({
                fill: '#000',
                style: 'font-style: italic;',
                transform: 'translate(' + (x + 15) + ',150) rotate(270,0,0)'
              })
              .text('EEZ declaration year: ' + decYear);
          });
        });
      }

      function getFormModel() {
        return {
          dimension: getDimension(),
          measure: getMeasure(),
          limit: getLimit(),
          region_id: $scope.region.ids,
          useScientificName: getUseScientificName(),
          managedSpecies: getManagedSpecies(),
          fao_id: $scope.region.faoId
        };
      }

      function getDimension() {
        return $scope.dimensions[$scope.dimensions.map(function(d) { return d.value; })
            .indexOf($location.search().dimension)] || $scope.dimensions[0];
      }

      function getMeasure() {
        return $scope.measures[$scope.measures.map(function(m) { return m.value; })
            .indexOf($location.search().measure)] || $scope.measures[0];
      }

      function getLimit() {
        return $scope.limits[$scope.limits.map(function(l) { return l.value; })
            .indexOf($location.search().limit)] || $scope.limits[1];
      }

      function getUseScientificName() {
        return $location.search().sciname &&
          $location.search().sciname !== 'false' &&
          parseInt($location.search().sciname) !== 0;
      }

      function getManagedSpecies() {
        return $location.search().managed_species &&
          $location.search().managed_species !== 'All';
      }

      function updateYLabel() {
        $scope.options.chart.yAxis.axisLabel = $scope.formModel.measure.chartlabel;
        $scope.options.chart.yAxisTickFormat = function(d) {
          //Make values "in thousands" or "in millions" depending on the measure.
          var magnitude = $scope.formModel.measure.value === 'tonnage' ? 3 : '6';
          return $filter('significantDigits')(d, magnitude);
        };
      }

      function updateReportedLine() {
        return $scope.reportedLine ? $timeout(drawReportedLine) : hideReportedLine();
      }

      function drawReportedLine() {
        var dataOptions = {
          dimension: 'reporting-status',
          measure: $scope.formModel.measure.value,
          limit: $scope.formModel.limit.value,
          region: $scope.region.name,
          region_id: $scope.formModel.region_id,
          fao_id: $scope.region.faoId
        };

        if ($scope.formModel.managedSpecies) {
          dataOptions.managed_species = true;
        }

        // get reported data
        sauAPI.Data.get(dataOptions, function(res) {
          var i, g, x, y, line;
          var chart = $scope.api.getScope().chart;
          var container = d3.select('.chart-container svg .nv-stackedarea');
          var reportedData;

          for (i = 0; i < res.data.length; i++) {
            if (res.data[i].key === 'Reported') {
              reportedData = res.data[i].values;
            }
          }

          // remove existing line and create new line
          container.select('#reported-line').remove();
          g = container.append('g');
          g.attr('id', 'reported-line');

          // functions to help draw line
          x = chart.xScale();
          y = chart.yScale();
          line = d3.svg.line()
            .x(function(d) { return x(d[0]); })
            .y(function(d) { return y(d[1]); });

          // draw line
          g.append('path')
            .datum(reportedData)
            .attr({
              d: line,
              class: 'line',
              stroke: 'black',
              'stroke-width': 2,
              fill: 'none'
            });

          // add label
          g.append('rect')
            .attr({
              fill: 'white',
              height: 20,
              width: 113,
              transform: 'translate(18,' + (y(reportedData[4][1]) - 115) +')'
            });
          g.append('line')
            .attr({
              stroke: 'black',
              'stroke-width': 2,
              x1: x(reportedData[4][0]),
              y1: y(reportedData[4][1]),
              x2: x(reportedData[4][0]),
              y2: y(reportedData[4][1]) - 95
            });
          g.append('text')
            .text('Reported catch')
            .attr({
              fill: 'black',
              style: 'font-size: 16px;',
              transform: 'translate(20,' + (y(reportedData[4][1]) - 100) +')'
            });
        });
      }

      function hideReportedLine() {
        d3.select('.chart-container svg .nv-stackedarea g#reported-line').remove();
      }

      function updateDataDownloadURL() {
        var urlConfig = {
          regionType: $scope.region.name,
          measure: $scope.formModel.measure.value,
          dimension: $scope.formModel.dimension.value,
          limit: $scope.formModel.limit.value,
          useScientificName: $scope.formModel.useScientificName,
          regionIds: $scope.region.ids,
          faoId: $scope.region.faoId,
          managed_species: $scope.formModel.managedSpecies
        };
        var url = sauAPI.apiURL + createQueryUrl.forRegionCsv(urlConfig);

        $rootScope.$broadcast('setDownloadURL', url);
      }

      function clearDataDownloadURL() {
        $rootScope.$broadcast('setDownloadURL', null);
      }

      function updateURL() {
        $location.search({
          chart: 'catch-chart',
          dimension: $scope.formModel.dimension.value,
          measure: $scope.formModel.measure.value,
          limit: $scope.formModel.limit.value,
          sciname: $scope.formModel.useScientificName,
          managed_species: $scope.formModel.managedSpecies,
          subRegion: $scope.region.faoId
        }).replace();

        //TODO clear params when leaving page
      }

      function getChartData() {
        var dataOptions = {
          dimension: $scope.formModel.dimension.value,
          measure: $scope.formModel.measure.value,
          limit: $scope.formModel.limit.value,
          region: $scope.region.name,
          region_id: $scope.formModel.region_id,
          fao_id: $scope.region.faoId
        };

        if ($scope.formModel.managedSpecies) {
          dataOptions.managed_species = 'All';
        }

        // show chart loading
        spinnerState.loading = true;
        regionDataCatchChartTitleGenerator.clearTitle();

        // reset download url
        clearDataDownloadURL();

        // get data from API
        sauAPI.Data.get(dataOptions, function(res) {
          var data = res.data;
          var orderedLabels = {
            'catchtype': ['Landings', 'Discards'],
            'sector': ['Industrial', 'Artisanal', 'Subsistence', 'Recreational'],
            'reporting-status': ['Reported', 'Unreported']
          };
          var tempData = [];
          var dataHash = {};

          // expose max year to template
          $scope.maxYear = Math.max.apply(null, data.map(function(dim) {
            return dim.values[dim.values.length - 1][0];
          }));

          // refresh chart if coming from a state with no data
          if ($scope.noData === true) {
            $timeout(function() { $scope.api.update(); });
          }
          $scope.noData = false;

          // [SAU-1136] prepend data empty 1950 data if it starts after 1950
          data.forEach(function(stack) {
            if (stack.values[0][0] !== 1950) {
              stack.values.unshift([1950, null]);
            }
          });

          // chart ordering by label
          if (orderedLabels[dataOptions.dimension]) {
            dataHash = data.reduce(function(dh, datum) {
              dh[datum.key] = datum;
              return dh;
            }, {});
            orderedLabels[dataOptions.dimension].forEach(function(label) {
              if (dataHash[label]) {
                tempData.push(dataHash[label]);
              }
            });
            data = tempData;
          }

          // expose the data to the scope
          $scope.data = data;

          // display scientific name toggle for taxon dimension
          $scope.showLegendLabelToggle = dataOptions.dimension === 'taxon';

          // show scientific names if that toggle is on
          if ($scope.formModel.useScientificName) {
            sauChartUtils.toggleTaxonNames($scope);
          }

          // update EEZ declaration year display
          $timeout(updateDeclarationYear);

          // update reported catch display
          $timeout(updateReportedLine);

          // Raises the ceiling of of the catch chart by 10%.
          // The second parameter (which is null) is for any additional
          // data points that should be included in the ceiling calculation,
          // such as the maximum fraction on the MNF chart.
          sauChartUtils.calculateYAxisCeiling($scope, null, 0.1);

          // update chart title
          regionDataCatchChartTitleGenerator.updateTitle($scope.formModel, $scope.region, $scope.faos);

          // expose declaration year to template
          sauAPI.Region.get({ region: $scope.region.name, region_id: $scope.region.id}, function(res) {
            if (res.data.declaration_year) {
              $scope.declarationYear.year = res.data.declaration_year;
            }
          });

          // update download url
          updateDataDownloadURL();

          // end loading state
          spinnerState.loading = false;

        // handle no data
        }, function() {
          $scope.noData = true;
          $scope.noDataMessage = sauChartUtils.getNoDataMessage(dataOptions.region, dataOptions.region_id);
          spinnerState.loading = false;
        });
      }
    };

    return {
      controller: catchChartCtrl,
      replace: true,
      restrict: 'E',
      scope: { region: '=', faos: '=' },
      templateUrl: 'views/region-data/catch-chart.html'
    };
  });
