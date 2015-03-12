'use strict';

/* global leafletPip */
/* global L */

angular.module('sauWebApp')
  .controller('MapCtrl', function ($scope,
                                    $rootScope,
                                    $http,
                                    $location,
                                    $modal,
                                    $route,
                                    $routeParams,
                                    sauAPI,
                                    mapConfig,
                                    leafletData,
                                    leafletBoundsHelpers,
                                    region) {

    $scope.region.name = region;

    $scope.openModal = function(region_id) {
      if ($rootScope.modalInstance) {
        // clean house
        $rootScope.modalInstance.close();
      }

      $rootScope.modalInstance = $modal.open({
                templateUrl: 'views/region-detail/main.html',
                controller: 'RegionDetailCtrl',
                scope: $scope,
                size: 'lg',
                background: false,
                resolve: {
                  region_id: function () {
                    return region_id;
                  }
                }
      });

      var closedModal = function (result) {
        if (result && result.location) {
          $location.path(result.location);
          $route.reload();
        } else {
          // closed another way
          // modal needs to disable geojson clicks, reenable it=
          $scope.handleGeojsonClick();
          $scope.handleGeojsonMouseout();
          $scope.handleGeojsonMouseover();
          $location.path('/' + region, false);
        }
      };

      $rootScope.modalInstance.result.then(closedModal, closedModal);
    };

    if ($routeParams.id || $location.path() === '/global') {
      $scope.openModal($routeParams.id || 1);
    }

    leafletData.getMap('mainmap').then(function(map) {
      $scope.map = map;
      L.esri.basemapLayer('Oceans').addTo(map);
      L.esri.basemapLayer('OceansLabels').addTo(map);
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
        $scope.openModal(feature.properties.region_id);
      }
    };

    $scope.handleGeojsonMouseover = function() {
      $scope.geojsonMouseover = $scope.$on('leafletDirectiveMap.geojsonMouseover', function(ev, feature, leafletEvent) {
        $rootScope.hoverRegion = feature;
        var layer = leafletEvent.layer;
        layer.setStyle(mapConfig.highlightStyle);
      });
    };
    $scope.handleGeojsonMouseover();

    $scope.handleGeojsonMouseout = function() {
      $scope.geojsonMouseout = $scope.$on('leafletDirectiveMap.geojsonMouseout', function(ev, feature, leafletEvent) {
          $rootScope.hoverRegion = {};
          if (leafletEvent && leafletEvent.target) {
            leafletEvent.target.setStyle(mapConfig.defaultStyle);
          }
          if (feature && feature.target) {
            feature.target.setStyle(mapConfig.defaultStyle);
          }
      });
    };
    $scope.handleGeojsonMouseout();

    $scope.handleGeojsonClick = function() {
      $scope.geojsonClick = $scope.$on('leafletDirectiveMap.geojsonClick', function(geojsonClickEvent, feature, leafletClickEvent) {
          geojsonClick(leafletClickEvent.latlng);
      });
    };
    $scope.handleGeojsonClick();

    $scope.maxbounds = leafletBoundsHelpers.createBoundsFromArray([[-89, -200],[89, 200]]);

    angular.extend($scope, {
      center: {
        lat: 0,
        lng: 0,
        zoom: 3
      },
      defaults: mapConfig.defaults,
      layers: {
        baselayers: mapConfig.baseLayers
      }
    });

    $scope.changeRegion = function(region) {
      $location.path(region, false);
      $scope.region.name = region;
      $scope.getFeatures();
    };

    $scope.changeRegionGlobal = function() {
      $scope.region.name = 'global';
      $location.path($scope.region.name, true);
    };

    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };

    $scope.geojson = {};

    $scope.getFeatures = function() {

      $scope.features = sauAPI.Regions.get({region:$scope.region.name});
      $scope.features.$promise.then(function(data) {
          angular.extend($scope, {
            geojson: {
              data: data.data,
              style: mapConfig.defaultStyle,
            }
          });
        });
    };

    $scope.getFeatures();

  });
