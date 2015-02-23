'use strict';

/* global d3 */ /* for jshint */
/* global colorbrewer */ /* for jshint */

angular.module('sauWebApp').controller('CatchChartCtrl',
  function ($scope) {

    $scope.options = {
      chart: {
          type: 'stackedAreaChart',
          height: 350,
          // margin : {
          //     top: 20,
          //     right: 20,
          //     bottom: 60,
          //     left: 85
          // },
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
            foo: 'bar',
            tickFormat: function(d){
              return d3.format(',.1s')(d);
            },
            axisLabel: $scope.formModel.measure.chartlabel
          },
          legend: {
            radioButtonMode: false,
            dispatch: {
              /* When the user clicks on a species (taxon) in the legend, take them to the "Key Information on Species" page.*/
              legendClick: function() {
                if ($scope.formModel.dimension.value === 'Taxon') {
                  //Route user to "key information on species page"

                }
                var chart = $scope.api.getScope().chart;
                chart.legend.dispatch.on('legendClick', null);
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
      $scope.options.chart.yAxis.tickFormat = function(d) {
        return d3.format(',.00002f')(d);
      };
    };
    $scope.$watch('formModel', $scope.updateYlabel, true);

  });