'use strict';

angular.module('sauWebApp').controller('RegionDetailCtrl',
  function ($scope, $modalInstance, $location, $window, sauService, region_id) {

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

    $scope.dimension = $scope.dimensions[0];
    $scope.measure = $scope.measures[0];
    $scope.limit = $scope.limits[1];

    $scope.feature = sauService.Region.get({region: $scope.region, region_id: region_id});

    $scope.close = function () {
      $modalInstance.close($scope.feature);
      $location.path('/'+$scope.region, false);
    };

    $scope.download = function() {
      // FIXME: constructing url manually, I don't know how to get it out of the $resource
      // This should probably be in a service or something too.
      var url = ['',
        sauService.api_url,
        $scope.region,
        '/',
        $scope.measure.value,
        '/',
        $scope.dimension.value,
        '/?format=csv&limit=',
        $scope.limit.value,
        '&region_id=',
        region_id,
      ].join('');
      $window.open(url, '_blank');
    };

    $scope.updateData = function() {
      var data_options = {region: $scope.region, region_id: region_id};
      data_options.dimension = $scope.dimension.value;
      data_options.measure = $scope.measure.value;
      data_options.limit = $scope.limit.value;
      var data = sauService.Data.get(data_options, function() {
         $scope.data = data.data;
       });
    };

    $scope.updateData();

});