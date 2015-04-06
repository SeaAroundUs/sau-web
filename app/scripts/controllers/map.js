'use strict';

/* global leafletPip */
/* global L */

angular.module('sauWebApp')
  .controller('MapCtrl', function ($scope,
                                    $rootScope,
                                    $http,
                                    $location,
                                    $route,
                                    $routeParams,
                                    $timeout,
                                    sauAPI,
                                    mapConfig,
                                    leafletData,
                                    leafletBoundsHelpers,
                                    region,
                                    spinnerState) {

    $scope.region = {name: region};

    $scope.regionSelect = function(region_id) {
      $location.path('/' + $scope.region.name + '/' + region_id);
    };

    if ($routeParams.id || $location.path() === '/global') {
      $scope.regionSelect(($routeParams.id || 1));
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
        $scope.regionSelect(feature.properties.region_id);
      }
    };

    $scope.handleGeojsonMouseover = function() {
      $scope.geojsonMouseover = $scope.$on('leafletDirectiveMap.geojsonMouseover', function(ev, feature, leafletEvent) {
        $rootScope.hoverRegion = feature;
        var layer = leafletEvent.layer;
        if (layer) {
          layer.setStyle(mapConfig.highlightStyle);
        }
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
        zoom: 2
      },
      defaults: mapConfig.defaults,
      layers: {
        baselayers: mapConfig.baseLayers
      }
    });

    $scope.changeRegion = function(region) {
      $scope.region.name = region;
      $location.path('/' + $scope.region.name, false);
      $scope.getFeatures();
    };

    $scope.changeRegionGlobal = function() {
      $scope.region.name = 'global';
      $location.path('/' + $scope.region.name, true);
    };

    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };

    $scope.geojson = {};

    $scope.getFeatures = function() {
      spinnerState.loading = true;
      $scope.features = sauAPI.Regions.get({region:$scope.region.name});
      $scope.features.$promise.then(function(data) {
        angular.extend($scope, {
          geojson: {
            data: data.data,
            style: mapConfig.defaultStyle,
          }
        });
        $timeout(function() { spinnerState.loading = false; });
      });
    };

    $scope.getFeatures();

  });
