'use strict';

/* global L */
/* global setTimeout */

L.TileLayer.CellLayer = L.TileLayer.Canvas.extend({
  options: {
    cellDegrees: 0.5,
    continuousWorld: true,
    noWrap: true,
    debugTiles: false,
    async: true
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
    this._asyncDrawTile(this, 0, imageData, tileCorner, canvas);
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
  },
  _asyncDrawTile: function (thiz, startIndex, imageData, tileCorner, canvas) {
    var duration = 0;
    var now = Date.now();

    for (var i = startIndex; i < imageData.data.length; i += 4) {
      var canvasPixel = i / 4;
      var layerPoint = L.point(canvasPixel % 256, Math.floor(canvasPixel / 256)).add(tileCorner);
      var latLng = thiz._map.layerPointToLatLng(layerPoint);
      var cellId = thiz._cellIdAtLatLng(latLng);
      var pos = cellId * 4;
      imageData.data[i] = thiz.cellColorData[pos];
      imageData.data[i+1] = thiz.cellColorData[pos+1];
      imageData.data[i+2] = thiz.cellColorData[pos+2];
      imageData.data[i+3] = thiz.cellColorData[pos+3];

      //Draw red borders around tiles for debugging.
      if (thiz.options.debugTiles) {
        var isRed = canvasPixel < 256 || canvasPixel % 256 === 255 || canvasPixel % 256 === 0 || canvasPixel > 256 * 255;
        if (isRed) {
          imageData.data[i] = 255;
          imageData.data[i+1] = 0;
          imageData.data[i+2] = 0;
          imageData.data[i+3] = 30;
        }
      }

      duration += Date.now() - now;
      now = Date.now();
      if (duration > 33) {
        duration = 0;
        setTimeout(thiz._asyncDrawTile, 1, thiz, i+4, imageData, tileCorner, canvas);
        break;
      }
    }

    canvas.getContext('2d').putImageData(imageData, 0, 0);
    thiz.tileDrawn(canvas);
  }
});

L.tileLayer.cellLayer = function() {
  return new L.TileLayer.CellLayer();
};