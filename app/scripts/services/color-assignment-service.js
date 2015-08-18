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
    [111, 0, 64, 255],
    [37, 188, 80, 255],
    [226, 220, 34, 255],
  ]);
