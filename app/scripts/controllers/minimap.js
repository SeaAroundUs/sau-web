'use strict';

/* global L */

angular.module('sauWebApp')
  .controller('MiniMapCtrl', function ($scope, sauService, leafletBoundsHelpers, leafletData) {

    angular.extend($scope, {
      defaults: sauService.mapConfig.miniMapDefaults,
    });

    $scope.feature.$promise.then(function() {
      var bounds = L.geoJson($scope.feature.data.geojson).getBounds();
      leafletData.getMap().then(function(map) {
        map.fitBounds(bounds);
        map.invalidateSize(false); // fix drawing bug
      });

      angular.extend($scope, {
        geojson: {
          data: $scope.feature.data.geojson,
          style: sauService.mapConfig.defaultStyle,
        },
      });
    });

  });