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

    var openModal = function(region_options) {
      return $modal.open({
                templateUrl: 'views/region-detail/main.html',
                controller: 'RegionDetailCtrl',
                size: 'lg',
                resolve: {
                  region_options: function () {
                    return region_options;
                  }
                }
      });
    };

    $scope.$parent.region = region;

    if ($routeParams.id) {
      openModal({region: region, region_id: $routeParams.id});
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
        openModal({region: $scope.region, region_id: feature.properties.region_id});
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

    $scope.searchIP = function(ip) {
      var url = 'http://freegeoip.net/json/' + ip;
      $http.defaults.headers.common = {};
      $http.get(url).success(function(res) {
        $scope.center = {
          lat: res.latitude,
          lng: res.longitude,
          zoom: 3
        };
        $scope.ip = res.ip;
        console.log(res);
      });
    };

    // $scope.searchIP('');
  });
