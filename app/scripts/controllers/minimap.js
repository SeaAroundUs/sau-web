'use strict';

/**
 * @ngdoc function
 * @name sauWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sauWebApp
 */
angular.module('sauWebApp')
  .controller('MiniMapCtrl', function ($scope, sauService) {

    $scope.$on('leafletDirectiveMap.geojsonMouseover', function(ev, feature, leafletEvent) {
        // $scope.$parent.hoverRegion = feature;
        var layer = leafletEvent.target;
        layer.setStyle(highlightStyle);
        // layer.bringToFront();
    });

    $scope.$on('leafletDirectiveMap.geojsonMouseout', function( /* ev, feature, leafletEvent */) {
        // $scope.$parent.$parent.hoverRegion = {};
    });

    // $scope.$on('leafletDirectiveMap.geojsonClick', function(ev, feature) {
    //     // var newPath = $location.path() + '/' + feature.properties.region_id;
    //     // $location.path(newPath);
    // });

    var highlightStyle = sauService.mapConfig.highlightStyle;

    angular.extend($scope, {

      center: {
        lat: 0,
        lng: 0,
        zoom: 3
      },

      defaults: sauService.mapConfig.defaults,

    });
    $scope.$parent.feature.$promise.then(function() {
      angular.extend($scope, {
        geojson: {
          data: $scope.$parent.feature.data.geojson,
          style: sauService.mapConfig.defaultStyle,
          resetStyleOnMouseout: true
        }
      });
    });

  });
