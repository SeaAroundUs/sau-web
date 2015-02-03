'use strict';

angular.module('sauWebApp').controller('RegionDetailCtrl', function ($scope, $modalInstance, $location, feature) {

  $scope.feature = feature;
  $scope.selected = {
    feature: $scope.feature
  };

  var removePathId = function(path) {
    var to = path.lastIndexOf('/');
    to = to == -1 ? path.length : to + 1;
    return path.substring(0, to);
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.feature);
    var newPath = removePathId($location.path());
    $location.path(newPath);
  };

});