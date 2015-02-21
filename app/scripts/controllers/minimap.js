'use strict';

/* global L */

angular.module('sauWebApp')
  .controller('MiniMapCtrl', function ($scope, $location, sauService, leafletBoundsHelpers, leafletData) {

    angular.extend($scope, {
      defaults: sauService.mapConfig.miniMapDefaults,
    });

    // remove parent scope listener and add our own
    $scope.geojsonClick();

    $scope.$on('leafletDirectiveMap.geojsonClick', function(geojsonClickEvent, feature) {
        $scope.modal.close(feature);
    });

    $scope.feature.$promise.then(function() {
      var feature = L.geoJson($scope.feature.data.geojson, {
        style: sauService.mapConfig.highlightStyle
      });
      var bounds = feature.getBounds();
      leafletData.getMap().then(function(map) {
        feature.addTo(map);
        map.fitBounds(bounds);
        map.invalidateSize(false); // fix drawing bug
      });

    });

  });
