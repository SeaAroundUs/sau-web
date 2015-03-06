'use strict';

/* global d3 */ /* for jshint */

/**
 * @ngdoc filter
 * @name sauWebApp.filter:significantDigits
 * @function
 * @description
 * # significantDigits
 * Formats chart numbers to the spec.
 */
angular.module('sauWebApp')
  .filter('significantDigits', function () {
    return function (input) {
    	/* TODO We need more specifics about how display numbers before AND after the decimal for each order of magnitude.
    	This is just our first guess. */
    	//This adds a 'sign' to the end to specify the order of magnitude and keep precision to x digits. e.g. 382k
    	return d3.format(',.3s')(Number(input));
    };
  });
