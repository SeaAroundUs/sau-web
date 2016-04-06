'use strict';

angular.module('sauWebApp')
  .controller('RegionDataCtrl', function($scope, $location, $routeParams, region, faos) {
    var ids = region === 'global' ? [1] : $routeParams.ids.split(',').map(function(id) { return parseInt(id); });
    var thisPath = $location.path();

    // needed for eezs vs high seas graph and title
    $scope.measure = $location.search().measure;
    $scope.$on('$locationChangeSuccess', function() {
      $scope.measure = $location.search().measure;
    });

    $scope.$watch('region', getFAOs, true);
    $scope.$watch('region', handleURL, true);

    $scope.$on('$locationChangeSuccess', function() {
      if ($location.path() !== thisPath) {
        return;
      }

      $scope.chart = getChartType();
    });

    angular.extend($scope, {
      chart: getChartType(),
      leftCol: ['fishing-entity', 'taxa'].indexOf(region) === -1,
      region: {
        name: region,
        id: ids.length > 1 ? null : ids[0],
        ids: ids,
        faoId: $routeParams.subRegion ? parseInt($routeParams.subRegion) : null
      }
    });

    function getFAOs(region) {
      faos.getFAOsByRegion(region.name, region.ids).then(function(faos) {
        $scope.faos = faos;
      });
    }

    function getChartType() {
      return $location.search().chart || 'catch-chart';
    }

    function handleURL(newRegion, oldRegion) {
      if (newRegion.id === null || newRegion.id !== oldRegion.id) {
        $scope.region.faoId = null;
      }
    }
  });
