'use strict';
/* global L */
angular.module('sauWebApp').controller('SpatialCatchMapCtrl',
  function ($scope, $window, mapConfig, leafletData, countries110, testData) {
    //Reference to global object 'L'
    //var L = $window.L;

    var crs = new L.Proj.CRS('ESRI:53009', '+proj=moll +lon_0=0 +x_0=0 +y_0=0 +a=6371000 +b=6371000 +units=m +no_defs', {
      origin: [0, 0],
      resolutions: [
        39135.75848200009,
        19567.87924099992,
        9783.93962049996,
        4891.96981024998,
        2445.98490512499
      ]
    });

    /*crs = new L.Proj.CRS('EPSG:3857', '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +a=6378137 +b=6378137 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs', {
      origin: [0, 0],
      resolutions: [
        156543.03392800014,
        78271.51696399994,
        39135.75848200009,
        19567.87924099992,
        9783.93962049996
      ]
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

    var map = L.map('cell-map', {
      zoom: 0,
      minZoom: 0,
      maxZoom: 4,
      crs: crs
    }).setView([0, 0], 0);

    L.geoJson(countries110, {
      style: function () {
        return mapConfig.countryStyle;
      }
    }).addTo(map);

    var layer = L.tileLayer.cellLayer(0.5);
    var cellData = new Uint8ClampedArray(layer.numCells * 4);
    var color = [228, 135, 242, 255]; //Purp

    //Value thresholds
    for (var i = 0; i < testData.data.length; i ++) {
      var pct = (5 - testData.data[i].threshold) / 5;
      //Color the cells in this value threshold
      for (var j = 0; j < testData.data[i].array_agg.length; j++) {
        var cell = testData.data[i].array_agg[j];
        cellData[cell*4] = lighten(color[0], pct);
        cellData[cell*4 + 1] = lighten(color[1], pct);
        cellData[cell*4 + 2] = lighten(color[2], pct);
        cellData[cell*4 + 3] = lighten(color[3], pct);
      }
    }
    layer.setCells(cellData);
    map.addLayer(layer);

    function lighten(color, pct) {
      return (255 - color) * pct + color;
    }
  });

