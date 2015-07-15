'use strict';

/* global leafletPip */
/* global L */

angular.module('sauWebApp')
  .controller('MiniMapCtrl', function ($scope, $rootScope, $q, $timeout, sauAPI, mapConfig, leafletBoundsHelpers,
                                       leafletData, createDisputedAreaPopup, ga) {

    angular.extend($scope, {
      defaults: mapConfig.defaults,
      layers: {
        baselayers: mapConfig.baseLayers
      }
    });

    $scope.faoLayers = [];
    $scope.maxbounds = mapConfig.worldBounds;
    /** @type {Boolean} Used to determine whether the Rrose popup should open when hovering over a region. */
    var isDisputedAreaPopupOpen = false;

    // add IFA boundaries
    var getIFA = function() {
      $scope.ifa = sauAPI.IFA.get({region_id: $scope.formModel.region_id}, function() {
        leafletData.getMap('minimap').then(function(map) {
          if($scope.ifaLayer) {
            map.removeLayer($scope.ifaLayer);
          }
          $scope.ifaLayer = L.geoJson($scope.ifa.data.geojson, {style: mapConfig.ifaStyle}).addTo(map);
        });
      });
    };

    var styleLayer = function(feature, layer, style) {
      if (!layer) {
        return;
      }
      style = style || mapConfig.defaultStyle;
      if(feature && feature.properties.region_id === $scope.formModel.region_id) {
        style = mapConfig.selectedStyle;
      }
      layer.setStyle(style);
    };

    var geojsonClick = function(feature, latlng) {
      /* handle clicks on overlapping layers */
      leafletData.getMap('minimap').then(function(map) {
        map.closePopup();

        var layers = leafletPip.pointInLayer(latlng, map);
        var featureLayers = layers.filter(function(l) {
          // only return layers which have a feature of the current region type
          return (l.feature && (l.feature.properties.region === $scope.region.name));
        });

        if (featureLayers.length > 1) {
          var popup = createDisputedAreaPopup($scope.region.name, featureLayers);

          ga.sendEvent({
            category: 'MiniMap Click',
            action: $scope.region.name.toUpperCase(),
            label: '(Disputed)'
          });

          popup.setLatLng(latlng);
          //I have to open the disputed area popup on a timeout due to a bug that occurs in Chrome on Windows (only).
          //If a popup closes and then opens in the same tick, then the "popupclose" event doesn't fire.
          //If the popupclose event doesn't fire, then the hover popup won't close, resulting in both popups being open at the same time.
          $timeout(function() {
            map.openPopup(popup);
            isDisputedAreaPopupOpen = true;
          });

        } else {
          ga.sendEvent({
            category: 'MiniMap Click',
            action: $scope.region.name.toUpperCase(),
            label: feature.properties.title
          });

          $scope.formModel.region_id = feature.properties.region_id;
          $scope.styleSelectedFeature();

          if ($scope.region.name === 'eez') {
            $timeout(function() {
              if (! $scope.mapLayers.selectedFAO ) {
                drawFAO();
              } else {
                $scope.mapLayers.selectedFAO = undefined;
              }
            });
          }
        }
      });
    };

    var geojsonMouseout = function(event, feature, map) {
      styleLayer(feature, event.layer);
      if (!isDisputedAreaPopupOpen) {
        map.closePopup();
      }
    };

    var geojsonMouseover = function(event, feature, map) {
      event.layer.setStyle(mapConfig.highlightStyle);
      if (!isDisputedAreaPopupOpen) {
        new L.Rrose({ offset: new L.Point(0,-10), closeButton: false, autoPan: false })
        .setContent(feature.properties.title)
        .setLatLng(event.latlng)
        .openOn(map);
      }
    };

    leafletData.getMap('minimap').then(function(map) {
      L.esri.basemapLayer('Oceans').addTo(map);
      L.esri.basemapLayer('OceansLabels').addTo(map);
    });

    $scope.$watch('formModel', function() {
      leafletData.getMap('minimap')
        .then(function(map) {
          $scope.feature.$promise.then(function() {
            if ($scope.feature.data && $scope.feature.data.geojson) {
              var f = L.geoJson($scope.feature.data.geojson);
              var bounds = f.getBounds();
              map.fitBounds(bounds);
            } else {
              map.setZoom(1);
            }
          });
        });
    }, true);

    $scope.eachFeatureLayer = function(cb) {
      leafletData.getMap('minimap')
      .then(function(map) {
        map.eachLayer(function(l){
          if (l.feature) {
            cb(l);
          }
        });
      });
    };

    $scope.styleSelectedFeature = function () {
      $scope.eachFeatureLayer(function(l) {
        styleLayer(l.feature, l);
      });
      if ($scope.region.name === 'eez') {
        getIFA();
      }
    };

    var drawFAO = function() {
      $scope.removeFAO();

      var addFAOLayer = function(layer, style) {
        leafletData.getMap('minimap').then(function(map) {
          layer.setStyle(style);
          layer.addTo(map);
          $scope.faoLayers.push(layer);
        });
      };

      $q.all([$scope.feature.$promise, $scope.faos.promise, $scope.faoData.$promise]).then(function() {
        $scope.faoLayer = L.geoJson($scope.faoData.data, {
          onEachFeature: function(feature, layer) {
            if(isFAOInThisRegion(feature.properties.region_id)) {
              if (feature.properties.region_id === $scope.mapLayers.selectedFAO) {
                addFAOLayer(layer, mapConfig.selectedFaoStyle);
              } else {
                addFAOLayer(layer, mapConfig.faoStyle);
              }
            }
          }
        });
      });
    };

    $scope.removeFAO = function() {
      leafletData.getMap('minimap').then(function(map) {
        for(var i=0; i<$scope.faoLayers.length; i++) {
          map.removeLayer($scope.faoLayers[i]);
        }
        $scope.faoLayers = [];
      });
    };

    $scope.features.$promise.then(function() {
      // add features layer when loaded, then load IFA and FAO so they get painted on top
      leafletData.getMap('minimap').then(function(map) {

        //Whenever a map popup closes, set unset a flag that indicates such.
        map.on('popupclose', function() {
          isDisputedAreaPopupOpen = false;
        });

        L.geoJson($scope.features.data.features, {
          style: mapConfig.defaultStyle,
          onEachFeature: function(feature, layer) {
            layer.on({
              click: function(event) {
                geojsonClick(feature, event.latlng);
              },
              mouseover: function(event) {
                geojsonMouseover(event, feature, map);
              },
              mousemove: function(event) {
                geojsonMouseover(event, feature, map);
              },
              mouseout: function(event) {
                geojsonMouseout(event, feature, map);
              }
            });
          }
        }).addTo(map);
        $scope.styleSelectedFeature();
        $scope.$watch('mapLayers.selectedFAO', function(){
          leafletData.getMap('minimap').then(function(map) {
            if ($scope.faoData) {
              $scope.faoData.$promise.then(function() {
                drawFAO(map);
              });
            }
          });
        });
      });
    });

    function isFAOInThisRegion(faoId) {
      for (var i = 0; i < $scope.faos.data.length; i++) {
        if ($scope.faos.data[i].id === faoId) {
          return true;
        }
      }
      return false;
    }
  });
