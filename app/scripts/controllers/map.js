'use strict';

/**
 * @ngdoc function
 * @name sauWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sauWebApp
 */
angular.module('sauWebApp')
  .controller('MapCtrl', function ($scope, $q, $http, $location, $modal, $routeParams, sauService, SAU_CONFIG, leafletData, leafletBoundsHelpers, region, detailView) {

    $scope.$parent.region = region;

    var openModal = function(region_id) {
      $modal.open({
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
        // unless modal is open
        if (! detailView) {
          var newPath = $scope.region + '/' + feature.properties.region_id;
          openModal(feature.properties.region_id);
          $location.path(newPath, false);
        }
    });

    angular.extend($scope, {

      center: {
        lat: 0,
        lng: 0,
        zoom: 3
      },
      defaults: sauService.mapConfig.defaults

    });

    $scope.getRegions();

  });
