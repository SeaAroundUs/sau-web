'use strict';

/* global L */

angular.module('sauWebApp')
  .controller('MiniMapCtrl', function ($scope, $rootScope, $q, $location, sauService, leafletBoundsHelpers, leafletData) {

    $scope.$on('leafletDirectiveMap.geojsonClick', function(ev, feature) {
        $scope.modal.close();
        var newPath = $scope.region + '/' + feature.properties.region_id;
        $location.path(newPath, false);
    });

    $q.all([$scope.regions.$promise,
      $scope.feature.$promise])
      .then(function() {
        angular.extend($scope, {
          defaults: sauService.mapConfig.defaults,
          geojson: $scope.regions
        });
        var bounds = L.geoJson($scope.feature.data.geojson).getBounds();
        leafletData.getMap().then(function(map) {
          map.fitBounds(bounds);
          var layer = L.geoJson($scope.feature.data.geojson).addTo(map);
          layer.setStyle(sauService.mapConfig.highlightStyle);
          map.invalidateSize(false); // fix drawing bug
        });
      });
  });
