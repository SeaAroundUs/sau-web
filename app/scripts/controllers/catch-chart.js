'use strict';

/* global colorbrewer */
/* global d3 */
/* global nv */

angular.module('sauWebApp').controller('CatchChartCtrl',
  function ($scope, $rootScope, $filter, $location, $timeout, sauAPI, spinnerState, sauChartUtils, ga) {

    function init() {
      $scope.declarationYear = {enabled: true};
      if ($scope.region.name === 'eez') {
        $scope.declarationYear.show = true;
      }

      $scope.$watch('formModel', onFormModelChange, true);
      $scope.$watch('color', $scope.updateColor);
      $scope.$watch('mapLayers.selectedFAO', onFormModelChange);
      $scope.$on('toggleTaxonNames', $scope.updateDeclarationYear);
      updateDataDownloadUrl();
    }

    $scope.dropdownGA = function(label, value) {
      ga.sendEvent({
        category: 'CatchInfo',
        action: 'Dropdown',
        label: value ? label + ' :: ' + value : label
      });
    };

    $scope.drawDeclarationYear = function() {
      $scope.declarationYear.enabled = true;
      $timeout(function() {
        $scope.feature.$promise.then(function(){
          var chart = $scope.api.getScope().chart;
          var container = d3.select('.chart-container svg .nv-stackedarea');
          container.select('#declaration-year').remove();
          var x = chart.xAxis.scale()(Math.max(1950, $scope.feature.data.declaration_year));
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
              transform: 'translate('+(x+15)+',130) rotate(270,0,0)'
            })
            .text('EEZ declaration year');
        });
      });
    };
    $scope.hideDeclarationYear = function() {
      $scope.declarationYear.enabled = false;
      d3.select('.chart-container svg .nv-stackedarea g#declaration-year')
        .remove();
    };
    $scope.updateDeclarationYear = function() {
      if ($scope.declarationYear.show && $scope.declarationYear.enabled) {
        $scope.drawDeclarationYear();
      } else if ($scope.declarationYear.show && (!$scope.declarationYear.enabled)){
        $scope.hideDeclarationYear();
      }
    };
    nv.utils.windowResize($scope.updateDeclarationYear);

    $scope.options = {
      chart: {
        type: 'stackedAreaChart',
        height: 504,
        margin : {
          right: 16,
          bottom: 26
        },
        x: function(d){return d[0];},
        y: function(d){return d[1];},
        transitionDuration: 0,
        useInteractiveGuideline: true,
        showControls: false,
        xAxis: {
          showMaxMin: false,
          tickValues: [1950,1960,1970,1980,1990,2000,2010,2020]
        },
        yAxis: {
          showMaxMin: true,
          axisLabel: $scope.formModel.measure.chartlabel
        },
        yAxisTickFormat: function(d) {
          //Make values "in thousands" or "in millions" depending on the measure.
          var magnitude = $scope.formModel.measure.value === 'tonnage' ? 3 : '6';
          return $filter('significantDigits')(d, magnitude);
        },
        cData: ['Stacked','Stream','Expanded'],
        legend: {
          updateState: false,
          dispatch: {
            /* When the user clicks on a taxon in the legend, take them to the "Key Information on Taxon" page.*/
            legendClick: function(taxon) {
              if ($scope.formModel.dimension.value === 'taxon' && taxon.key !== 'Others') {
                $location.path('/taxa/' + taxon.entity_id);
                $scope.$apply();
              }
            }
          }
        }
      }
    };

    $scope.colors = colorbrewer;

    $scope.colors.Bold = {
      11: ['#f00','#0f0', '#00f', '#ff0', '#f0f', '#0ff', '#000',
            '#08f', '#0f8', '#f80', '#8f0', '#80f', '#f08',
            '#666', '#f88', '#88f', '#8f8', '#800', '#080', '#008'
          ]
    };

    var defaultColors = $scope.colors.Spectral['11'];
    defaultColors.push(
      '#666', '#f88', '#88f', '#8f8', '#800', '#080', '#008',
      '#888', '#333'
    );
    $scope.color = $scope.colors.Spectral;

    $scope.updateColor = function() {
      if ($scope.color[11]){
        $scope.options.chart.color = $scope.color[11];
      } else {
        $scope.options.chart.color = $scope.color[9];
      }
      $scope.updateDeclarationYear();
    };

    function onFormModelChange() {
      updateData();
      updateYLabel();
      updateChartTitle();
      updateDataDownloadUrl();
      updateURL();
    }

    function updateData() {
      var data_options = {region: $scope.region.name, region_id: $scope.formModel.region_id, fao_id: $scope.mapLayers.selectedFAO};
      data_options.dimension = $scope.formModel.dimension.value;
      data_options.measure = $scope.formModel.measure.value;
      data_options.limit = $scope.formModel.limit.value;
      $scope.$parent.$parent.showDownload = false;
      var data = sauAPI.Data.get(data_options, function() {
        var dataHash;
        var tempData = [];
        var homeCountry = [];
        var hostCountry = [];
        var otherCountries = [];
        var orderedLabels = {
          'catchtype': ['Landings', 'Discards'],
          'sector': ['Industrial', 'Artisanal', 'Subsistence', 'Recreational'],
          'reporting-status': ['Reported', 'Unreported']
        };

        $scope.$parent.$parent.showDownload = true;
        if ($scope.noData === true) {
          $timeout(function() { $scope.api.update(); });
        }
        $scope.noData = false;

        // chart ordering by label
        if (orderedLabels[data_options.dimension]) {
          dataHash = data.data.reduce(function(dh, datum) {
            dh[datum.key] = datum;
            return dh;
          }, {});

          orderedLabels[data_options.dimension].forEach(function(label) {
            if (dataHash[label]) {
              tempData.push(dataHash[label]);
            }
          });
          $scope.data = tempData;

        // chart ordering home country, then host country
        } else if (data_options.dimension === 'country') {
          data.data.forEach(function(country) {
            if (country.key === data.host_country) {
              hostCountry[0] = country;
            } else if (country.key === data.home_country) {
              homeCountry[0] = country;
            } else {
              otherCountries.push(country);
            }
          });
          $scope.data = homeCountry.concat(hostCountry.concat(otherCountries));

        // default chart ordering
        } else {
          $scope.data = data.data;
        }

        $scope.showLegendLabelToggle = $scope.formModel.dimension.value === 'taxon';
        spinnerState.loading = false;
        if ($scope.useScientificNames) {
          $scope.toggleTaxonNames();
          $scope.useScientificNames = true;
        }
        $scope.updateDeclarationYear();
        //Raises the ceiling of of the catch chart by 10%.
        //The second parameter (which is null) is for any additional data points that should be included in the ceiling calculation,
        //such as the maximum fraction on the MNF chart.
        sauChartUtils.calculateYAxisCeiling($scope, null, 0.1);
      }, function() {
        $scope.noData = true;
        spinnerState.loading = false;

        //Some very hard-coded custom error messages, quarantined in the utils class.
        $scope.noDataMessage = sauChartUtils.getNoDataMessage($scope.region.name, $scope.formModel.region_id);
      });
      spinnerState.loading = true;
    }

    $scope.toggleTaxonNames = sauChartUtils.toggleTaxonNames($scope);

    function updateYLabel() {
      /* not sure why options is not updating on $scope.formModel change */
      $scope.options.chart.yAxis.axisLabel = $scope.formModel.measure.chartlabel;
      $scope.options.chart.yAxisTickFormat = function(d) {
        //Make values "in thousands" or "in millions" depending on the measure.
        var magnitude = $scope.formModel.measure.value === 'tonnage' ? 3 : '6';
        return $filter('significantDigits')(d, magnitude);
      };
    }

    function updateChartTitle() {
      $scope.feature.$promise.then(function() {
        var dimensionLabel = $scope.formModel.dimension.overrideLabel === undefined ?
            $scope.formModel.dimension.label :
            $scope.formModel.dimension.overrideLabel;
        var chartTitle = $scope.formModel.measure.titleLabel + ' ' + dimensionLabel + ' in the ';
        if ($scope.region.name === 'global') {
          chartTitle += 'global ocean';
        } else {
          chartTitle += 'waters of ' + $scope.feature.data.title;
        }
        $scope.updateChartTitle(chartTitle);
      });
    }

    function updateDataDownloadUrl() {
      var params = [
        sauAPI.apiURL,
        $scope.region.name,
        '/',
        $scope.formModel.measure.value,
        '/',
        $scope.formModel.dimension.value,
        '/?format=csv&limit=',
        $scope.formModel.limit.value,
        '&region_id=',
        $scope.formModel.region_id
      ];
      var url;

      if ($scope.mapLayers.selectedFAO) {
        params.push('&fao_id=', $scope.mapLayers.selectedFAO);
      }

      url = params.join('');

      $scope.updateDataDownloadUrl(url);
    }

    function updateURL() {
      $location.search({chart: 'catch-chart',
        dimension: $scope.formModel.dimension.value,
        measure: $scope.formModel.measure.value
      }).replace();
    }

    init();

  });
