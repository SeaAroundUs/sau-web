'use strict';

/**
 * @ngdoc function
 * @name sauWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sauWebApp
 */
angular.module('sauWebApp')
  .controller('MapCtrl', function ($scope, $http, $location, $modal, $routeParams, SAU_CONFIG, leafletData, leafletBoundsHelpers) {

    $scope.$on('leafletDirectiveMap.geojsonMouseover', function(ev, feature, leafletEvent) {
        var layer = leafletEvent.target;
        layer.setStyle(highlightStyle);
        layer.bringToFront();
        $scope.$parent.$parent.hoverRegion = feature;
    });

    $scope.$on('leafletDirectiveMap.geojsonMouseout', function( /* ev, feature, leafletEvent */) {
        $scope.$parent.$parent.hoverRegion = {};
    });

    var openModal = function(feature) {
      return $modal.open({
                templateUrl: 'views/region-detail/main.html',
                controller: 'RegionDetailCtrl',
                size: 'lg',
                resolve: {
                  feature: function () {
                    return feature;
                  },
                  region_id: {
                    feature: function() {
                      return $scope.region_id;
                    }
                  }
                }
      });
    };

    if ($routeParams.id) {
      var feature = {region_id: $routeParams.id}; // FIXME: get feature from controller
      openModal(feature);
    }

    $scope.$on('leafletDirectiveMap.geojsonClick', function(ev, feature, leafletEvent) {

        console.debug(leafletEvent);

        var modalInstance = openModal(feature);

        modalInstance.result.then(function (selectedItem) {
          $scope.selected = selectedItem;
        }, function () {
          console.log('Modal dismissed at: ' + new Date());
        });

    });

    var highlightStyle = {
        fillColor: '#00f',
    };

    var defaultStyle = {
      color: 'black',
      stroke: true,
      weight: 1,
      opacity: 1.0,
      fillColor: 'black',
      fillOpacity: 0.3,
      lineCap: 'round'
    };

    var maxBounds = leafletBoundsHelpers.createBoundsFromArray([
      [-85, -180],
      [85, 180]
    ]);

    angular.extend($scope, {

      center: {
        lat: 0,
        lng: 0,
        zoom: 3
      },

      maxbounds: maxBounds,

      defaults: {
        tileLayer: 'http://{s}.tiles.mapbox.com/v3/examples.map-i87786ca/{z}/{x}/{y}.png',
        tileLayerOptions: {
          noWrap: true,
          detectRetina: true, // no idea what this does
          reuseTiles: true // nor this
        },
      }
    });

    // FIXME: duplicated from region-detail.js
    var removePathId = function(path) {
      var to = path.lastIndexOf('/');
      to = to === -1 ? path.length : to + 1;
      return path.substring(0, to);
    };

    // get regions
    var url = SAU_CONFIG.api_url;
    // move the prefixed '/' to postfix for the API
    var region = '';
    var path = $location.$$path.slice(1);
    if ($routeParams.id) {
      region = removePathId(path) + '/';
    } else {
      region = path + '/';
    }
    url = url + region;
    $http.get(url, {cache: true})
      .success(function(data) {
        angular.extend($scope, {
          geojson: {
            data: data.data,
            style: defaultStyle,
            resetStyleOnMouseout: true
          }
        });
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
