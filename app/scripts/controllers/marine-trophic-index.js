'use strict';

/* global angular */

angular.module('sauWebApp')
  .controller('MarineTrophicIndexCtrl', function ($scope, $routeParams, $modal, $http, sauAPI, region) {

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

    var species = sauAPI.ExploitedOrganismsData.get({region: region, region_id: id}, function() {
      $scope.speciesList = species.data;
    });

    var displayCharts = function(data) {
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
    };

    sauAPI.MarineTrophicIndexData.get({region: region, region_id: id}, displayCharts);

    // compute data with exclusions from species table
    $scope.compute = function() {
      var url = sauAPI.apiURL + region + '/marine-trophic-index/?region_id=' + id;

      angular.forEach($scope.speciesList, function(species) {
        if (species.excluded) {
          url += '&exclude=' + species.taxon_key;
        }
      });

      $http.get(url).success(displayCharts);
    };

    // select/deselect all exclusion checkboxes on species table
    $scope.setAllExclusions = function(excluded) {
      angular.forEach($scope.speciesList, function(species) {
        species.excluded = excluded;
      });
    };

  });
