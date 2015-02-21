'use strict';

/* global leafletPip */

angular.module('sauWebApp')
  .controller('MapCtrl', function ($scope, $rootScope, $http, $location, $modal, $routeParams, sauService, SAU_CONFIG, leafletData, leafletBoundsHelpers, region) {

    $scope.$parent.region = region;

    var openModal = function(region_id) {
      var modalInstance = $modal.open({
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

      var closedModal = function (selectedFeature) {
        if ( ((selectedFeature || {}).properties || {}).region_id  ) {
          // clicked feature
          $location.path('/' + $scope.region + '/' + selectedFeature.properties.region_id);
        } else {
          // closed another way
          // modal needs to disable geojson clicks, reenable it=
          $scope.handleGeojsonClick();
          $location.path('/' + $scope.region, false);
        }
      };

      modalInstance.result.then(closedModal, closedModal);
    };

    if ($routeParams.id || $location.path() === '/global') {
      openModal($routeParams.id || 1);
    }

    leafletData.getMap('mainmap').then(function(map) {
      $scope.map = map;
    });

    var geojsonClick = function(latlng) {
      /* handle clicks on overlapping layers */
      var layers = leafletPip.pointInLayer(latlng, $scope.map);
      var featureLayers = layers.filter(function(l) {return l.feature;});

      if (featureLayers.length > 1) {
        var content = 'Area disputed by (';
        content += featureLayers.map(function(l) {return l.feature.properties.title;}).join(', ');
        content += ')';
        $scope.map.openPopup(content, latlng);
      } else {
        var feature = featureLayers[0].feature;
        var newPath = $location.path() + '/' + feature.properties.region_id;
        $location.path(newPath, false);
        openModal(feature.properties.region_id);
      }
    };

    $scope.$on('leafletDirectiveMap.geojsonMouseover', function(ev, feature, leafletEvent) {
        $rootScope.hoverRegion = feature;
        var layer = leafletEvent.target;
        layer.setStyle(sauService.mapConfig.highlightStyle);
        layer.bringToFront();
    });

    $scope.$on('leafletDirectiveMap.geojsonMouseout', function( /* ev, feature, leafletEvent */) {
        $rootScope.hoverRegion = {};
    });

    $scope.handleGeojsonClick = function() {
      $scope.geojsonClick = $scope.$on('leafletDirectiveMap.geojsonClick', function(geojsonClickEvent, feature, leafletClickEvent) {
          geojsonClick(leafletClickEvent.latlng);
      });
    };
    $scope.handleGeojsonClick();

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
