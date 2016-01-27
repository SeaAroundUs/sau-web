'use strict';

/* global angular */
/* global d3 */

angular.module('sauWebApp')
  .controller('MarineTrophicIndexCtrl', function ($scope, $routeParams, $modal, $http, $filter, $q, sauAPI, region) {

    $scope.years = [];
    $scope.regionType = region;
    $scope.noData = false;
    $scope.rmtiAPI = null;

    if ($routeParams.subRegion && region === 'global') {
      $scope.subregion = parseInt($routeParams.subRegion) === 1 ?
          ' - EEZs of the world' :
          ' - High Seas of the world';
    } else if ($routeParams.subRegion && region === 'eez') {
      sauAPI.Regions.get({region: 'fao', nospatial: true}, function(res) {
        var subRegionName = ' - Unknown';
        for(var i = 0; i < res.data.length; i++) {
          if (res.data[i].id === parseInt($routeParams.subRegion)) {
            subRegionName = ' - ' + res.data[i].title;
          }
        }
        $scope.subregion = subRegionName;
      });
    }

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

    var rmtiTooltip = function(key,x,y,e) {
      var s = '<h2>' + e.point[0] + '</h2>' +
        '<p>' + e.point[1] + '</p>';
      return s;
    };

    $scope.rmtiOptions = {
      chart: {
        type: 'lineChart',
        height: 250,
        margin : {
          top: 20,
          right: 20,
          bottom: 60,
          left: 85
        },
        color: [
          'rgb(248, 105, 42)',
          'rgb(85, 187, 245)',
          'rgb(50, 67, 179)'
        ],
        x: function(d){ return d[0]; },
        y: function(d){ return d[1]; },
        useInteractiveGuideline: false,
        tooltipContent: rmtiTooltip,
        xAxis: {
          axisLabel: 'Year'
        },
        yDomain: [2,5],
        yAxis: {
          axisLabel: 'RMTI',
          tickFormat: function(d){
            return d3.format('1d')(d);
          },
          // axisLabelDistance: 0
        },
        showYAxis: 9,
        showLegend: false
      },
    };

    var id = ($scope.region && $scope.region.name_id) || ($routeParams.id || 1);

    $scope.openDownloadDataModal = function() {
      $modal.open({
        templateUrl: 'views/download-data-modal.html',
        controller: 'DownloadDataModalCtrl',
        resolve: {
          dataUrl: function () {
            return sauAPI.apiURL + region + '/marine-trophic-index/?format=csv&region_id=' + id +
              '&transfer_efficiency=' + $scope.fib.transferEfficiency + '&sub_area_id=' + $routeParams.subRegion;
          }
        }
      });
    };

    $scope.apiOrigin = (function() {
      var pathArray = sauAPI.apiURL.split('/');
      return pathArray[0] + '//' + pathArray[2];
    })();

    var displayCharts = function(data) {
      $scope.noData = false;
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

      $scope.rmtiData = [];

      angular.forEach($scope.data, function(time_series) {
        time_series.values = time_series.values.filter(function(x) { return x[1]; });

        if (time_series.key.indexOf('RMTI_') >= 0) {
          // var series = {'key': time_series.key, 'values': [time_series]};
          $scope.rmtiData.push(time_series);
        } else {
          $scope[time_series.key] = [time_series];
        }

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
      // reverse RMTI order
      $scope.rmtiData.sort(function(a,b) {return a.key < b.key; } );
    };

    // compute data with exclusions from species table
    $scope.compute = function() {

      var excludedTaxons = $scope.speciesList
        .filter(function(o) { return o.excluded; })
        .map(function(o) { return o.taxon_key; });

      $scope.withExclusions = excludedTaxons.length > 0;

      var params = {
        region: region
      };

      var postData = {
        region_id: id,
        reference_year: $scope.fib.year,
        transfer_efficiency: $scope.fib.transferEfficiency,
        exclude: excludedTaxons,
        sub_area_id: $routeParams.subRegion
      };

      sauAPI.MarineTrophicIndexData.post(params, postData, displayCharts, function() {
        $scope.noData = true;
      });
    };

    // select/deselect all exclusion checkboxes on species table
    $scope.setAllExclusions = function(excluded) {
      angular.forEach($scope.speciesList, function(species) {
        species.excluded = excluded;
      });
    };

    var init = function() {
      $scope.region = sauAPI.Region.get({region: region, region_id: id}, angular.noop, function() {
        $scope.noData = true;
      });

      var species = sauAPI.MarineTrophicIndexData.get({region: region, region_id: id, species_list: true}, function() {
        $scope.speciesList = species.data;
      });

      $q.all([species.$promise]).then(function() {
        $scope.compute();
      });
    };

    init();

  });
