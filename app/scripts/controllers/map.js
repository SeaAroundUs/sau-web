'use strict';

/**
 * @ngdoc function
 * @name sauWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sauWebApp
 */
angular.module('sauWebApp')
  .controller('MapCtrl', function ($scope, $http, $location, $modal, $routeParams, sauService, SAU_CONFIG, leafletData, leafletBoundsHelpers, region) {

    $scope.$parent.region = region;

    var openModal = function(region_id) {
      return $modal.open({
                templateUrl: 'views/region-detail/main.html',
                controller: 'RegionDetailCtrl',
                scope: $scope,
                size: 'lg',
                resolve: {
                  region_id: function () {
                    return region_id;
                  }
                }
      });
    };

    if ($routeParams.id) {
      openModal($routeParams.id);
    }

    $scope.$on('leafletDirectiveMap.geojsonMouseover', function(ev, feature, leafletEvent) {
        $scope.$parent.hoverRegion = feature;
        var layer = leafletEvent.target;
        layer.setStyle(sauService.mapConfig.highlightStyle);
        layer.bringToFront();
    });

    $scope.$on('leafletDirectiveMap.geojsonMouseout', function( /* ev, feature, leafletEvent */) {
        $scope.$parent.$parent.hoverRegion = {};
    });

    $scope.$on('leafletDirectiveMap.geojsonClick', function(ev, feature) {
        var newPath = $location.path() + '/' + feature.properties.region_id;
        $location.path(newPath, false);
        openModal(feature.properties.region_id);
    });

    angular.extend($scope, {

      center: {
        lat: 0,
        lng: 0,
        zoom: 3
      },

      defaults: {
        tileLayer: 'http://{s}.tiles.mapbox.com/v3/examples.map-i87786ca/{z}/{x}/{y}.png',
        tileLayerOptions: {
          noWrap: true,
          detectRetina: true, // no idea what this does
          reuseTiles: true // nor this
        },
      }
    });

    $scope.getFeatures();

  });
