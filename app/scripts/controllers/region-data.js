'use strict';

angular.module('sauWebApp')
  .controller('RegionDataCtrl', function($scope, $location, $routeParams, region, faos) {
    var ids = region === 'global' ? [1] : $routeParams.ids.split(',').map(function(id) { return parseInt(id); });

    $scope.$on('$locationChangeSuccess', function() {
      $scope.chart = getChartType();
    });

    angular.extend($scope, {
      chart: getChartType(),
      leftCol: ['global', 'fishing-entity', 'taxa', 'fao'].indexOf(region) === -1 && ids.length === 1,
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
