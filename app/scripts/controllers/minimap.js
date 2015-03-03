'use strict';

/* global leafletPip */
/* global L */

angular.module('sauWebApp')
  .controller('MiniMapCtrl', function ($scope, $rootScope, mapConfig, leafletBoundsHelpers, leafletData) {

    angular.extend($scope, {
      defaults: mapConfig.defaults,
      layers: {
        baselayers: mapConfig.baseLayers
      }
    });

    // remove parent scope listener and add our own
    $scope.geojsonClick();
    $scope.geojsonMouseout();
    $scope.geojsonMouseover();

    var styleLayer = function(feature, layer, style) {
      style = style || mapConfig.defaultStyle;
      if(feature.properties.region_id === $scope.formModel.region_id) {
        layer.setStyle(mapConfig.selectedStyle);
      } else {
        layer.setStyle(style);
      }
    };

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
        styleLayer(l.feature, l);
      });
    };

    $scope.$on('leafletDirectiveMap.geojsonClick', function(geojsonClickEvent, feature, leafletClickEvent) {
      geojsonClick(feature, leafletClickEvent.latlng);
    });

    $scope.$on('leafletDirectiveMap.geojsonMouseout', function(ev, feature) {
        $rootScope.hoverRegion = {};
        var layer = feature.layer;
        styleLayer(feature.target.feature, layer);
    });

    $scope.$on('leafletDirectiveMap.geojsonMouseover', function(ev, feature, leafletEvent) {
      $rootScope.hoverRegion = feature;
      var layer = leafletEvent.layer;
      styleLayer(feature, layer, mapConfig.highlightStyle);
    });

    leafletData.getMap('minimap').then(function(map) {
      map.on('layeradd', function(ev) {
        if(ev.layer.feature) {
          if (parseInt(ev.layer.feature.properties.region_id) === parseInt($scope.formModel.region_id)) {
            ev.layer.setStyle(mapConfig.selectedStyle);
            // map.invalidateSize(true); // fix drawing bug
          }
        }
      });
      L.esri.basemapLayer('Oceans').addTo(map);
      L.esri.basemapLayer('OceansLabels').addTo(map);
    });

    $scope.$watch('feature', function() {
      leafletData.getMap('minimap')
        .then(function(map) {
          $scope.feature.$promise.then(function() {
            var f = L.geoJson($scope.feature.data.geojson);
            var bounds = f.getBounds();
            map.fitBounds(bounds);
            // map.invalidateSize(true); // fix drawing bug
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
          styleLayer(l.feature, l);
        });
      }, true);
    };

    $scope.$watch('formModel.region_id', function() {
      $scope.styleSelectedFeature();
  });
});
