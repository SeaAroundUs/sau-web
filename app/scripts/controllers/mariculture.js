;(function() {

  'use strict';

  angular.module('sauWebApp').controller('MaricultureCtrl', function($scope, mapConfig, sauAPI, leafletData) {

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

    leafletData.getMap('mainmap').then(function(map) {
      $scope.map = map;
      L.esri.basemapLayer('Oceans').addTo(map);
      L.esri.basemapLayer('OceansLabels').addTo(map);
    });

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
})();