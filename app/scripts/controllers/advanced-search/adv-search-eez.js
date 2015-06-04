'use strict';

angular.module('sauWebApp').controller('AdvSearchEEZCtrl', function ($scope, sauAPI, regionDimensions, regionMeasures, regionDimensionLimits) {
  $scope.eezList = sauAPI.Regions.get({region: 'eez', nospatial: true});
  $scope.dimensions = regionDimensions.eez;
  $scope.selectedDimension = $scope.dimensions[0];
  $scope.measures = regionMeasures.eez;
  $scope.selectedMeasure = $scope.measures[0];
  $scope.limits = regionDimensionLimits.eez;
  $scope.selectedLimit = $scope.limits[0];
});