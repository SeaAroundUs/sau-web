'use strict';

/* global leafletPip */
/* global L */

angular.module('sauWebApp')
  .directive('regionDataMap', function() {
    var controller = function($scope, mapConfig, leafletBoundsHelpers, leafletData, sauAPI) {
      angular.extend($scope, {
        defaults: mapConfig.defaults,
        faoLayers: [],
        maxbounds: mapConfig.worldBounds,
        center: { lat: 0, lng: 0, zoom: 3 },
        layers: { baselayers: mapConfig.baseLayers },
        style: mapConfig.defaultStyle
      });

      leafletData.getMap('region-data-minimap').then(function(map) {
        L.esri.basemapLayer('Oceans').addTo(map);
        L.esri.basemapLayer('OceansLabels').addTo(map);
      });

      $scope.$watch('region', function(region) {
        sauAPI.Region.get({ region: region.name, region_id: region.id }, updateGeoJSON);
      });

      //TODO probably needs updating for other geoJSON types (EEZ, IFA, etc)
      function updateGeoJSON(res) {
        leafletData.getMap('region-data-minimap').then(function(map) {
          if (res.data && res.data.geojson) {
            var f = L.geoJson(res.data.geojson);
            var bounds = f.getBounds();
            map.fitBounds(bounds);
          } else {
            map.setZoom(1);
          }
        });
      }
    };

    return {
      controller: controller,
      link: function(scope, ele) {
        // don't show on global
        if (scope.region.name === 'global') {
          ele.remove();

        // don't show for multiple ids
        } else if (!scope.region.id) {
          ele.hide();
        }
      },
      restrict: 'E',
      scope: { region: '=' },
      template: '<leaflet layers="layers" id="region-data-minimap" ' +
        'maxbounds="maxbounds" center="center" defaults="defaults"></leaflet>'
    };
  });
