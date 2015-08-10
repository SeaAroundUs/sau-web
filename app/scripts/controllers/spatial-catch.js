'use strict';
/* global L */
angular.module('sauWebApp').controller('SpatialCatchMapCtrl',
  function ($scope, $window, mapConfig, leafletData, countries110, testData) {
    //Reference to global object 'L'
    //var L = $window.L;

    var crs = new L.Proj.CRS('ESRI:53009', '+proj=moll +lon_0=0 +x_0=0 +y_0=0 +a=6371000 +b=6371000 +units=m +no_defs',
      { resolutions: [40000, 20000, 10000, 5000] });

    var map = L.map('cell-map', { crs: crs }).setView([0, 0], 0);

    L.geoJson(countries110, {
      style: function () {
        return mapConfig.countryStyle;
      }
    }).addTo(map);

    var layer = L.tileLayer.cellLayer({cellDegrees: 0.5});
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

