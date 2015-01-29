'use strict';

/**
 * @ngdoc function
 * @name sauWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sauWebApp
 */
angular.module('sauWebApp')
  .controller('MapCtrl', ['$scope', '$http', 'leafletData', 'leafletBoundsHelpers', function ($scope, $http, leafletData, leafletBoundsHelpers) {

    $scope.$on('leafletDirectiveMap.geojsonMouseover', function(ev, feature, leafletEvent) {
        var layer = leafletEvent.target;
        layer.setStyle(highlightStyle);
        layer.bringToFront();
        $scope.$parent.$parent.hoverRegion = feature;
    });

    $scope.$on('leafletDirectiveMap.geojsonMouseout', function(ev, feature, leafletEvent) {
        $scope.$parent.$parent.hoverRegion = {};
    });

    $scope.$on('leafletDirectiveMap.geojsonClick', function(ev, featureSelected, leafletEvent) {
        // regionClick(featureSelected, leafletEvent);
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

    // get regions
    var url = 'http://localhost:8000/api/v1/eez/';
    $http.get(url, {cache: true})
      .success(function(data, status) {
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

    $scope.searchIP('');
  }]);