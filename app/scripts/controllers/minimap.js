'use strict';

/* global L */

angular.module('sauWebApp')
  .controller('MiniMapCtrl', function ($scope, sauService, leafletBoundsHelpers, leafletData) {

    angular.extend($scope, {

      defaults: sauService.mapConfig.defaults,
      center: {
        lat: 0,
        lng: 0,
        zoom: 3
      },

    });
    $scope.$parent.feature.$promise.then(function() {
      var bounds = L.geoJson($scope.$parent.feature.data.geojson).getBounds();
      leafletData.getMap().then(function(map) {
        map.fitBounds(bounds);

      });

      angular.extend($scope, {
        geojson: {
          data: $scope.$parent.feature.data.geojson,
          style: sauService.mapConfig.defaultStyle,
          resetStyleOnMouseout: true
        },
      });
    });

  });
