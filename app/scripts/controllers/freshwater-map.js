;(function() {

  'use strict';

  /* global angular */
  /* global L */

  angular.module('sauWebApp').controller('FreshwaterMapCtrl',
    function ($scope, $routeParams, $q, sauAPI, region, mapConfig, leafletData, mainMapRegionConfig, $timeout, spinnerState, ga, $location) {

      var id = $routeParams.id;

      $scope.region = {name: region};

      $scope.dropDownSelect = function(value) {
        var searchOption = getSearchOptionByValue(parseInt(value));
        if (!searchOption) {
          return;
        }
        $scope.regionSelect(searchOption.entity_id, searchOption.sub_entity_id);
      };

      $scope.regionSelect = function(entity_id, sub_entity_id) {
        if (sub_entity_id) {
          // Use $location.path to set the base path and $location.search to add query parameters
          $location.path('/freshwater/' + entity_id).search('sub_entity_id', sub_entity_id);
        } else {
          // If there's no sub_entity_id, just set the path
          $location.path('/freshwater/' + entity_id);
        }
      };

      function onMapFeatureClick (event, feature) {
        var layers = leafletPip.pointInLayer(event.latlng, $scope.map);
        var featureLayers = layers.filter(function(l) {return l.feature;});
        ga.sendEvent({
          category: 'MainMap Click',
          action: $scope.region.name.toUpperCase(),
          label: feature.properties.title
        });

        $scope.regionSelect(feature.properties.freshwater_entity_id,feature.properties.sub_entity_id);

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
        var mapPromise = leafletData.getMap('freshwatermap');
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

          $scope.searchOptions = $scope.regionConfig.getSearchOptions(regionResponse);

          $timeout(function() {
            spinnerState.loading = false;
            map.invalidateSize();
          });
        })
      }

      leafletData.getMap('freshwatermap').then(function(map) {
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

      function getSearchOptionByValue(value) {
        for (var i = 0; i < $scope.searchOptions.length; i++) {
          if ($scope.searchOptions[i].value === value) {
            return { entity_id: $scope.searchOptions[i].entity_id, sub_entity_id: $scope.searchOptions[i].sub_entity_id };
          }
        }
        return null;
      }

      $scope.searchOptions = [];
      $scope.geojson = {};
      $scope.regionConfig = mainMapRegionConfig.getConfig($scope.region.name);
      getFeatures();
    });
})();
