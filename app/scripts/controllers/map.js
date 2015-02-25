'use strict';

/* global leafletPip */
/* global L */

angular.module('sauWebApp')
  .controller('MapCtrl', function ($scope, $rootScope, $http, $location, $modal, $routeParams, sauService, SAU_CONFIG, leafletData, leafletBoundsHelpers) {

    $scope.search = {
      value: 'Type or select item from list'
    };
    $scope.searchTerms = [];

    $scope.features.$promise.then(function() {
      for (var i=0; i<$scope.geojson.data.features.length; i++) {
        $scope.searchTerms.push($scope.geojson.data.features[i].properties);
      }
    });

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
        } else if (selectedFeature && selectedFeature.location) {
          $location.path(selectedFeature.location);
        } else {
          // closed another way
          // modal needs to disable geojson clicks, reenable it=
          $scope.handleGeojsonClick();
          $scope.handleGeojsonMouseout();
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
      L.esri.basemapLayer('Oceans').addTo(map);
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
        openModal(feature.properties.region_id);
      }
    };

    $scope.handleGeojsonMouseover = function() {
      $scope.geojsonMouseover = $scope.$on('leafletDirectiveMap.geojsonMouseover', function(ev, feature, leafletEvent) {
        $rootScope.hoverRegion = feature;
        var layer = leafletEvent.layer;
        layer.setStyle(sauService.mapConfig.highlightStyle);
      });
    };
    $scope.handleGeojsonMouseover();

    $scope.handleGeojsonMouseout = function() {
      $scope.geojsonMouseout = $scope.$on('leafletDirectiveMap.geojsonMouseout', function(ev, feature, leafletEvent) {
          $rootScope.hoverRegion = {};
          if (leafletEvent && leafletEvent.target) {
            leafletEvent.target.setStyle(sauService.mapConfig.defaultStyle);
          }
          if (feature && feature.target) {
            feature.target.setStyle(sauService.mapConfig.defaultStyle);
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
      defaults: sauService.mapConfig.defaults,
      layers: {
        baselayers: {}
      }
    });

  });
