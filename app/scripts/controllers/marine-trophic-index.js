'use strict';

/* global angular */

angular.module('sauWebApp')
  .controller('MarineTrophicIndexCtrl', function ($scope, $routeParams, $modal, sauAPI, region) {

    $scope.years = [];
    $scope.regionType = region;

    var id = $scope.region.name_id || $routeParams.id;

    $scope.openDownloadDataModal = function() {
      $modal.open({
        templateUrl: 'views/download-data-modal.html',
        controller: 'DownloadDataModalCtrl',
        resolve: {
          dataUrl: function () {
            return sauAPI.apiURL + region + '/marine-trophic-index/?format=csv&region_id=' + id;
          }
        }
      });
    };

    $scope.apiOrigin = (function() {
      var pathArray = sauAPI.apiURL.split('/');
      return pathArray[0] + '//' + pathArray[2];
    })();

    $scope.region = sauAPI.Region.get({region: region, region_id: id});

    var data = sauAPI.MarineTrophicIndexData.get({region: region, region_id: id}, function() {

      $scope.data = data.data;
      angular.forEach($scope.data, function(time_series) {
          var nullFilteredData = time_series.values.filter(function(x) {
            return x[1];
          });
          time_series.values = nullFilteredData;
          $scope[time_series.key] = [time_series];
      });

      angular.forEach($scope.data[0].values, function(xy) {
        if (xy[1]) {
          $scope.years.push(xy[0]);
        }
      });

    });
  });
