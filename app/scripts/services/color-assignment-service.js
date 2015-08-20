'use strict';

angular.module('sauWebApp')
  .factory('colorAssignment', function(spatialCatchColors) {
    return {
      setData: function (legendKeys) {
        this._map = {};
        for (var i = 0; i < legendKeys.length; i++) {
          var color = (i < spatialCatchColors.length) ? spatialCatchColors[i] : this._getRandomColor();
          this._map[legendKeys[i]] = color;
        }
      },

      colorOf: function (legendKey) {
        return this._map[legendKey] || this.getDefaultColor();
      },

      getDefaultColor: function () {
        return spatialCatchColors[0];
      },

      _getRandomColor: function () {
        return [~~(Math.random() * 256), ~~(Math.random() * 256), ~~(Math.random() * 256), 255];
      }
    };
  })
  .value('spatialCatchColors', [
    [156, 8, 67, 255],
    [197, 204, 0, 255],
    [255, 159, 0, 255],
    [157, 141, 57, 255],
    [34, 125, 116, 255],
    [72, 78, 162, 255],
    [253, 137, 138, 255],
    [126, 211, 34, 255],
    [1, 129, 196, 255],
    [76, 77, 108, 255],
    [211, 64, 83, 255],
    [115, 149, 230, 255],
    [248, 231, 28, 255],
    [207, 111, 98, 255],
    [94, 81, 160, 255],
    [255, 0, 0, 255],
    [139, 87, 41, 255],
    [198, 81, 181, 255],
    [0, 169, 145, 255],
    [237, 30, 121, 255]
  ]);
