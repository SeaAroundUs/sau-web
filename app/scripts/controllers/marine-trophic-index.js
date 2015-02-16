'use strict';

/* global angular */
/* global d3 */
/* global ss */

angular.module('sauWebApp')
  .controller('MarineTrophicIndexCtrl', function ($scope, $routeParams, sauService, region) {

    $scope.years = [];

    $scope.index = function(index) {return data[index];};

    $scope.thisIndex = "";

    var data = sauService.MarineTrophicIndexData.get({region: region, region_id: $routeParams.id}, function() {

        $scope.data = data.data;
        angular.forEach($scope.data, function(time_series) {
            $scope[time_series.key] = [time_series];
        });

        angular.forEach($scope.data[0].values, function(xy) {
          if (xy[1]) {
            $scope.years.push(xy[0]);
          }
        });

    });

    $scope.options = {
      chart: {
          type: 'lineChart',
          height: 250,
          margin : {
              top: 20,
              right: 20,
              bottom: 60,
              left: 85
          },
          x: function(d){
            if (d){
              return d[0];
            }
          },
          y: function(d){return d[1];},
          transitionDuration: 225,
          // useInteractiveGuideline: true,
          showLegend: false,
          xAxis: {
              showMaxMin: false,
              tickValues: [1950,1960,1970,1980,1990,2000,2010,2020],
              axisLabel: 'Year'
          },
          yAxis: {
              showMaxMin: false,
              tickFormat: function(d){
                  return d3.format(',.2s')(d);
              },
              axisLabel: 'Trophic Index'
          }
        }
      };



  });
