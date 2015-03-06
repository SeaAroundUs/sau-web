;(function() {

  'use strict';

  /* global angular */
  /* global L */

  angular.module('sauWebApp')
    .controller('EstuariesCtrl', function ($scope, $routeParams, sauAPI, region, mapConfig, leafletData) {

      var id = $scope.region.name_id || $routeParams.id;

      $scope.region = sauAPI.Region.get({region: region, region_id: id});

      leafletData.getMap('estuariesmap').then(function(map) {
        L.esri.basemapLayer('Oceans').addTo(map);
        L.esri.basemapLayer('OceansLabels').addTo(map);
      });

      $scope.selected = {};

      var data = sauAPI.EstuariesData.get({region: region, region_id: id}, function() {
        angular.extend($scope, {
          geojson: {
            data: data.data,
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    fillColor: feature.fillColor,
                    color: '#000',
                    fillOpacity: 0.8,
                    weight: 1,
                    radius: 5,
                    opacity: 0.8,
                    stroke: true
                  });
                }
            }
        });

        $scope.selected = data.data.features[0];

        leafletData.getMap('estuariesmap')
          .then(function(map) {
              var f = L.geoJson(data.data);
              var bounds = f.getBounds();
              map.fitBounds(bounds);
          });
      });

      $scope.$on('leafletDirectiveMap.geojsonMouseover', function(geojsonClickEvent, feature) {
        $scope.selected = feature;
      });

      $scope.$watch('selected', function() {
        if (!$scope.geojson) {
          return;
        }
        for (var i=0; i < $scope.geojson.data.features.length; i++){
          if ($scope.selected.properties.title === $scope.geojson.data.features[i].properties.title) {
            $scope.geojson.data.features[i].fillColor = '#f00';
          } else {
            $scope.geojson.data.features[i].fillColor = '#0f0';
          }
        }
        $scope.geojson.foo = new Date(); // force an update to geojson
      }, true);

      angular.extend($scope, {
        center: {
          lat: 0,
          lng: 0,
          zoom: 3
        },
        defaults: mapConfig.defaults,
        layers: {
          baselayers: mapConfig.baseLayers
        }
      });
    });
})();
