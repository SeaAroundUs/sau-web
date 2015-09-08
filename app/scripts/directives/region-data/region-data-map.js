'use strict';

/* global leafletPip */
/* global L */

angular.module('sauWebApp')
  .directive('regionDataMap', function() {
    var controller = function($scope, $timeout, mapConfig, leafletBoundsHelpers, leafletData, sauAPI,
                              createDisputedAreaPopup, ga) {

      var isDisputedAreaPopupOpen = false;
      var selectedRegions;

      angular.extend($scope, {
        defaults: mapConfig.defaults,
        faoLayers: [],
        maxbounds: mapConfig.worldBounds,
        center: { lat: 0, lng: 0, zoom: 3 },
        layers: { baselayers: mapConfig.baseLayers }
      });

      // add oceans
      leafletData.getMap('region-data-minimap').then(function(map) {
        L.esri.basemapLayer('Oceans').addTo(map);
        L.esri.basemapLayer('OceansLabels').addTo(map);
      });

      $scope.$watch('region.name', drawRegions);
      $scope.$watch('region.id', centerMap);

      // center map on selected region
      function centerMap(regionId) {
        sauAPI.Region.get(
          { region: $scope.region.name, region_id: regionId },
          function(res) {
            // keep track of region ids
            selectedRegions = [regionId];

            // get bounds, record multiple region ids, and zoom map
            leafletData.getMap('region-data-minimap').then(function(map) {
              if (res.data && res.data.geojson) {
                var f = L.geoJson(res.data.geojson, { style: mapConfig.defaultStyle });
                var bounds = f.getBounds();
                map.fitBounds(bounds);
                $scope.disabled = false;

                // handle maps with multiple eezs
              } else if (res.data && res.data.eezs && res.data.eezs[0].geojson) {
                var group = new L.featureGroup(res.data.eezs.map(function(eez) {
                  selectedRegions.push(eez.id);
                  return L.geoJson(eez.geojson, { style: mapConfig.defaultStyle });
                }));
                map.fitBounds(group.getBounds());
                $scope.disabled = false;

              } else {
                map.setZoom(1);
                $scope.disabled = true;
              }

              // restyle all layers
              restyleLayers();
            });
          },
          function() { $scope.disabled = true; }
        );
      }

      // add region geojson
      function drawRegions(name) {
        sauAPI.Regions.get(
          { region: name === 'eez-bordering' ? 'eez' : name },
          function(res) {
            leafletData.getMap('region-data-minimap').then(function(map) {
              if (res.data && res.data.features) {
                L.geoJson(res.data.features, {
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

                // restyle all layers
                restyleLayers();
              }
            });
          },
          function() { $scope.disabled = true; }
        );
      }

      // handle geojson click
      function geojsonClick(feature, latlng) {
        /* handle clicks on overlapping layers */
        leafletData.getMap('region-data-minimap').then(function(map) {
          map.closePopup();

          var layers = leafletPip.pointInLayer(latlng, map);
          var featureLayers = layers.filter(function(l) {
            //TODO have eez-bordering and country-eez endpoints to return geojson
            var regionTypeName = $scope.region.name === 'eez-bordering' ? 'eez' : $scope.region.name;
            // only return layers which have a feature of the current region type
            return (l.feature && l.feature.properties.region === regionTypeName);
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

            $scope.region.id = feature.properties.region_id;
            $scope.region.ids = [$scope.region.id];

            // restyle all layers
            restyleLayers();
          }
        });
      }

      // handle geojson mouseover
      function geojsonMouseover(event, feature, map) {
        event.layer.setStyle(mapConfig.highlightStyle);
        if (!isDisputedAreaPopupOpen) {
          new L.Rrose({ offset: new L.Point(0, -10, false), closeButton: false, autoPan: false })
            .setContent(feature.properties.title)
            .setLatLng(event.latlng)
            .openOn(map);
        }
      }

      // handle geojson mouseout
      function geojsonMouseout(event, feature, map) {
        styleLayer(feature, event.layer);
        if (!isDisputedAreaPopupOpen) {
          map.closePopup();
        }
      }

      // restyle all layers
      function restyleLayers() {
        leafletData.getMap('region-data-minimap').then(function(map) {
          map.eachLayer(function(l) {
            if (l.feature) {
              styleLayer(l.feature, l);
            }
          });
        });
      }

      // re-style single region
      function styleLayer(feature, layer, style) {
        if (!layer) {
          return;
        }
        style = style || mapConfig.defaultStyle;
        if (feature && selectedRegions.indexOf(feature.properties.region_id) !== -1) {
          style = mapConfig.selectedStyle;
        }
        layer.setStyle(style);
      }
    };

    return {
      controller: controller,
      link: function(scope, ele) {
        // don't show on multi regions
        if (!scope.region.id) {
          ele.hide();
        }
      },
      restrict: 'E',
      scope: { region: '=' },
      template: '<leaflet layers="layers" id="region-data-minimap" ' +
        'maxbounds="maxbounds" center="center" defaults="defaults" ' +
        'ng-class="{\'disabled\': disabled}"></leaflet>'
    };
  });
