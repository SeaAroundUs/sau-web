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
        layers: { baselayers: mapConfig.baseLayers }
      });

      leafletData.getMap('region-data-minimap').then(function(map) {
        L.esri.basemapLayer('Oceans').addTo(map);
        L.esri.basemapLayer('OceansLabels').addTo(map);
      });

      $scope.$watch('region', function(region) {
        sauAPI.Region.get(
          { region: region.name, region_id: region.id },
          updateGeoJSON,
          function() { $scope.disabled = true; }
        );
      });

      //TODO probably needs updating for other geoJSON types (EEZ, IFA, etc)
      function updateGeoJSON(res) {
        leafletData.getMap('region-data-minimap').then(function(map) {
          if (res.data && res.data.geojson) {
            var f = L.geoJson(res.data.geojson, { style: mapConfig.countryStyle });
            var bounds = f.getBounds();
            f.addTo(map);
            map.fitBounds(bounds);
            $scope.disabled = false;
          } else {
            map.setZoom(1);
            $scope.disabled = true;
          }
        });
      }
    };

    return {
      controller: controller,
      link: function(scope, ele) {
        // don't show on global or fishing-entity
        if (['global', 'fishing-entity'].indexOf(scope.region.name) !== -1) {
          ele.remove();

        // don't show for multiple ids
        } else if (!scope.region.id) {
          ele.hide();
        }
      },
      restrict: 'E',
      scope: { region: '=' },
      template: '<leaflet layers="layers" id="region-data-minimap" ' +
        'maxbounds="maxbounds" center="center" defaults="defaults" ' +
        'ng-class="{\'disabled\': disabled}"></leaflet>'
    };
  });