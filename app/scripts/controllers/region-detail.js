'use strict';

angular.module('sauWebApp').controller('RegionDetailCtrl',
  function ($scope, $modalInstance, $location, sauService, options) {

    $scope.feature = sauService.Region.get(options);

    $scope.ok = function () {
      $modalInstance.close($scope.feature);
      var newPath = sauService.removePathId($location.path());
      $location.path(newPath);
  };
});