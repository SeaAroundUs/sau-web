'use strict';

angular.module('sauWebApp').controller('ProceduresAndOutcomesCtrl',
  function ($scope, $routeParams, sauAPI) {
    $scope.region_id = $routeParams.id;
    $scope.template = 'views/rfmo/content/' + $scope.region_id + '.html';
    sauAPI.Region.get({region: 'rfmo', region_id: $scope.region_id}, function(result) {
      $scope.regionName = result.data.title;
    });
  });
