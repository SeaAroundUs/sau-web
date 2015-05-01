'use strict';

/* global angular */

angular.module('sauWebApp')
  .controller('MarineTrophicIndexCtrl', function ($scope, $routeParams, $modal, $http, $filter, $q, sauAPI, region) {

    $scope.years = [];
    $scope.regionType = region;

    $scope.downloadModalGA = {
      category: 'DownloadModal',
      action: 'Open'
    };

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

    var displayCharts = function(data) {
      $scope.data = data.data;
      $scope.tabularData = {};

      $scope.years = $scope.data[0].values
        .filter(function(o) {return o[1];})
        .map(function(o) {return o[0];});

      $scope.mtlYears = $scope.data[3].values
        .filter(function(o) {return o[1];})
        .map(function(o) {return o[0];});

      $scope.fibYears = $scope.data[1].values
        .filter(function(o) {return o[1];})
        .map(function(o) {return o[0];});

      $scope.fib.year = $scope.fib.year || $scope.years[0];

      angular.forEach($scope.data, function(time_series) {
        time_series.values = time_series.values.filter(function(x) { return x[1]; });
        $scope[time_series.key] = [time_series];

        angular.forEach(time_series.values, function(dataRow) {
          var year = dataRow[0];
          if ($scope.years.indexOf(year) >=0) {
            if (! $scope.tabularData[year]) {
              $scope.tabularData[year] = {};
            }
            $scope.tabularData[year][time_series.key] = dataRow[1];
          }
        });
      });
    };

    // compute data with exclusions from species table
    $scope.compute = function() {

      var excludedTaxons = $scope.speciesList
        .filter(function(o) { return o.excluded; })
        .map(function(o) { return o.taxon_key; });

      $scope.withExclusions = excludedTaxons.length > 0;

      var params = {
        region: region,
        region_id: id,
        reference_year: $scope.fib.year,
        transfer_efficiency: $scope.fib.transferEfficiency,
        exclude: excludedTaxons
      };

      sauAPI.MarineTrophicIndexData.get(params, displayCharts);
    };

    // select/deselect all exclusion checkboxes on species table
    $scope.setAllExclusions = function(excluded) {
      angular.forEach($scope.speciesList, function(species) {
        species.excluded = excluded;
      });
    };

    var init = function() {
      $scope.region = sauAPI.Region.get({region: region, region_id: id});
      var species = sauAPI.ExploitedOrganismsData.get({region: region, region_id: id}, function() {
        $scope.speciesList = species.data;
      });

      $q.all([species.$promise]).then(function() {
        $scope.compute();
      });
    };

    init();

  });
