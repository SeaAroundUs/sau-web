'use strict';

/* global angular */

angular.module('sauWebApp')
  .controller('MarineTrophicIndexCtrl', function ($scope, $routeParams, $modal, $http, $filter, sauAPI, region) {

    $scope.years = [];
    $scope.regionType = region;

    $scope.fib = {
      year: null,
      transferEfficiency: 0.1
    };

    $scope.transferEfficiencyBounds = function() {
      var floatTE = parseFloat($scope.fib.transferEfficiency);
      if (floatTE < 0.1) {
        $scope.fib.transferEfficiency = 0.1;
      } else if (floatTE > 0.3) {
        $scope.fib.transferEfficiency = 0.3;
      }
    };

    var id = ($scope.region && $scope.region.name_id) || $routeParams.id;

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
      $scope.tabularData = {};

      angular.forEach($scope.data[0].values, function(xy) {
        if (xy[1]) {
          if ($scope.years.indexOf(xy[0]) === -1) {
            $scope.years.push(xy[0]);
            $scope.tabularData[xy[0]] = {};
          }
        }
      });

      $scope.fib.year = $scope.years[0];

      angular.forEach($scope.data, function(time_series) {
        time_series.values = time_series.values.filter(function(x) { return x[1]; });
        $scope[time_series.key] = [time_series];

        angular.forEach(time_series.values, function(dataRow) {
          if ($scope.tabularData[dataRow[0].toString()]) {
            $scope.tabularData[dataRow[0].toString()][time_series.key] = dataRow[1];
          }
        });
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

      url += '&reference_year' + $scope.fib.year;
      url += '&transfer_efficiency' + $scope.fib.transferEfficiency;

      $http.get(url).success(displayCharts);
    };

    // select/deselect all exclusion checkboxes on species table
    $scope.setAllExclusions = function(excluded) {
      angular.forEach($scope.speciesList, function(species) {
        species.excluded = excluded;
      });
    };

  });
