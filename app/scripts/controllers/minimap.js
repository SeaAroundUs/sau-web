'use strict';

/* global L */

angular.module('sauWebApp')
  .controller('MiniMapCtrl', function ($scope, $rootScope, $location, sauService, leafletBoundsHelpers, leafletData) {

    angular.extend($scope, {
      defaults: sauService.mapConfig.miniMapDefaults,
    });

    // remove parent scope listener and add our own
    $scope.geojsonClick();
    $scope.geojsonMouseout();

    $scope.$on('leafletDirectiveMap.geojsonClick', function(geojsonClickEvent, feature) {
      $scope.formModel.region_id = feature.properties.region_id;
      $location.path('/' + $scope.region + '/' + feature.properties.region_id, false);
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
