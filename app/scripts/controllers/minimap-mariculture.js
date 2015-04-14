'use strict';

/* global d3 */
/* global L */

angular.module('sauWebApp')
  .controller('MiniMapMaricultureCtrl', function ($scope, $rootScope, $q, $timeout, $location, sauAPI, mapConfig, leafletBoundsHelpers, leafletData) {

    angular.extend($scope, {
      defaults: mapConfig.defaults,
      layers: {
        baselayers: mapConfig.baseLayers
      },
      provinceLayers: []
    });

    var geojsonClick = function(feature) {
      $scope.selectedProvince.feature = feature;
      $scope.$apply();
    };

    var geojsonMouseout = function() {
      $rootScope.hoverRegion = {};
    };

    var geojsonMouseover = function(ev, feature) {
      $rootScope.hoverRegion = {properties: feature};
    };

    leafletData.getMap('minimap').then(function(map) {
      L.esri.basemapLayer('Oceans').addTo(map);
      L.esri.basemapLayer('OceansLabels').addTo(map);
    });

    $scope.$watch('formModel', function() {

      $q.all([$scope.features.$promise, $scope.countryFeatures.$promise]).then(function() {
        // add features layer when loaded
        angular.extend($scope, {
          geojson: {
            data: $scope.countryFeatures.data,
            style: mapConfig.countryStyle,
            onEachFeature: function(feature, layer) {
              layer.on({
                click: function() {
                  $scope.formModel.region_id = layer.feature.properties.c_number;
                  $scope.formModel.iso_code = layer.feature.properties.c_iso_code;
                  $location.path('/mariculture/' + layer.feature.properties.c_number, false);
                  $scope.$apply();
                },
                mouseover: function() {
                  layer.setStyle(mapConfig.selectedStyle);
                  if ($scope.selectedFeature) {
                    $scope.selectedRegion.feature = feature;
                  }
                  $rootScope.hoverRegion = feature;
                },
                mouseout: function() {
                  layer.setStyle(mapConfig.countryStyle);
                  $rootScope.hoverRegion = {};
                }
              });
            }
          }
        });

        leafletData.getMap('minimap').then(function(map) {
          var points = [];
          var colorScale = d3.scale.quantize().domain([0,100,1000,10000,100000,100000000]).range(['green', '#0f0', 'yellow', 'orange', 'pink', 'red']);
          for (var i=0; i<$scope.provinceLayers.length; i++) {
            map.removeLayer($scope.provinceLayers[i]);
          }
          $scope.provinceLayers = [];
          angular.forEach($scope.features.data, function(feature) {
            if(! feature.point_geojson) {
              return;
            }
            feature.point_geojson.properties = {
              title: feature.title,
              region_id: feature.region_id,
            };
            // 2 visual dimensions representing the same value. The sea fills with Tufte's tears.
            var metric = feature.total_production * 1000.0;
            var pointSize = 1.5*Math.log10(metric/500.0);
            var color = colorScale(metric);

            var layer = L.geoJson(feature.point_geojson, {
              pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                  fillColor: color,
                  color: '#000',
                  fillOpacity: 0.8,
                  opacity: 0.8,
                  weight: 1,
                  radius: pointSize,
                  stroke: true
                });
              },
              onEachFeature: function(f, layer) {
                layer.on({
                  click: function(e) {
                    geojsonClick(feature, e.latlng);
                  },
                  mouseover: function(e) {geojsonMouseover(e, feature);},
                  mouseout: function(e) {geojsonMouseout(e, feature); }
                });
              }
            }).addTo(map);
            $scope.provinceLayers.push(layer);
            var point = feature.point_geojson.coordinates[0];
            point.reverse();
            points.push(point);
          });
          var bounds = L.latLngBounds(points);
          map.fitBounds(bounds);
        });
      });
    }, true);

  });
