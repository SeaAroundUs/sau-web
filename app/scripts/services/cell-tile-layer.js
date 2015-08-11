'use strict';

/* global L */

L.TileLayer.CellLayer = L.TileLayer.Canvas.extend({
  options: {
    cellDegrees: 0.5,
    continuousWorld: true,
    noWrap: true,
    debugTiles: false
  },
  initialize: function () {
    this.numCellColumns = 360 / this.options.cellDegrees;
    this.numCellRows = 180 / this.options.cellDegrees;
    this.numCells = this.numCellColumns * this.numCellRows;
    if (Math.round(this.numCells) !== this.numCells) {
      console.log(this.options.cellDegrees + ' is not a valid cellDegrees value.');
      this.numCellColumns = 360;
      this.numCellRows = 180;
      this.numCells = 259200;
    }
  },
  setCells: function (cellColors) {
    this.cellColorData = cellColors;
  },
  drawTile: function(canvas, tileCoord) {
    var context = canvas.getContext('2d');
    var imageData = context.getImageData(0, 0, 256, 256);

    var tileCorner = L.point(tileCoord.x * 256, tileCoord.y * 256).add(this._tileCornerPt());

    for (var i = 0; i < imageData.data.length; i += 4) {
      var canvasPixel = i / 4;
      var layerPoint = L.point(canvasPixel % 256, Math.floor(canvasPixel / 256)).add(tileCorner);
      var latLng = this._map.layerPointToLatLng(layerPoint);
      var cellId = this._cellIdAtLatLng(latLng);
      var pos = cellId * 4;
      imageData.data[i] = this.cellColorData[pos];
      imageData.data[i+1] = this.cellColorData[pos+1];
      imageData.data[i+2] = this.cellColorData[pos+2];
      imageData.data[i+3] = this.cellColorData[pos+3];
    }

    if (this.options.debugTiles) {
      for (var i = 0; i < imageData.data.length; i += 4) {
        //Make the tiles borders red for debugging.
        var isRed = canvasPixel < 256 || canvasPixel % 256 === 255 || canvasPixel % 256 === 0 || canvasPixel > 256 * 255;
        if (isRed) {
          imageData.data[i] = 255;
          imageData.data[i+1] = 0;
          imageData.data[i+2] = 0;
          imageData.data[i+3] = 30;
        }
      }
    }

    context.putImageData(imageData, 0, 0);
  },
  _tileCornerPt: function () {
    return this._map.latLngToLayerPoint(L.latLng(0, 0));
  },
  _fromCornerTile: function (layerPt) {
    return layerPt.subtract(this._tileCornerPt());
  },
  _cellIdAtLatLng: function (latLng) {
    //Lat is between 90 and -90
    var cellRow = this.numCellRows - Math.ceil((latLng.lat + 90) / this.options.cellDegrees);
    //Lng is between -180 and 180
    var cellCol = Math.floor((latLng.lng + 180) / this.options.cellDegrees);

    //Convert cell's x,y coord to a single-dimensional value.
    //Cell Ids start at one.
    return cellRow * this.numCellColumns + cellCol + 1;
  },
  _latLngOfCellId: function (cellId) {
    var col = cellId % this.numCellColumns;
    var row = Math.floor(cellId / this.numCellColumns);
    var lat = 90 - (row * this.options.cellDegrees) - 0.25;
    var lng = -180 + (col * this.options.cellDegrees) - 0.25;
    return L.latLng(lat, lng);
  }
});

L.tileLayer.cellLayer = function() {
  return new L.TileLayer.CellLayer();
};