'use strict';

/* global colorbrewer */

angular.module('sauWebApp').controller('MultiChartCtrl',
  function($scope, $routeParams, $location, $filter, $timeout, spinnerState, sauChartUtils, sauAPI, ga, createQueryUrl) {

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
          tickValues: [1950,1960,1970,1980,1990,2000,2010,2020,2030]
        },
        yAxis: {
          showMaxMin: false,
          axisLabel: $scope.formModel.measure.chartlabel
        },
        yAxisTickFormat: function(d) {
          //Make values "in thousands" or "in millions" depending on the measure.
          //Begin MOD SORTIZ 07-13-2022
          //var magnitude = $scope.formModel.measure.value === 'tonnage' ? 3 : '6';
          //return $filter('significantDigits')(d, magnitude);
          var magnitude;
          if ($scope.formModel.measure.value === 'tonnage'){
            magnitude = 3;
            return $filter('significantDigits')(d, magnitude);
          } else if ($scope.formModel.measure.value === 'omega'){
            return (d);
          } else {
            magnitude = 6;
            return $filter('significantDigits')(d, magnitude);
          }
          //End MOD SORTIZ 07-13-2022
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

    $scope.dropdownGA = function(label, value) {
      ga.sendEvent({
        category: 'CatchInfo',
        action: 'Dropdown',
        label: value ? label + ' :: ' + value : label
      });
    };

    $scope.toggleTaxonNames = function() {
      $scope.formModel.useScientificName = !$scope.formModel.useScientificName;
      sauChartUtils.toggleTaxonNames($scope);
    };

    $scope.$watch('formModel', onFormModelChange, true);
    $scope.$watch('color', function() {
      if ($scope.color[11]){
        $scope.options.chart.color = $scope.color[11];
      } else {
        $scope.options.chart.color = $scope.color[9];
      }
    });
    $scope.$watch('options', function(newOptions) {
      $timeout(function() { $scope.api.refresh(newOptions); });
    }, true);

    var defaultColors = $scope.colors.Spectral['11'];
    defaultColors.push(
      '#666', '#f88', '#88f', '#8f8', '#800', '#080', '#008',
      '#888', '#333'
    );
    $scope.color = $scope.colors.Spectral;

    function onFormModelChange() {
      updateData();
      updateYLabel();
      updateDataDownloadUrl();
      updateURL();
    }

    function updateData() {
      var data_options = {
        region: $location.search().region,
        region_id: $location.search().id.split(','),
        dimension: $scope.formModel.dimension.value,
        measure: $scope.formModel.measure.value,
        limit: $scope.formModel.limit.value
      };

      if (data_options.limit > 15) {
        $scope.options.chart.height = 800;
      } else {
        $scope.options.chart.height = 504;
      }

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

        // [SAU-1136] prepend data empty 1950 data if it starts after 1950
        data.data.forEach(function(stack) {
          if (stack.values[0][0] !== 1950) {
            stack.values.unshift([1950, null]);
          }
        });

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

        //When we get the data, it comes down as common name, so we need to rewrite the taxon names to be scientific.
        if ($scope.formModel.useScientificName) {
          sauChartUtils.toggleTaxonNames($scope);
        }

        //Raises the ceiling of of the catch chart by 10%.
        //The second parameter (which is null) is for any additional data points that should be included in the ceiling calculation,
        //such as the maximum fraction on the MNF chart.
        sauChartUtils.calculateYAxisCeiling($scope, null, 0.1);

        // update chart title
        var dimensionLabel = $scope.formModel.dimension.overrideLabel === undefined ?
          $scope.formModel.dimension.label :
          $scope.formModel.dimension.overrideLabel;
        var chartTitle = $scope.formModel.measure.titleLabel + ' ' + dimensionLabel + ' in the ';

        if ($location.search().region === 'highseas') {
          chartTitle += 'non-eez waters of selected high seas regions';
        } else {
          chartTitle += 'waters of selected ' + $location.search().region + 's';
        }

        $scope.updateChartTitle(chartTitle);

      }, function() {
        $scope.noData = true;
        spinnerState.loading = false;

        //Some very hard-coded custom error messages, quarantined in the utils class.
        $scope.noDataMessage = sauChartUtils.getNoDataMessage($scope.region.name, $scope.formModel.region_id);
      });
      spinnerState.loading = true;
    }

    function updateYLabel() {
      /* not sure why options is not updating on $scope.formModel change */
      $scope.options.chart.yAxis.axisLabel = $scope.formModel.measure.chartlabel;
      $scope.options.chart.yAxisTickFormat = function(d) {
        //Make values "in thousands" or "in millions" depending on the measure.
        //Begin MOD SORTIZ 07-13-2022
        //var magnitude = $scope.formModel.measure.value === 'tonnage' ? 3 : '6';
        //return $filter('significantDigits')(d, magnitude);
        var magnitude;
        if ($scope.formModel.measure.value === 'tonnage'){
          magnitude = 3;
          return $filter('significantDigits')(d, magnitude);
        } else if ($scope.formModel.measure.value === 'value'){
          magnitude = 6;
          return $filter('significantDigits')(d, magnitude);
        } else {
          return (d);
        }
        //End MOD SORTIZ 07-13-2022
      };
    }

    function updateDataDownloadUrl() {
      var urlConfig = {
        regionType: $location.search().region,
        measure: $scope.formModel.measure.value,
        dimension: $scope.formModel.dimension.value,
        limit: $scope.formModel.limit.value,
        useScientificName: $scope.formModel.useScientificName,
        regionIds: $location.search().id.split(',').map(function(id) { return parseInt(id); })
      };

      if ($scope.mapLayers.selectedFAO) {
        urlConfig.faoId = $scope.mapLayers.selectedFAO;
      }

      var url = sauAPI.apiURL + createQueryUrl.forRegionCsv(urlConfig);

      $scope.updateDataDownloadUrl(url);
    }

    function updateURL() {
      $location.search({
        chart: 'multi-chart',
        id: $location.search().id,
        region: $location.search().region,
        dimension: $scope.formModel.dimension.value,
        measure: $scope.formModel.measure.value,
        limit: $scope.formModel.limit.value,
        sciname: $scope.formModel.useScientificName
      }).replace();
    }
  }
);
