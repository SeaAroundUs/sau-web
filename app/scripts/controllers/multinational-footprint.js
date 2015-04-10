'use strict';

/* global angular */
/* global d3 */

angular.module('sauWebApp')
  .controller('MultinationalFootprintCtrl', function ($scope, $routeParams, $timeout, sauAPI) {

    var getChartTitle = function() {
      return 'Primary Production Required for catches in the waters of ' + $scope.feature.data.title;
    };

    $scope.api = {};

    $scope.$watch('formModel.region_id', function() {
      var data = sauAPI.MultinationalFootprintData.get({region: $scope.region.name, region_id: $scope.formModel.region_id}, function() {
        $scope.data = data.data.countries;
        $scope.maximumFraction = data.data.maximum_fraction;
        $scope.updateChartTitle(getChartTitle());

        // draw maximum fraction line.  $timeout so it's drawn on top.
        $timeout(function() {
          var chart = $scope.api.getScope().chart;
          var container = d3.select('.chart-container svg .nv-stackedarea');

          container.append('line')
            .attr({
              x1: chart.xAxis.scale()(1950),
              y1: chart.yAxis.scale()($scope.maximumFraction),
              x2: chart.xAxis.scale()(2020),
              y2: chart.yAxis.scale()($scope.maximumFraction)
            })
            .style('stroke', '#f70');
          container.append('text')
            .attr({
              x: 10 + chart.xAxis.scale()(1950),
              y: -5 + chart.yAxis.scale()($scope.maximumFraction),
              fill: '#000',
              style: 'font-style: italic' // in SVG, styling attributes don't override css but style attr does
            })
            .text('Maximum fraction ' + $scope.maximumFraction);
        });
      });
    });

    $scope.feature.$promise.then(function() {
      $scope.updateChartTitle(getChartTitle());
      updateDataDownloadUrl();
    });

    $scope.options = {
      chart: {
        type: 'stackedAreaChart',
        height: 350,
        margin : {
          top: 20,
          right: 0,
          bottom: 60,
        },
        x: function(d){return d[0];},
        y: function(d){return d[1];},
        transitionDuration: 0,
        useInteractiveGuideline: true,
        xAxis: {
          showMaxMin: false,
          tickValues: [1950,1960,1970,1980,1990,2000,2010,2020],
          axisLabel: 'Year'
        },
        yAxisTickFormat: function(d) {
          return Number(d).toFixed(3).toString();
        },
        yAxis: {
          axisLabel: 'Fraction of prim.prod.'
        }
      }
    };

    function updateDataDownloadUrl() {
      var url = ['',
        sauAPI.apiURL,
        $scope.region.name,
        '/multinational-footprint/?region_id=',
        $scope.formModel.region_id,
        '&format=csv'
      ].join('');
      $scope.updateDataDownloadUrl(url);
    }

    updateDataDownloadUrl();
  });
