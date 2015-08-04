'use strict';
/* global L */
angular.module('sauWebApp').controller('SpatialCatchMapCtrl',
  function ($scope, $window, mapConfig, leafletData) {
    //Reference to global object 'L'
    //var L = $window.L;

    /*var crs = new L.Proj.CRS('ESRI:53009', '+proj=moll +lon_0=0 +x_0=0 +y_0=0 +a=6371000 +b=6371000 +units=m +no_defs', {
      resolutions: [
        156543.03392800014,
        78271.51696399994,
        39135.75848200009,
        19567.87924099992,
        9783.93962049996
      ],
    });*/

    // RT90 with map's pixel origin at RT90 coordinate (0, 0)
    /*var crs = new L.Proj.CRS('EPSG:2400',
      '+lon_0=15.808277777799999 +lat_0=0.0 +k=1.0 +x_0=1500000.0 ' +
      '+y_0=0.0 +proj=tmerc +ellps=bessel +units=m ' +
      '+towgs84=414.1,41.3,603.1,-0.855,2.141,-7.023,0 +no_defs',
      {
        resolutions: [8192, 4096, 2048], // 3 example zoom level resolutions
      }
    );*/

    //Congigure Leaflet map
    $scope.leaflet = {
      layers: {
        baselayers: mapConfig.baseLayers
      },
      maxbounds: mapConfig.worldBounds,
      geojson: {},
      center: {
        lat: 0,
        lng: 0,
        zoom: 2
      },
      defaults: {
        minZoom: 1,
        tileLayerOptions: {
          noWrap: true,
          detectRetina: true,
          reuseTiles: true
        },
      }
    };

    leafletData.getMap('map').then(function(map) {
      //$scope.map = map;

      /*L.esri.tiledMapLayer('http://tiles1.arcgis.com/tiles/BG6nSlhZSAWtExvp/arcgis/rest/services/coordsys_Mollweide/MapServer',
      {
        maxZoom: 4,
        minZoom: 0,
      }).addTo(map);*/

      L.esri.basemapLayer('Oceans').addTo(map);
      L.esri.basemapLayer('OceansLabels').addTo(map);

      var layer = L.tileLayer.cellLayer(0.5);
      var cellData = new Uint8ClampedArray(layer.numCells * 4);
      for (var i = 0; i < cellData.length; i += 4) {
        var isRed = Math.random() < 0.001;
        cellData[i] = isRed ? 255 : 0;
        cellData[i + 1] = 0;
        cellData[i + 2] = 0;
        cellData[i + 3] = isRed ? 255 : 0;
      }
      layer.setCells(cellData);
      map.addLayer(layer);
    });
  });

