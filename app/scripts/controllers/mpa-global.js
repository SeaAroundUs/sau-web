;(function() {

  'use strict';

  /* global angular */
  /* global L */

  angular.module('sauWebApp').controller('MPAGlobalCtrl',
    function ($scope, $routeParams, $q, sauAPI, region, mapConfig, leafletData, mainMapRegionConfig, $timeout, spinnerState, ga, $location) {

      var id = $routeParams.id;

      $scope.region = {name: region};

      $scope.regionSelect = function(region_id) {
        $location.path('/mpa/' + region_id);
      };

      function onMapFeatureClick (event, feature) {
        var layers = leafletPip.pointInLayer(event.latlng, $scope.map);
        var featureLayers = layers.filter(function(l) {return l.feature;});
        ga.sendEvent({
          category: 'MainMap Click',
          action: $scope.region.name.toUpperCase(),
          label: feature.properties.title
        });

        $scope.regionSelect(feature.properties.region_id);

      }

      function onMapFeatureMouseOver (event, feature, layer) {
        layer.setStyle(mapConfig.highlightStyle);
      }

      function onMapFeatureMouseMove (event, feature) {
        var content;
        content = $scope.region.name === 'fao' ?
        feature.properties.title + ' (' + feature.properties.region_id + ')' :
        feature.properties.title;

        new L.Rrose({ offset: new L.Point(0,-10), closeButton: false, autoPan: false, xEdge: 175, yEdge: 195})
        .setContent(content)
        .setLatLng(event.latlng)
        .openOn($scope.map);
      }

      function onMapFeatureMouseOut (event, feature) {
        if (event && event.target) {
          event.target.setStyle(mapConfig.defaultStyle);
        }
        if (feature && feature.target) {
          feature.target.setStyle(mapConfig.defaultStyle);
        }
      }

      function getFeatures () {
        var regionResource = $scope.regionConfig.requestData();
        var mapPromise = leafletData.getMap('mpaglobalmap');

        $q.all([mapPromise, regionResource.$promise]).then(function(result) {
          var map = result[0];
          var regionResponse = result[1];
          angular.extend($scope, {
            geojson: {
              data: $scope.regionConfig.getGeoJsonData(regionResponse),
              style: $scope.regionConfig.geoJsonStyle,
              onEachFeature: function (feature, layer) {
                layer.on({
                  click: function (event) {
                    onMapFeatureClick(event, feature, layer);
                  },
                  mouseover: function (event) {
                    onMapFeatureMouseOver(event, feature, layer);
                  },
                  mousemove: function (event) {
                    onMapFeatureMouseMove(event, feature, layer);
                  },
                  mouseout: function (event) {
                    onMapFeatureMouseOut (event, feature, layer);
                  }
                });
              }
            }
          });
        })

        var mpapointsData = sauAPI.MPAPointsData.get({region: region, region_id: 999}, function() {
          $scope.regions = mpapointsData.data;
          leafletData.getMap('mpaglobalmap')
          .then(function(map) {
            var f = L.geoJson(mpapointsData.data, {
              pointToLayer: function(feature, latlng) {
                if (feature.properties.point_cat === 'less than 100') {
                  return L.circleMarker(latlng, {
                    radius: 6,
                    fillColor: "#FF6700",
                    color: "#000",
                    fillOpacity: 1,
                    stroke: true
                  });

                } else if (feature.properties.point_cat === 'between 100 and 1000') {
                  return L.circleMarker(latlng, {
                    radius: 7,
                    fillColor: "#FFFF00",
                    color: "#000",
                    fillOpacity: 1,
                    stroke: true
                  });

                } else {
                  return L.circleMarker(latlng, {
                    radius: 8,
                    fillColor: "#0f0",
                    color: "#000",
                    fillOpacity: 1,
                    stroke: true
                  });
                }
              }
            });
            f.addTo(map);
          });
        });
      }

      leafletData.getMap('mpaglobalmap').then(function(map) {
        $scope.map = map;
        L.esri.basemapLayer('Oceans').addTo(map);
        L.esri.basemapLayer('OceansLabels').addTo(map);
      });

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

      $scope.geojson = {};
      $scope.regionConfig = mainMapRegionConfig.getConfig($scope.region.name);
      getFeatures();
    });
})();
