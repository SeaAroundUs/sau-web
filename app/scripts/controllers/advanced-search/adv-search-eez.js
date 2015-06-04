'use strict';

angular.module('sauWebApp').controller('AdvSearchEEZCtrl', function ($scope, sauAPI, regionDimensions) {
  $scope.eezList = sauAPI.Regions.get({region: 'eez', nospatial: true});
  $scope.dimensions = regionDimensions.eez;
  $scope.selectedDimension = $scope.dimensions[0];
});