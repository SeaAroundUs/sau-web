;(function() {

  'use strict';

  /* global angular */
  /* global L */

  angular.module('sauWebApp').controller('MPACtrl',
    function ($scope, $routeParams, sauAPI, region, mapConfig, leafletData) {

      var id = $routeParams.id;

      $scope.region = sauAPI.Region.get({region: region, region_id: id});

      $scope.quote = [];
      $scope.acad = [];
      $scope.gov = [];
      $scope.jour = [];
      $scope.ngo = [];
      $scope.ref = [];

      var mpapointsData = sauAPI.MPAPointsData.get({region: region, region_id: id}, function() {
        angular.extend($scope, {
          geojson: {
            data: mpapointsData.data,
            pointToLayer: function (feature, latlng) {
              return L.circleMarker(latlng, {
                fillColor: feature.fillColor,
                color: '#000',
                fillOpacity: 1,
                weight: 1,
                radius: feature.radius,
                opacity: 0.8,
                stroke: true
              });
            }
          }
        });
        for (var i=0; i < $scope.geojson.data.features.length; i++){
          if ($scope.geojson.data.features[i].properties.point_cat == 'less than 100') {
            $scope.geojson.data.features[i].fillColor = '#FF6700';
            $scope.geojson.data.features[i].radius = 6;
          } else if ($scope.geojson.data.features[i].properties.point_cat == 'between 100 and 1000') {
            $scope.geojson.data.features[i].fillColor = '#FFFF00';
            $scope.geojson.data.features[i].radius = 7;
          } else {
            $scope.geojson.data.features[i].fillColor = '#0f0';
            $scope.geojson.data.features[i].radius = 8;
          }
        }
      });

      var MPAData = sauAPI.MPAData.get({region: region, region_id: id}, function() {
        $scope.mpaname = MPAData.data[0].mpa_cname;
        $scope.mpa_p1 = MPAData.data[0].mpa_p1;
        $scope.mpa_p2 = MPAData.data[0].mpa_p2;
        $scope.mpa_p3 = MPAData.data[0].mpa_p3;
        $scope.mpa_p4 = MPAData.data[0].mpa_p4;
        $scope.mpa_p5 = MPAData.data[0].mpa_p5;
        $scope.mpa_p6 = MPAData.data[0].mpa_p6;
        $scope.mpa_p7 = MPAData.data[0].mpa_p7;
        $scope.other_eez = MPAData.data[0].other_eez;
      });
      var MPAQuoteData = sauAPI.MPAQuoteData.get({region: region, region_id: id}, function() {
        var mpaquote = MPAQuoteData.data;
        for (var i = 0; i < mpaquote.length; i++) {
          if (mpaquote[i].mpa_quotecat == "Academic") {
            for (var x = 0; x < mpaquote[i].data.length; x++) {
              $scope.acad.push([mpaquote[i].mpa_name,mpaquote[i].data[x]]);
            }
          } else if (mpaquote[i].mpa_quotecat == "Government") {
            for (var x = 0; x < mpaquote[i].data.length; x++) {
              $scope.gov.push([mpaquote[i].mpa_name,mpaquote[i].data[x]]);
            }
          } else if (mpaquote[i].mpa_quotecat == "Journalist") {
            for (var x = 0; x < mpaquote[i].data.length; x++) {
              $scope.jour.push([mpaquote[i].mpa_name,mpaquote[i].data[x]]);
            }
          } else if (mpaquote[i].mpa_quotecat == "NGO") {
            for (var x = 0; x < mpaquote[i].data.length; x++) {
              $scope.ngo.push([mpaquote[i].mpa_name,mpaquote[i].data[x]]);
            }
          }
        }
      });
      var MPANamesData = sauAPI.MPANamesData.get({region: region, region_id: id}, function() {
        $scope.mpanames = MPANamesData.data;
        console.log($scope.mpanames)
      });
      var MPAFLData = sauAPI.MPAFLData.get({region: region, region_id: id}, function() {
        $scope.mpafl = MPAFLData.data;
      });
      var MPARefData = sauAPI.MPARefData.get({region: region, region_id: id}, function() {
        $scope.mparef = MPARefData.data;
      });

      var regions = sauAPI.Regions.get({region: region}, function() {
        $scope.regions = regions.data;
        leafletData.getMap('mpamap')
        .then(function(map) {
          // draw EEZ regions on map
          var f = L.geoJson(regions.data);
          f.setStyle(mapConfig.noClickStyle);
          f.addTo(map);
          // now highlight EEZ regions specified in the mpa response,
          // fit map to those bounds to filter out scattered data
          mpapointsData.$promise.then(function() {
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

      leafletData.getMap('mpamap').then(function(map) {
        L.esri.basemapLayer('Oceans').addTo(map);
        L.esri.basemapLayer('OceansLabels').addTo(map);
      });

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
