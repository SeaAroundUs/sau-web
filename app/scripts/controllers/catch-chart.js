'use strict';

/* global colorbrewer */ /* for jshint */

angular.module('sauWebApp').controller('CatchChartCtrl',
  function ($scope, $rootScope, $filter, sauAPI) {

    $scope.options = {
      chart: {
          type: 'stackedAreaChart',
          height: 304,
          margin : {
              right: 0,
              bottom: 16
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
          legend: {
            updateState: false,
            dispatch: {
              /* When the user clicks on a taxon in the legend, take them to the "Key Information on Taxon" page.*/
              legendClick: function(taxon) {
                if ($scope.formModel.dimension.value === 'taxon') {
                  //Route user to "key information on taxon page" via the modal close event.
                  $rootScope.modalInstance.close({location: '/taxa/' + taxon.entity_id});
                }
              }
            }
          }
        }
      };

    $scope.colors = colorbrewer;

    $scope.colors.SAU = {
      11: ['#f00','#0f0', '#00f', '#ff0', '#f0f', '#0ff', '#000',
            '#08f', '#0f8', '#f80', '#8f0', '#80f', '#f08'
          ]
    };

    $scope.color = $scope.colors.SAU;

    $scope.updateColor = function() {
      if ($scope.color[11]){
        $scope.options.chart.color = $scope.color[11];
      } else {
        $scope.options.chart.color = $scope.color[9];
      }
    };
    $scope.$watch('color', $scope.updateColor);

    $scope.updateYlabel = function() {
      /* not sure why options is not updating on $scope.formModel change */
      $scope.options.chart.yAxis.axisLabel = $scope.formModel.measure.chartlabel;
      $scope.options.chart.yAxisTickFormat = function(d) {
        //Make values "in thousands" or "in millions" depending on the measure.
        var magnitude = $scope.formModel.measure.value === 'tonnage' ? 3 : '6';
        return $filter('significantDigits')(d, magnitude);
      };
    };
    $scope.$watch('formModel', $scope.updateYlabel, true);

    $scope.updateData = function() {
      var data_options = {region: $scope.region.name, region_id: $scope.formModel.region_id};
      data_options.dimension = $scope.formModel.dimension.value;
      data_options.measure = $scope.formModel.measure.value;
      data_options.limit = $scope.formModel.limit.value;
      var data = sauAPI.Data.get(data_options, function() {
          $scope.data = data.data;
          $scope.showLegendLabelToggle = $scope.formModel.dimension.value === 'taxon';
      });
    };
    $scope.$watch('formModel', $scope.updateData, true);

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

    });