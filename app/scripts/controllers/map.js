'use strict';

// jshint unused:false

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
                                    $q,
                                    sauAPI,
                                    mapConfig,
                                    leafletData,
                                    leafletBoundsHelpers,
                                    region,
                                    spinnerState,
                                    createDisputedAreaPopup,
                                    ga,
                                    mainMapRegionConfig) {

    $scope.region = {name: region};

    if ($routeParams.id || $location.path() === '/global') {
      $scope.regionSelect(($routeParams.id || 1));
    }

    leafletData.getMap('mainmap').then(function(map) {
      $scope.map = map;
      L.esri.basemapLayer('Oceans').addTo(map);
      L.esri.basemapLayer('OceansLabels').addTo(map);

      //Whenever a map popup closes, unset a flag that indicates such.
      map.on('popupclose', function() {
        isDisputedAreaPopupOpen = false;
      });
    });

    $scope.dropDownSelect = function(value) {
      var searchOption = getSearchOptionByValue(value);
      if (!searchOption) {
        return;
      }

      ga.sendEvent({
        category: 'MainMap DropDown Select',
        action: $scope.region.name.toUpperCase(),
        label: searchOption.label
      });
      $scope.regionSelect(searchOption.value);
    };

    $scope.regionSelect = function(region_id) {
      $location.path('/' + $scope.region.name + '/' + region_id);
    };

    function onMapFeatureClick (event, feature) {
      var layers = leafletPip.pointInLayer(event.latlng, $scope.map);
      var featureLayers = layers.filter(function(l) {return l.feature;});

      if (featureLayers.length > 1) {
        var popup = createDisputedAreaPopup($scope.region.name, featureLayers);

        ga.sendEvent({
          category: 'MainMap Click',
          action: $scope.region.name.toUpperCase(),
          label: '(Disputed)'
        });

        popup.setLatLng(event.latlng);
        $scope.map.openPopup(popup);
        isDisputedAreaPopupOpen = true;
      } else {
        ga.sendEvent({
          category: 'MainMap Click',
          action: $scope.region.name.toUpperCase(),
          label: feature.properties.title
        });

        $scope.regionSelect(feature.properties.region_id);
      }
    }

    function onMapFeatureMouseOver (event, feature, layer) {
      layer.setStyle(mapConfig.highlightStyle);
    }

    function onMapFeatureMouseMove (event, feature) {
      if (!isDisputedAreaPopupOpen) {
        new L.Rrose({ offset: new L.Point(0,-10), closeButton: false, autoPan: false, xEdge: 175, yEdge: 195})
        .setContent(feature.properties.title)
        .setLatLng(event.latlng)
        .openOn($scope.map);
      }
    }

    function onMapFeatureMouseOut (event, feature) {
      if (event && event.target) {
        event.target.setStyle(mapConfig.defaultStyle);
      }
      if (feature && feature.target) {
        feature.target.setStyle(mapConfig.defaultStyle);
      }

      if (!isDisputedAreaPopupOpen) {
        $scope.map.closePopup();
      }
    }

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
      $scope.regionConfig = mainMapRegionConfig.getConfig(region);
      $location.path($scope.regionConfig.path, false);
      getFeatures();
      //Close any map "popups" when changing region maps.
      $scope.map.closePopup();
    };

    $scope.changeRegionGlobal = function() {
      $scope.region.name = 'global';
      $location.path('/' + $scope.region.name, true);
    };

    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };

    function getFeatures () {
      spinnerState.loading = true;
      var regionResource = $scope.regionConfig.requestData();
      var mapPromise = leafletData.getMap('mainmap');

      $q.all([mapPromise, regionResource.$promise]).then(function(result) {
        var map = result[0];
        var regionResponse = result[1];

        $scope.geojson = {
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
        };

        $scope.searchOptions = $scope.regionConfig.getSearchOptions(regionResponse);

        $timeout(function() {
          spinnerState.loading = false;
          map.invalidateSize();
        });
      });
    }

    function getSearchOptionByValue(value) {
      for (var i = 0; i < $scope.searchOptions.length; i++) {
        if ($scope.searchOptions[i].value === value) {
          return $scope.searchOptions[i];
        }
      }
      return null;
    }

    $scope.searchOptions = [];
    //$scope.selectedSearchOption;
    $scope.geojson = {};
    $scope.regionConfig = mainMapRegionConfig.getConfig($scope.region.name);
    getFeatures();

    var isDisputedAreaPopupOpen = false;
  });
