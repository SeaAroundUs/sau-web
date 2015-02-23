'use strict';

/* global leafletPip */
/* global L */

angular.module('sauWebApp')
  .controller('MiniMapCtrl', function ($scope, $rootScope, $location, sauService, leafletBoundsHelpers, leafletData) {

    angular.extend($scope, {
      defaults: sauService.mapConfig.miniMapDefaults,
    });

    // remove parent scope listener and add our own
    $scope.geojsonClick();
    $scope.geojsonMouseout();
    $scope.geojsonMouseover();

    var geojsonClick = function(feature, latlng) {
      /* handle clicks on overlapping layers */
      var layers = leafletPip.pointInLayer(latlng, $scope.map);
      var featureLayers = layers.filter(function(l) {return l.feature;});

      if (featureLayers.length > 1) {
        var content = 'Area disputed by (';
        content += featureLayers.map(function(l) {return l.feature.properties.title;}).join(', ');
        content += ')';
        leafletData.getMap('minimap').then(function(map) {
          map.openPopup(content, latlng);
        });
      } else {
        $scope.formModel.region_id = feature.properties.region_id;
      }

      $scope.eachFeatureLayer(function(l) {
        if(l.feature.properties.region_id === $scope.formModel.region_id) {
          l.setStyle(sauService.mapConfig.selectedStyle);
        } else {
          l.setStyle(sauService.mapConfig.defaultStyle);
        }
      });
      leafletData.getMap('minimap').then(function(map) {
        map.invalidateSize(true); // fix drawing bug
      });
    };

    $scope.$on('leafletDirectiveMap.geojsonClick', function(geojsonClickEvent, feature, leafletClickEvent) {
      geojsonClick(feature, leafletClickEvent.latlng);
    });

    $scope.$on('leafletDirectiveMap.geojsonMouseout', function(ev, feature) {
        $rootScope.hoverRegion = {};
        var layer = feature.layer;
        if(feature.target.feature.properties.region_id === $scope.formModel.region_id) {
          layer.setStyle(sauService.mapConfig.selectedStyle);
        } else {
          layer.setStyle(sauService.mapConfig.defaultStyle);
        }
    });

    $scope.$on('leafletDirectiveMap.geojsonMouseover', function(ev, feature, leafletEvent) {
      $rootScope.hoverRegion = feature;
      var layer = leafletEvent.layer;
      if(feature.properties.region_id === $scope.formModel.region_id) {
        layer.setStyle(sauService.mapConfig.selectedStyle);
      } else {
        layer.setStyle(sauService.mapConfig.highlightStyle);
      }
    });

    leafletData.getMap('minimap').then(function(map) {
      map.on('layeradd', function(ev) {
        if(ev.layer.feature) {
          if (parseInt(ev.layer.feature.properties.region_id) === parseInt($scope.formModel.region_id)) {
            ev.layer.setStyle(sauService.mapConfig.selectedStyle);
            map.invalidateSize(true); // fix drawing bug
          }
        }
      });
    });


    $scope.$watch('feature', function() {
      leafletData.getMap('minimap')
        .then(function(map) {
          $scope.feature.$promise.then(function() {
            var f = L.geoJson($scope.feature.data.geojson);
            var bounds = f.getBounds();
            map.fitBounds(bounds);
            map.invalidateSize(true); // fix drawing bug
          });
        });

    });

    $scope.eachFeatureLayer = function(cb) {
      leafletData.getMap('minimap').then(function(map) {
        map.eachLayer(function(l){
          if (l.feature) {
            cb(l);
          }
        });
      });
    };

    $scope.styleSelectedFeature = function () {
      $scope.features.$promise.then(function() {
        $scope.eachFeatureLayer(function(l) {
          l.setStyle(sauService.mapConfig.defaultStyle);
          if (l.feature.properties.region_id === $scope.formModel.region_id) {
            l.setStyle(sauService.mapConfig.selectedStyle);
          } else {
            l.setStyle(sauService.mapConfig.defaultStyle);
          }
        });
      }, true);
    };

    $scope.$watch('formModel.region_id', function() {
      $scope.styleSelectedFeature();
  });
});
