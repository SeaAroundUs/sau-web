;(function() {

  /* global L */

  'use strict';

  angular.module('sauWebApp').controller('MaricultureCtrl', function($scope, $http, $q, mapConfig, sauAPI, leafletData, leafletBoundsHelpers, openModal) {

    $scope.region = {name: 'mariculture'};

    angular.extend($scope, {
      center: {
        lat: 0,
        lng: 0,
        zoom: 2
      },
      defaults: mapConfig.defaults,
      layers: {
        baselayers: mapConfig.baseLayers
      },
      maxbounds: leafletBoundsHelpers.createBoundsFromArray([[-89, -200],[89, 200]])
    });

    leafletData.getMap('mainmap').then(function(map) {
      $scope.map = map;
      L.esri.basemapLayer('Oceans').addTo(map);
      L.esri.basemapLayer('OceansLabels').addTo(map);
    });

    $scope.selected = function(feature) {
      console.log(feature);
      var region_id = feature.iso_a3;
      openModal.open(region_id, $scope);
    };

    // fake it 'till you make it
    $scope.geojsonClick = function() {};
    $scope.geojsonMouseout = function() {};
    $scope.geojsonMouseover = function() {};

    $scope.features = {$promise: $q.defer()};

    $http.get('bower_components/geo-boundaries-world-110m/countries.geojson')
      .success(function(data) {
        $scope.features.data = data;
        angular.extend($scope, {
          features: {
            data: data
          },
          geojson: {
            data: data,
            style: mapConfig.countryStyle,
            onEachFeature: function(feature, layer) {
              layer.on({
                click: function() {
                  $scope.selected(layer.feature.properties);
                },
                mouseover: function() {
                  layer.setStyle(mapConfig.selectedStyle);
                },
                mouseout: function() {
                  layer.setStyle(mapConfig.countryStyle);
                }
              });
            }
          }
        });
      });
  });
})();