'use strict';

/* global d3 */

/**
 * @ngdoc filter
 * @name sauWebApp.filter:significantDigits
 * @function
 * @description
 * # significantDigits
 * Formats chart numbers to the spec.
 * Rounds the number by the magnitude specified, to one decimal.
 * If magnitude is three, then the number is divided by 1000 (three zeros), with one trailing decimal if necessary.
 *
 * //Example, with a magnitude of 3.
 *      //123456.789 > 123.4
 *      //800000 > 800
 *      //0 > 0*
 *      //0.1 > 0.001
 */
angular.module('sauWebApp')
  .filter('significantDigits', function () {
    return function (input, magnitude) {
      var n2 = 0;
      for (var i = 1; i < magnitude; i++) {
        var n1 = Number(input) / Math.pow(10, magnitude - i);
        n2 = Math.round(n1) / Math.pow(10, i);
        if (n2 !== 0) {
          break;
        }
      }
      return d3.format(',.d')(n2);
    };
  });
