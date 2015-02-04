'use strict';

angular.module('sauWebApp').controller('RegionDetailCtrl',
  function ($scope, $modalInstance, $location, sauService, options) {

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
      {label: '50', value: '50'},
      {label: '20', value: '20'},
      {label: '10', value: '10'},
      {label: '5', value: '5'},
      {label: '1', value: '1'},
    ];

    $scope.dimension = $scope.dimensions[0];
    $scope.measure = $scope.measures[0];
    $scope.limit = $scope.limits[2];

    $scope.feature = sauService.Region.get(options);

    $scope.ok = function () {
      $modalInstance.close($scope.feature);
      var newPath = sauService.removePathId($location.path());
      $location.path(newPath);
    };

    $scope.download = function() {
      // FIXME: the request is working fine, but how to get the
      // file downloaded?
      // sauService.CSVData.get(data_options);
    };

    $scope.updateData = function() {
      var data_options = options;
      data_options.dimension = $scope.dimension.value;
      data_options.measure = $scope.measure.value;
      data_options.limit = $scope.limit.value;
      data_options.geo_id = options.region_id;
      var data = sauService.Data.get(data_options, function() {

         var keys = d3.keys(data.data);
         var color = d3.scale.ordinal()
         .range(['#f00','#0f0', '#00f', '#ff0', '#f0f', '#0ff', '#000',
           '#08f', '#0f8', '#f80', '#8f0', '#80f', '#f08'
           ]);

         color.domain(keys);
         var parseDate = d3.time.format("%Y").parse;

         var groups = color.domain().map(function (label) {
           var years = d3.keys(data.data[label]);

           return {
             key: label,
             values: years.map(function (year) {
               return [year, +data.data[label][year]/1000];
             })
           };
         });
         $scope.data = groups;
       });
    };

    $scope.updateData();

    $scope.options = {
        chart: {
            type: 'stackedAreaChart',
            height: 450,
            width: '100%',
            margin : {
                top: 20,
                right: 20,
                bottom: 60,
                left: 55
            },
            x: function(d){return d[0];},
            y: function(d){return d[1];},
            useVoronoi: false,
            // clipEdge: true,
            transitionDuration: 500,
            useInteractiveGuideline: true,
            xAxis: {
                showMaxMin: false,
                tickValues: [1950,1960,1970,1980,1990,2000],
                tickFormat: function(d) {
                    return d;
                    // return d3.time.format('%x')(new Date(d))
                }
            },
            yAxis: {
                tickFormat: function(d){
                    return d3.format(',.2f')(d);
                }
            }

        }
      };
});