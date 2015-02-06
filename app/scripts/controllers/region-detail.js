'use strict';

/* global d3 */ /* for jshint */
/* global colorbrewer */ /* for jshint */

angular.module('sauWebApp').controller('RegionDetailCtrl',
  function ($scope, $modalInstance, $location, $window, sauService, region_options) {

    $scope.dimensions = [
      {label: 'taxon', value: 'taxon'},
      {label: 'commercial group', value: 'commercialgroup'},
      {label: 'functional group', value: 'functionalgroup'},
      {label: 'country', value: 'country'},
      {label: 'gear', value: 'gear'},
      {label: 'sector', value: 'sector'},
      {label: 'catchtype', value: 'catchtype'},
    ];

    $scope.measures = [
      {label: 'tonnage', value: 'tonnage'},
      {label: 'value', value: 'value'}
    ];

    $scope.limits = [
      {label: '20', value: '20'},
      {label: '10', value: '10'},
      {label: '5', value: '5'},
      {label: '1', value: '1'},
    ];

    $scope.colors = colorbrewer;

    $scope.colors.SAU= {
      11: ['#f00','#0f0', '#00f', '#ff0', '#f0f', '#0ff', '#000',
            '#08f', '#0f8', '#f80', '#8f0', '#80f', '#f08'
          ]
    };

    $scope.color = $scope.colors.SAU;

    $scope.dimension = $scope.dimensions[0];
    $scope.measure = $scope.measures[0];
    $scope.limit = $scope.limits[1];

    $scope.feature = sauService.Region.get(region_options);

    $scope.ok = function () {
      $modalInstance.close($scope.feature);
      var newPath = sauService.removePathId($location.path());
      $location.path(newPath);
    };

    $scope.download = function() {
      // FIXME: constructing url manually, I don't know how to get it out of the $resource
      // This should probably be in a service or something too.
      var url = ['',
        sauService.api_url,
        options.region,
        '/',
        $scope.measure.value,
        '/',
        $scope.dimension.value,
        '/?format=csv&limit=',
        $scope.limit.value,
        '&region_id=',
        options.region_id,
      ].join('');
      $window.open(url, '_blank');
    };

    $scope.updateData = function() {
      var data_options = region_options;
      data_options.dimension = $scope.dimension.value;
      data_options.measure = $scope.measure.value;
      data_options.limit = $scope.limit.value;
      var data = sauService.Data.get(data_options, function() {
         $scope.data = data.data;
       });
    };

    $scope.updateColor = function() {
      if ($scope.color[11]){
        $scope.options.chart.color = $scope.color[11];
      } else {
        $scope.options.chart.color = $scope.color[9];
      }
    };

    $scope.options = {
      chart: {
          type: 'stackedAreaChart',
          height: 450,
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
          },
          yAxis: {
            tickFormat: function(d){
              return d3.format(',.1s')(d);
            }
          }
        }
      };

    $scope.updateData();
    $scope.updateColor();

});