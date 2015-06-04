'use strict';

angular.module('sauWebApp').controller('AdvSearchEEZCtrl', function ($scope, sauAPI) {
  $scope.eezList = sauAPI.Regions.get({region: 'eez', nospatial: true});
});