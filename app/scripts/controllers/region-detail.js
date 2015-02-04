'use strict';

angular.module('sauWebApp').controller('RegionDetailCtrl',
  function ($scope, $modalInstance, $location, sauService, options) {

    $scope.dimensions = [
      {label: 'taxon', value: 'taxon'},
      {label: 'commercial group', value: 'commercialgroup'},
    ];

    $scope.measures = [
      {label: 'tonnage', value: 'tonnage'},
      {label: 'value', value: 'value'}
    ];

    $scope.limits = [
      {label: '10', value: '10'},
      {label: '5', value: '5'},
      {label: '1', value: '1'},
    ];


    $scope.dimension = $scope.dimensions[0];
    $scope.measure = $scope.measures[0];
    $scope.limit = $scope.limits[0];

    $scope.feature = sauService.Region.get(options);
    var data_options = options;
    data_options.dimension = $scope.dimension.value;
    data_options.measure = $scope.measure.value;
    data_options.limit = $scope.limit.value;

    $scope.data = sauService.Data.get(data_options);

    $scope.ok = function () {
      $modalInstance.close($scope.feature);
      var newPath = sauService.removePathId($location.path());
      $location.path(newPath);
    };

    $scope.download = function() {
      // FIXME: the request is working fine, but how to get the
      // file downloaded?
      sauService.CSVData.get(data_options);
    }
});