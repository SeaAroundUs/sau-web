'use strict';

/* global angular */
/* global d3 */

angular.module('sauWebApp')
  .controller('MarineTrophicIndexCtrl', function ($scope, $routeParams, $modal, $http, $filter, $q, sauAPI, region) {

    $scope.years = [];
    $scope.regionType = region;
    $scope.noData = false;
    $scope.rmtiAPI = null;
    $scope.tlmin;
    $scope.tlmax;
    $scope.init_tlmin = 2.00;
    $scope.init_tlmax = 2.00;
    $scope.tl_control = true;

    $scope.setMin = function(value){
      if(value < 2){
        $scope.tlmin = 2.00;
      }

      if(value > 5){
        $scope.tlmin = 5.00;
      }

      if (($scope.tlmax - $scope.tlmin) < 1 ){
        $scope.tlmax = ((parseFloat($scope.tlmin)) + 1);
        $scope.tlmax = parseFloat($scope.tlmax).toFixed(2);
      }

      $scope.tlmin = parseFloat($scope.tlmin).toFixed(2);
    }

    $scope.setMax = function(value){
      if(value < 2){
        $scope.tlmax = 2.00;
      }

      if(value > 5){
        $scope.tlmax = 5.00;
      }

      if (($scope.tlmax - $scope.tlmin) < 1 ){
        $scope.tlmax = ((parseFloat($scope.tlmin)) + 1);
      }

      $scope.tlmax = parseFloat($scope.tlmax).toFixed(2);
    }

    $scope.setTlcontrol = function(value) {
      if ((!$scope.tlmin) || (!$scope.tlmax)){
        $scope.tl_control = false;
      } else if (($scope.tlmin === '') && ($scope.tlmax === '')) {
        $scope.tl_control = true;
      } else {
        $scope.tl_control = true;
      }
    }

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
      transferEfficiency: 0.10
    };

    $scope.transferEfficiencyBounds = function() {
      var floatTE = parseFloat($scope.fib.transferEfficiency);
      if (floatTE < 0.05) {
        $scope.fib.transferEfficiency = 0.05;
      } else if (floatTE > 0.25) {
        $scope.fib.transferEfficiency = 0.25;
      }
      $scope.fib.transferEfficiency = parseFloat($scope.fib.transferEfficiency).toFixed(2);
    };

    $scope.fib.transferEfficiency = parseFloat($scope.fib.transferEfficiency).toFixed(2);

    var rmtiTooltip = function(key,x,y,e) {
      var s = '<h2>' + e.point[0] + '</h2>' +
        '<p>' + e.point[1] + '</p>';
      return s;
    };

    $scope.rmtiOptions = {
      chart: {
        //type: 'lineChart',
        type: 'multiChart',
        height: 250,
        margin : {
          top: 20,
          right: 20,
          bottom: 60,
          left: 85
        },
        //color: [
        //  'rgb(248, 105, 42)',
        //  'rgb(85, 187, 245)',
        //  'rgb(50, 67, 179)'
        //],
        //x: function(d){ return d[0]; },
        //y: function(d){ return d[1]; },
        useInteractiveGuideline: false,
        tooltipContent: rmtiTooltip,
        xAxis: {
          showMaxMin: false,
          axisLabel: 'Year'
        },
        //yAxis: {
        //  yDomain: [2,5],
        //  axisLabel: 'RMTI',
        //  tickFormat: function(d){
        //    return d3.format('1d')(d);
        //  },
        //  // axisLabelDistance: 0
        //},
        yDomain1: [2, 5],
        yAxis1: {
          axisLabel: 'Regional MTI'
        },
        showYAxis: 10,
        showLegend: false,
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
              '&transfer_efficiency=' + $scope.fib.transferEfficiency + '&sub_area_id=' +
              ($routeParams.subRegion || '');
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
      var rmtiData1 = [];
      var rmtiData2 = [];
      var linecolor = ['#3243b3','#55bbf5', '#f8692a'];
      var counter_color = -1;
      angular.forEach($scope.data, function(time_series) {
        //time_series.values = time_series.values.filter(function(x) { return x[1]; });
        //if (time_series.key.indexOf('RMTI_') >= 0) {
        //  // var series = {'key': time_series.key, 'values': [time_series]};
        //  $scope.rmtiData.push(time_series);
        //} else if (time_series.key.indexOf('UNSMOOTHED_') >= 0) {
        //    time_series.color = 'black';
        //    $scope.rmtiData.push(time_series);
        //  } else {
        //  $scope[time_series.key] = [time_series];
        //}
        var data1 = [];
        var data2 = [];
        if (time_series.key.indexOf('RMTI_') >= 0) {
          for (var i = 0; i < time_series.values.length; i++) {
            data1.push({x: time_series.values[i][0], y: time_series.values[i][1]});
          }
          counter_color++;
          time_series.type = 'line';
          time_series.color = linecolor[counter_color];
          time_series.yAxis = 1;
          time_series.xAxis = 1;
          time_series.values = data1;
          $scope.rmtiData.push(time_series);
        } else if (time_series.key.indexOf('UNSMOOTHED_') >= 0) {
          for (var j = 0; j < time_series.values.length; j++) {
            data2.push({x: time_series.values[j][0], y: time_series.values[j][1]});
          }
          time_series.type = 'scatter';
          time_series.color = 'black';
          time_series.yAxis = 1;
          time_series.xAxis = 1;
          time_series.values = data2;
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

      //checks if more than one line
      if (counter_color > 0) {
        $scope.showShore = true;
      } else {
        $scope.showShore = false;
      }

      // reverse RMTI order
      $scope.rmtiData.sort(function(a,b) {return a.key < b.key; } );
    };
    $scope.compute = function() {
      var excludedTaxons = $scope.speciesListAll
      .filter(function(o) { return o.excluded; })
      .map(function(o) { return o.taxon_key; });

      $scope.withExclusions = excludedTaxons.length > 0;

      var params = {
        region: region
      };

      if ((!$scope.tlmin) && (!$scope.tlmax)) {
        var postData = {
          region_id: id,
          reference_year: $scope.fib.year,
          transfer_efficiency: $scope.fib.transferEfficiency,
          exclude: excludedTaxons,
          sub_area_id: $routeParams.subRegion || null,
          tl_min: $scope.init_tlmin,
          tl_max: $scope.init_tlmax
        };
      } else {
        var postData = {
          region_id: id,
          reference_year: $scope.fib.year,
          transfer_efficiency: $scope.fib.transferEfficiency,
          exclude: excludedTaxons,
          sub_area_id: $routeParams.subRegion || null,
          tl_min: $scope.tlmin,
          tl_max: $scope.tlmax
        };
      }

      sauAPI.MarineTrophicIndexData.post(params, postData, displayCharts, function() {
        $scope.noData = true;
      });
    }

    //compute data with exclusions from species table
    $scope.compute_init = function() {
      if ((!$scope.tlmin) && (!$scope.tlmax)) {
        var species_compute = sauAPI.MarineTrophicIndexData.get({region: region, region_id: id, species_list: true, tl_min: $scope.init_tlmin, tl_max: $scope.init_tlmax}, function() {
          if (species_compute.data.length != 0) {
            $scope.speciesListAll = species_compute.data;
          }
        });
      } else {
        var species_compute = sauAPI.MarineTrophicIndexData.get({region: region, region_id: id, species_list: true, tl_min: $scope.tlmin, tl_max: $scope.tlmax}, function() {
          if (species_compute.data.length != 0) {
            $scope.speciesListAll = species_compute.data;
          }
        });
      }

      var excludedTaxons = $scope.speciesListAll
      .filter(function(o) { return o.excluded; })
      .map(function(o) { return o.taxon_key; });

      $scope.withExclusions = excludedTaxons.length > 0;

      var params = {
        region: region
      };

      if ((!$scope.tlmin) && (!$scope.tlmax)) {
        var postData = {
          region_id: id,
          reference_year: $scope.fib.year,
          transfer_efficiency: $scope.fib.transferEfficiency,
          exclude: excludedTaxons,
          sub_area_id: $routeParams.subRegion || null,
          tl_min: $scope.init_tlmin,
          tl_max: $scope.init_tlmax
        };
      } else {
        var postData = {
          region_id: id,
          reference_year: $scope.fib.year,
          transfer_efficiency: $scope.fib.transferEfficiency,
          exclude: excludedTaxons,
          sub_area_id: $routeParams.subRegion || null,
          tl_min: $scope.tlmin,
          tl_max: $scope.tlmax
        };
      }

      sauAPI.MarineTrophicIndexData.post(params, postData, displayCharts, function() {
        $scope.noData = true;
      });
    };

    // select/deselect all exclusion checkboxes on species table
    $scope.setAllExclusions = function(excluded) {
      angular.forEach($scope.speciesListAll, function(species) {
        species.excluded = excluded;
      });
    };

    var init = function() {
      $scope.region = sauAPI.Region.get({region: region, region_id: id}, angular.noop, function() {
        $scope.noData = true;
      });

      if ((region === 'lme' && parseInt(id) === 64) || (region === 'highseas' && parseInt(id) === 18)) {
        $scope.iceCover = true;

      } else {
        var species = sauAPI.MarineTrophicIndexData.get({region: region, region_id: id, species_list: true, tl_min: 2, tl_max: 2}, function() {
          $scope.speciesListAll = species.data;
        });

        $q.all([species.$promise]).then(function() {
          //$scope.compute();
          $scope.compute_init();
        });
      }
    };

    init();

  });
