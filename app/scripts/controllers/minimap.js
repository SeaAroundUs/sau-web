'use strict';

/* global leafletPip */
/* global L */

angular.module('sauWebApp')
  .controller('MiniMapCtrl', function ($scope, $rootScope, sauAPI, mapConfig, leafletBoundsHelpers, leafletData) {

    angular.extend($scope, {
      defaults: mapConfig.defaults,
      layers: {
        baselayers: mapConfig.baseLayers
      }
    });

    // add IFA boundaries
    var getIFA = function() {
      $scope.ifa = sauAPI.IFA.get({region_id: $scope.formModel.region_id}, function() {
        leafletData.getMap('minimap').then(function(map) {
          if($scope.ifaLayer) {
            map.removeLayer($scope.ifaLayer);
          }
          $scope.ifaLayer = L.geoJson($scope.ifa.data.geojson, {style: mapConfig.ifaStyle}).addTo(map);
        });
      });
    };

    // remove parent scope listener and add our own
    $scope.geojsonClick();
    $scope.geojsonMouseout();
    $scope.geojsonMouseover();

    var styleLayer = function(feature, layer, style) {
      if (!layer) {
        return;
      }
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
        $scope.styleSelectedFeature();
      }

    };

    var geojsonMouseout = function(ev, feature) {
      $rootScope.hoverRegion = {};
      styleLayer(feature, ev.layer);
    };

    var geojsonMouseover = function(ev, feature) {
      $rootScope.hoverRegion = feature;
      styleLayer(feature, ev.layer, mapConfig.highlightStyle);
    };

    leafletData.getMap('minimap').then(function(map) {
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
          });
        });
    });

    $scope.eachFeatureLayer = function(cb) {
      leafletData.getMap('minimap')
      .then(function(map) {
        map.eachLayer(function(l){
          if (l.feature) {
            cb(l);
          }
        });
      });
    };

    $scope.styleSelectedFeature = function () {
      $scope.eachFeatureLayer(function(l) {
        styleLayer(l.feature, l);
      });
      if ($scope.region.name === 'eez') {
        getIFA();
      }
    };

    var drawFAO = function(map) {
      var stripes = new L.StripePattern(mapConfig.hatchStyle);
      stripes.addTo(map);
      var faoStyle = mapConfig.faoStyle;
      faoStyle.fillPattern = stripes;

      var fao = sauAPI.Regions.get({region: 'fao'}, function() {

        if($scope.faoLayer) {
          map.removeLayer($scope.faoLayer);
        }
        $scope.faoLayer = L.geoJson(fao.data, {
          style: faoStyle,
          onEachFeature: function(feature, layer) {
            if(feature.properties.id === $scope.selectedFAO) {
              layer.setStyle(mapConfig.selectedFaoStyle);
            }
          }
        }).addTo(map);
      });
    };

    $scope.removeFAO = function() {
      console.debug('removing FAO');
      leafletData.getMap('minimap').then(function(map) {
        if($scope.faoLayer) {
          map.removeLayer($scope.faoLayer);
        }
      });
    };

    $scope.$watch('selectedFAO', function(){
      if ($scope.selectedFAO < 1) {
        return;
      }
      leafletData.getMap('minimap').then(function(map) {
        $scope.features.$promise.then(function() {
          drawFAO(map);
        });
      });
    });

    $scope.features.$promise.then(function() {
      // add features layer when loaded, then load IFA so IFA gets painted on top
      leafletData.getMap('minimap').then(function(map) {

        L.geoJson($scope.features.data.features, {
          style: mapConfig.defaultStyle,
          onEachFeature: function(feature, layer) {
            layer.on({
              click: function(e) {
                geojsonClick(feature, e.latlng);
              },
              mouseover: function(e) {geojsonMouseover(e, feature);},
              mouseout: function(e) {geojsonMouseout(e, feature); }
            });
          }
        }).addTo(map);
        $scope.styleSelectedFeature();
      });
    });
});
