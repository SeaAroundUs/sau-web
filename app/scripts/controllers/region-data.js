'use strict';

angular.module('sauWebApp')
  .controller('RegionDataCtrl', function($scope, $location, $routeParams, region, faos) {
    var ids = region === 'global' ? [1] : $routeParams.ids.split(',').map(function(id) { return parseInt(id); });

    $scope.$on('$locationChangeSuccess', function() {
      $scope.chart = getChartType();
    });

    angular.extend($scope, {
      chart: getChartType(),
      region: {
        name: region,
        id: ids.length > 1 ? null : ids[0],
        ids: ids,
        faoId: null,
        faos: ids.length > 1 ? [] : faos.getFAOsByRegion(region, ids[0])
      }
    });

    function getChartType() {
      return $location.search().chart || 'catch-chart';
    }
  });
