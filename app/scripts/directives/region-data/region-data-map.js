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

          // handle maps with multiple eezs
          } else if (res.data && res.data.eezs && res.data.eezs[0].geojson) {
            var group = new L.featureGroup(res.data.eezs.map(function(eez) {
              var f = L.geoJson(eez.geojson, { style: mapConfig.countryStyle });
              f.addTo(map);
              return f;
            }));
            map.fitBounds(group.getBounds());
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
        // don't show on multi regions
        if (!scope.region.id) {
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
