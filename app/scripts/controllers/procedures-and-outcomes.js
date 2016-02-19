'use strict';

angular.module('sauWebApp').controller('ProceduresAndOutcomesCtrl',
  function ($scope, $routeParams, sauAPI) {
    $scope.region_id = $routeParams.id;
    sauAPI.ProceduresAndOutcomes.get(function(res) {

      // get the proper rfmo data
      var data = res.data.filter(function(r) { return r.rfmo_id === parseInt($routeParams.id); })[0];

      // fix image paths
      data.content = data.content.replace(/src=("|')RFMO/g, 'src=$1views/rfmo/RFMO');

      $scope.data = data;
    });

    sauAPI.Region.get({region: 'rfmo', region_id: $scope.region_id}, function(result) {
      $scope.regionName = result.data.title;
    });
  });
