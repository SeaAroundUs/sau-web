'use strict';

/* global angular */
/* global d3 */

angular.module('sauWebApp')
  .controller('MarineTrophicIndexCtrl', function ($scope, $routeParams, sauService, region) {
    var data = sauService.MarineTrophicIndexData.get({region: region, region_id: $routeParams.id}, function() {
            $scope.data = data.data;
            angular.forEach(data.data, function(time_series) {
                $scope[time_series.key] = [time_series];
            });
        });

    $scope.test = 'foo';

    $scope.trophic_options = {
      chart: {
          type: 'lineChart',
          height: 350,
          margin : {
              top: 20,
              right: 20,
              bottom: 60,
              left: 55
          },
          x: function(d){return d[0];},
          y: function(d){return d[1];},
          transitionDuration: 250,
          useInteractiveGuideline: true,
          xAxis: {
              showMaxMin: false,
              tickValues: [1950,1960,1970,1980,1990,2000,2010,2020],
              axisLabel: 'Year'
          },
          yAxis: {
              tickFormat: function(d){
                  return d3.format(',.1s')(d);
              },
              axisLabel: 'Trophic Index'
          }
        }
      };

      $scope.fib_options = angular.copy($scope.trophic_options);

  });
