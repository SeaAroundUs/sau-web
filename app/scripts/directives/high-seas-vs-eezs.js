'use strict';

angular.module('sauWebApp')
  .directive('highSeasVsEezs', function() {
    var controller = function($scope, $location, sauAPI) {
      $scope.$watch('measure', function(measure) {
        sauAPI.EEZVsHighSeasData.get({ value: measure === 'value' ? 1 : 0 }, function(res) {
          var fancyLabels = {
            'eez_percent_catch': 'EEZ',
            'eez_percent_value': 'EEZ',
            'high_seas_percent_catch': 'High seas',
            'high_seas_percent_value': 'High seas'
          };
          $scope.data = res.data.map(function(datum) {
            datum.key = fancyLabels[datum.key];
            return datum;
          });
        });
      });

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
    };

    return {
      controller: controller,
      restrict: 'E',
      scope: { measure: '=', region: '=' },
      template: '<nvd3 options="options" data="data" api="api"></nvd3>' +
        '<p class="graph-note">Majority of global catches are in EEZs</p>'
    };
  });
