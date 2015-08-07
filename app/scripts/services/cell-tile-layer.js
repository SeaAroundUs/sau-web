'use strict';

/* global L */

/** This is supposed to be a class that inherits from L.TileLayer.Canvas,
like this: http://leafletjs.com/reference.html#ilayer
but I've spent a half day wrestling with a runtime error related to it,
so this is my workaround...a series of monkeypatches, and no ability to override
the initialize() constructor. **/
L.tileLayer.cellLayer = function(cellDegrees) {
  var layer = L.tileLayer.canvas();
  layer.numCellColumns = 360 / cellDegrees;
  layer.numCellRows = 180 / cellDegrees;
  layer.numCells = layer.numCellColumns * layer.numCellRows;
  if (Math.round(layer.numCells) !== layer.numCells) {
    console.log(cellDegrees + ' is not a valid cellDegrees value.');
    layer.numCellColumns = 360;
    layer.numCellRows = 180;
    layer.numCells = 259200;
  }
  var cellColorData;

  layer.setCells = function(cellColors) {
    cellColorData = cellColors;
  };

  layer.drawTile = function(canvas, tileCoord) {
    var context = canvas.getContext('2d');
    var imageData = context.getImageData(0, 0, 256, 256);

    var tileCorner = L.point(tileCoord.x * 256, tileCoord.y * 256).add(layer._tileCornerPt());

    for (var i = 0; i < imageData.data.length; i += 4) {
      var canvasPixel = i / 4;
      var layerPoint = L.point(canvasPixel % 256, Math.floor(canvasPixel / 256)).add(tileCorner);
      var latLng = layer._map.layerPointToLatLng(layerPoint);
      var cellId = layer._cellIdAtLatLng(latLng);
      var pos = cellId * 4;
      imageData.data[i] = cellColorData[pos];
      imageData.data[i+1] = cellColorData[pos+1];
      imageData.data[i+2] = cellColorData[pos+2];
      imageData.data[i+3] = cellColorData[pos+3];

      //Make the tiles borders red for debugging.
      var isRed = canvasPixel < 256 || canvasPixel % 256 === 255 || canvasPixel % 256 === 0 || canvasPixel > 256 * 255;
      if (isRed) {
        imageData.data[i] = 255;
        imageData.data[i+1] = 0;
        imageData.data[i+2] = 0;
        imageData.data[i+3] = 30;
      }
    }

    context.putImageData(imageData, 0, 0);
  };

  layer.onAdd = function (map) {
    layer._map = map;
    map.on('viewreset', layer._reset, layer);
    map.on('click', layer._onClick, layer);

    return L.TileLayer.Canvas.prototype.onAdd.call(layer, map);
  };

  layer.onRemove = function (map) {
    map.off('viewreset', layer._reset, layer);
    map.off('click', layer._onClick, layer);

    return L.TileLayer.Canvas.prototype.onRemove.call(layer, map);
  };

  layer._reset = function (event) {
    /*var s = '';
    for (var i = 0; i < 10000; i++) {
      var randomCellId = Math.ceil(Math.random() * layer.numCells);
      var latlng = layer._latLngOfCellId(randomCellId);
      s += (randomCellId + ':' + latlng.lat + ',' + latlng.lng + '\n');
    }
    console.log(s);*/

    return L.TileLayer.Canvas.prototype._reset.call(layer, event);
  };

  layer._onClick = function (event) {
    layer.clickPoint = event.layerPoint;
    //console.log('clicked point: ' + layer._fromCornerTile(layer.clickPoint));
    var cellId = layer._cellIdAtLatLng(event.latlng);
    console.log('cell id: ' + cellId + ' at ' + event.latlng + ', to ' + layer._latLngOfCellId(cellId));
    //console.log('clicked latlong: ' + event.latlng + ', ' + event.layerPoint);
  };

  layer._tileCornerPt = function () {
    return layer._map.latLngToLayerPoint(L.latLng(0, 0));
  };

  layer._fromCornerTile = function (layerPt) {
    return layerPt.subtract(layer._tileCornerPt());
  };

  layer._cellIdAtLatLng = function(latLng) {
    //Lat is between 90 and -90
    var cellRow = layer.numCellRows - Math.ceil((latLng.lat + 90) / cellDegrees);
    //Lng is between -180 and 180
    var cellCol = Math.floor((latLng.lng + 180) / cellDegrees);

    //Convert cell's x,y coord to a single-dimensional value.
    //Cell Ids start at one.
    return cellRow * layer.numCellColumns + cellCol + 1;
  };

  layer._latLngOfCellId = function (cellId) {
    var col = cellId % layer.numCellColumns;
    var row = Math.floor(cellId / layer.numCellColumns);
    var lat = 90 - (row * cellDegrees) - 0.25;
    var lng = -180 + (col * cellDegrees) - 0.25;
    return L.latLng(lat, lng);
  };

  return layer;
};