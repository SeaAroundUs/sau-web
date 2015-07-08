'use strict';

/* global L */

angular.module('sauWebApp')
  .controller('MiniMapMaricultureCtrl', function ($scope, $rootScope, $q, $timeout, $location, sauAPI, mapConfig,
                                                  leafletBoundsHelpers, leafletData, sauD3Utils, ga) {

    angular.extend($scope, {
      defaults: mapConfig.defaults,
      layers: {
        baselayers: mapConfig.baseLayers
      },
      provinceLayers: []
    });

    var geojsonClick = function(feature) {
      ga.sendEvent({
        category: 'MiniMap Click',
        action: 'Mariculture',
        label: feature.country_name + ' (' + feature.title + ')'
      });

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
      $q.all([$scope.countryFeatures.$promise]).then(function() {
        angular.extend($scope, {
          geojson: {
            data: $scope.countryFeatures.data,
            style: mapConfig.defaultStyle,
            onEachFeature: function(feature, layer) {
              layer.on({
                click: function() {
                  $scope.formModel.region_id = layer.feature.properties.region_id;
                  $location.path('/mariculture/' + layer.feature.properties.region_id, false);
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
                  layer.setStyle(mapConfig.defaultStyle);
                  $rootScope.hoverRegion = {};
                }
              });
            }
          }
        });
      });
    });

    $scope.$watch('formModel.region_id', function() {

      $q.all([$scope.features.$promise, $scope.countryFeatures.$promise]).then(function() {
        leafletData.getMap('minimap').then(function(map) {
          var points = [];
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

            var metric = feature.total_production;

            var circleProperties = sauD3Utils.pointCircleProperties(metric);

            var layer = L.geoJson(feature.point_geojson, {
              pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                  fillColor: circleProperties.color,
                  color: '#000',
                  fillOpacity: 1.0,
                  opacity: 1.0,
                  weight: 1,
                  radius: circleProperties.size,
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
          $timeout(function(){
            map.fitBounds(bounds);
            /*
            map.eachLayer(function(l){
              if (l.feature && l.feature.properties) {
                if(l.feature.properties.region_id === $scope.formModel.region_id) {
                  var featureBounds = L.geoJson(l.feature).getBounds();
                  bounds.extend(featureBounds);
                  map.fitBounds(bounds);
                }
              }
            });
            */
          });
        });
      });
    }, true);
  });
