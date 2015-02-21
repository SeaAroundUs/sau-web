'use strict';

/* global L */
/* global leafletPip */

angular.module('sauWebApp')
  .controller('MiniMapCtrl', function ($scope, $rootScope, $location, sauService, leafletBoundsHelpers, leafletData) {

    angular.extend($scope, {
      defaults: sauService.mapConfig.miniMapDefaults,
    });

    // remove parent scope listener and add our own
    $scope.geojsonClick();
    $scope.geojsonMouseout();

    var geojsonClick = function(feature, latlng) {
      /* handle clicks on overlapping layers */
      var layers = leafletPip.pointInLayer(latlng, $scope.map);
      var featureLayers = layers.filter(function(l) {return l.feature;});

      if (featureLayers.length > 1) {
        var content = 'Area disputed by (';
        content += featureLayers.map(function(l) {return l.feature.properties.title;}).join(', ');
        content += ')';
        leafletData.getMap().then(function(map) {
          map.openPopup(content, latlng);
        });
      } else {
        // $scope.geojsonClick(leafletClickEvent.latlng);
        $scope.formModel.region_id = feature.properties.region_id;
        $location.path('/' + $scope.region + '/' + feature.properties.region_id, false);
      }
    };
    $scope.$on('leafletDirectiveMap.geojsonClick', function(geojsonClickEvent, feature, leafletClickEvent) {
      geojsonClick(feature, leafletClickEvent.latlng);
    });

    $scope.$on('leafletDirectiveMap.geojsonMouseout', function(ev, feature) {
        $rootScope.hoverRegion = {};
        var layer = feature.layer;
        if(feature.target.feature.properties.region_id === $scope.feature.data.id) {
          layer.setStyle(sauService.mapConfig.selectedStyle);
        } else {
          layer.setStyle(sauService.mapConfig.defaultStyle);
        }
    });

    $scope.$watch('feature', function() {

      $scope.feature.$promise.then(function() {

        var feature = L.geoJson($scope.feature.data.geojson, {
          style: sauService.mapConfig.highlightStyle
        });
        var bounds = feature.getBounds();
        leafletData.getMap().then(function(map) {

          map.eachLayer(function(l){
            if (l.feature) {
              l.setStyle(sauService.mapConfig.defaultStyle);
              if (l.feature.properties.region_id === $scope.feature.data.id) {
                l.setStyle(sauService.mapConfig.selectedStyle);
              }
            }
          });

          map.fitBounds(bounds);
          map.invalidateSize(false); // fix drawing bug
        });

      });
    }, true);
  });
