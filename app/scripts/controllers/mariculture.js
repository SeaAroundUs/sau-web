/* global L */

'use strict';

angular.module('sauWebApp').controller('MaricultureCtrl', function($scope, $resource, $location, $timeout, mapConfig,
                                                                   sauAPI, leafletData, leafletBoundsHelpers, spinnerState) {

  $scope.region = {name: 'mariculture'};
  $scope.selectedRegion = {feature: null};

  angular.extend($scope, {
    center: {
      lat: 0,
      lng: 0,
      zoom: 2
    },
    defaults: mapConfig.defaults,
    layers: {
      baselayers: mapConfig.baseLayers
    },
    maxbounds: leafletBoundsHelpers.createBoundsFromArray([[-89, -200],[89, 200]])
  });

  leafletData.getMap('mainmap').then(function(map) {
    L.esri.basemapLayer('Oceans').addTo(map);
    L.esri.basemapLayer('OceansLabels').addTo(map);
  });

  $scope.selected = function(feature) {
    $location.path('/mariculture/' + feature.region_id);
  };

  $scope.features = sauAPI.Regions.get({region: $scope.region.name});

  spinnerState.loading = true;

  $scope.features.$promise.then(function(data) {
    angular.extend($scope, {
      geojson: {
        data: data.data,
        style: mapConfig.defaultStyle,
        onEachFeature: function(feature, layer) {
          layer.on({
            click: function() {
              $scope.selected(layer.feature.properties);
            },
            mouseover: function() {
              layer.setStyle(mapConfig.highlightStyle);
              $scope.selectedRegion.feature = feature;
            },
            mouseout: function() {
              layer.setStyle(mapConfig.defaultStyle);
            }
          });
        }
      }
    });

    $timeout(function() {
      spinnerState.loading = false;
    });
  });
});
