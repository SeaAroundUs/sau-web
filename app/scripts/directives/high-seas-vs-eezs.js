'use strict';

angular.module('sauWebApp')
  .directive('highSeasVsEezs', function() {
    var controller = function($scope, sauAPI) {
      angular.extend($scope, {
        colors: ['#f00', '#00f'],
        options: {
          chart: {
            showControls: false,
            style: 'stack',
            type: 'stackedAreaChart',
            height: 350,
            x: function(d) { return d[0]; },
            y: function(d) { return d[1]; },
            useInteractiveGuideline: true,
            xAxis: {
              showMaxMin: false,
              tickValues: [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020]
            },
            yAxis: {
              axisLabel: 'Percent of global catch'
            },
            yAxisTickFormat: function(x) { return Math.floor(x); }
          }
        }
      });

      sauAPI.EEZVsHighSeasData.get(function(res) {
        var fancyLabels = {
          'eez_percent_catch': 'EEZ percent catch',
          'high_seas_percent_catch': 'High seas percent catch'
        };
        $scope.data = res.data.map(function(datum) {
          datum.key = fancyLabels[datum.key];
          return datum;
        });
      });
    };

    return {
      controller: controller,
      restrict: 'E',
      template: '<nvd3 options="options" data="data" api="api"></nvd3>' +
        '<p class="graph-note">Majority of global catches are in EEZs</p>'
    };
  });
