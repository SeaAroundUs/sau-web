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
 * If magnitude is three, then the number is devided by 1000 (three zeros), with one trailing decimal if necessary.
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
      //Inline examples are with a magnitude = 3.
      var n = Number(input) / (Math.pow(10, magnitude - 1)); //Takes 123456.789 and turns it into 1234.56789
      n = Math.round(n) / 10; //Takes 1234.56789 and turns it into 123.4;
      return d3.format(',.d')(n); //Adds commas.
    };
  });
