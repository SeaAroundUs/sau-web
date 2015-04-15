/* global d3 */

'use strict';

angular.module('sauWebApp')
.factory('sauD3Utils', function () {

  var methods = {
    pointCircleProperties: function(value) {
      // for representing sized and colored points on
      // map and legend.

      var colorScale = d3.scale
                        .threshold()
                        .domain([100,1000,10000,1000000,10000000,13000000].map(Math.log10))
                        .range(['#4a9d28', '#5cfd2e', '#fdfd7d', '#fda92a', '#fd8081', '#fb0d1b', '#ff0000']);

      var getColor = function(x) {
        return colorScale(Math.log10(x));
      };

      var sizeScale = function(x) {
        return 2+Math.log10(1+x);
      };

      var color = getColor(value);
      var size = sizeScale(value);

      return {color: color, size: size};
    }

  };

  return methods;
});
