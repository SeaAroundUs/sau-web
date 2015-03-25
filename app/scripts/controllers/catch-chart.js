'use strict';

/* global colorbrewer */ /* for jshint */

angular.module('sauWebApp').controller('CatchChartCtrl',
  function ($scope, $rootScope, $filter, $location, sauAPI, spinnerState) {

    function init() {
      $scope.$watch('formModel', onFormModelChange, true);
      $scope.$watch('color', $scope.updateColor);
      updateDataDownloadUrl();
    }

    $scope.options = {
      chart: {
          type: 'stackedAreaChart',
          height: 304,
          margin : {
              right: 0,
              bottom: 26
          },
          x: function(d){return d[0];},
          y: function(d){return d[1];},
          transitionDuration: 250,
          useInteractiveGuideline: true,
          xAxis: {
              showMaxMin: false,
              tickValues: [1950,1960,1970,1980,1990,2000,2010,2020],
          },
          yAxis: {
            showMaxMin: false,
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
            '#08f', '#0f8', '#f80', '#8f0', '#80f', '#f08'
          ]
    };

    $scope.color = $scope.colors.Spectral;

    $scope.updateColor = function() {
      if ($scope.color[11]){
        $scope.options.chart.color = $scope.color[11];
      } else {
        $scope.options.chart.color = $scope.color[9];
      }
    };


    $scope.toggleTaxonNames = function() {
      //Swapping each datum's key between scientific name and common name.
      for (var i = 0; i < $scope.data.length; i++) {
        var temp = $scope.data[i].key;
        $scope.data[i].key = $scope.data[i].scientific_name;
        $scope.data[i].scientific_name = temp;
      }
      $scope.useScientificNames = !$scope.useScientificNames;
    };

    function onFormModelChange() {
      updateData();
      updateYLabel();
      updateChartTitle();
      updateDataDownloadUrl();
    }

    function updateData() {
      var data_options = {region: $scope.region.name, region_id: $scope.formModel.region_id};
      data_options.dimension = $scope.formModel.dimension.value;
      data_options.measure = $scope.formModel.measure.value;
      data_options.limit = $scope.formModel.limit.value;
      var data = sauAPI.Data.get(data_options, function() {
          $scope.data = data.data;
          $scope.showLegendLabelToggle = $scope.formModel.dimension.value === 'taxon';
          spinnerState.loading = false;
          if ($scope.useScientificNames) {
            $scope.toggleTaxonNames();
            $scope.useScientificNames = true;
          }
      });
      spinnerState.loading = true;
    }

    $scope.toggleTaxonNames = function() {
      //Swapping each datum's key between scientific name and common name.
      for (var i = 0; i < $scope.data.length; i++) {
        var temp = $scope.data[i].key;

        // if there is no scientific name, don't toggle it
        if ($scope.data[i].scientific_name === undefined) {
          continue;
        }

        $scope.data[i].key = $scope.data[i].scientific_name;
        $scope.data[i].scientific_name = temp;
      }
      $scope.useScientificNames = !$scope.useScientificNames;
    };

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
      var url = ['',
        sauAPI.apiURL,
        $scope.region.name,
        '/',
        $scope.formModel.measure.value,
        '/',
        $scope.formModel.dimension.value,
        '/?format=csv&limit=',
        $scope.formModel.limit.value,
        '&region_id=',
        $scope.formModel.region_id,
      ].join('');

      $scope.updateDataDownloadUrl(url);
    }

    init();

  });