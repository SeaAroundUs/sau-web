'use strict';

angular.module('sauWebApp').controller('RegionDetailCtrl', function ($scope, $modalInstance, $location, sauService, feature) {

  $scope.feature = feature;
  $scope.selected = {
    feature: $scope.feature
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.feature);
    var newPath = sauService.removePathId($location.path());
    $location.path(newPath);
  };

});