;(function() {

  'use strict';

  /* global angular */
  /* global L */

  angular.module('sauWebApp')
  .controller('EstuariesCtrl', function ($scope, $routeParams, sauAPI, region, mapConfig, leafletData) {

    var id = $routeParams.id;

    $scope.region = sauAPI.Region.get({region: region, region_id: id});

    $scope.model = {};

    var estuariesData = sauAPI.EstuariesData.get({region: region, region_id: id}, function() {
      angular.extend($scope, {
        geojson: {
          data: estuariesData.data,
          pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
              fillColor: feature.fillColor,
              color: '#000',
              fillOpacity: 0.8,
              weight: 1,
              radius: 5,
              opacity: 0.8,
              stroke: true
            });
          }
        }
      });

      $scope.model.selectedFeature = estuariesData.data.features[0];

    });

    $scope.onSelect = function(f) {
      $scope.model.selectedFeature = f;
    };

    var regions = sauAPI.Regions.get({region: region}, function() {
      $scope.regions = regions.data;
      leafletData.getMap('estuariesmap')
      .then(function(map) {
        // draw EEZ regions on map
        var f = L.geoJson(regions.data);
        f.setStyle(mapConfig.noClickStyle);
        f.addTo(map);
        // now highlight EEZ regions specified in the estuaries response,
        // fit map to those bounds to filter out scattered data
        estuariesData.$promise.then(function() {
          var bounds = null;
          map.eachLayer(function(l) {
            if(l.feature && l.feature.properties.region_id === Number(id)) {
              l.setStyle(mapConfig.highlightStyle);
              if (bounds) {
                bounds.extend(l.getBounds());
              } else {
                bounds = l.getBounds();
              }
              map.fitBounds(bounds);
              map.setView(bounds.getCenter());
            }
          });
        });
      });
    });

    leafletData.getMap('estuariesmap').then(function(map) {
      L.esri.basemapLayer('Oceans').addTo(map);
      L.esri.basemapLayer('OceansLabels').addTo(map);
    });

    $scope.$on('leafletDirectiveMap.geojsonMouseover', function(geojsonClickEvent, feature) {
      $scope.model.selectedFeature = feature;
    });

    $scope.$watch('model.selectedFeature.properties.title', function() {
      if (!$scope.geojson || !$scope.model.selectedFeature.properties) {
        return;
      }
      for (var i=0; i < $scope.geojson.data.features.length; i++){
        if ($scope.model.selectedFeature.properties.title === $scope.geojson.data.features[i].properties.title) {
          $scope.geojson.data.features[i].fillColor = '#f00';
        } else {
          $scope.geojson.data.features[i].fillColor = '#0f0';
        }
      }
      $scope.geojson.foo = new Date(); // force an update to geojson
    }, true);

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
  });
})();
