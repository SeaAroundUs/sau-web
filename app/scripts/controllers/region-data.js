'use strict';

angular.module('sauWebApp')
  .controller('RegionDataCtrl', function($scope, $location, region, faos) {
    var id = 1; //TODO

    $scope.$on('$locationChangeSuccess', function() {
      $scope.chart = getChartType();
    });

    angular.extend($scope, {
      chart: getChartType(),
      region: {
        name: region,
        id: id,
        faoId: null,
        faos: faos.getFAOsByRegion(region, id)
      }
    });

    function getChartType() {
      return $location.search().chart || 'catch-chart';
    }
  });
