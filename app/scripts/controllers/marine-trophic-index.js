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

  });
