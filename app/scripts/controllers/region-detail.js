'use strict';

angular.module('sauWebApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, feature) {

  $scope.feature = feature;
  $scope.selected = {
    feature: $scope.feature
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.feature);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});