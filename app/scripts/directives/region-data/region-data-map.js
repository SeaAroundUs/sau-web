'use strict';

/* global leafletPip */
/* global L */

angular.module('sauWebApp')
  .directive('regionDataMap', function() {
    var controller = function($scope, mapConfig, leafletBoundsHelpers, leafletData) {
      angular.extend($scope, {
        defaults: mapConfig.defaults,
        faoLayers: [],
        maxbounds: mapConfig.worldBounds,
        center: { lat: 0, lng: 0, zoom: 3 },
        layers: { baselayers: mapConfig.baseLayers }
      });

      leafletData.getMap('region-data-minimap').then(function(map) {
        L.esri.basemapLayer('Oceans').addTo(map);
        L.esri.basemapLayer('OceansLabels').addTo(map);
      });
    };

    return {
      controller: controller,
      restrict: 'E',
      scope: { region: '=' },
      template: '<leaflet layers="layers" id="region-data-minimap" ' +
        'maxbounds="maxbounds" center="center" defaults="defaults"></leaflet>'
    };
  });
