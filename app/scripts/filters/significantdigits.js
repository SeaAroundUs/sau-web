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
    	input = Number(input);
    	//How many digits to display.
    	var digits = 3;
    	//Get rid of trailing zeroes on large numbers.
    	if (input % 1000 === 0) { digits = 1; }
    	else if (input % 100 === 0) { digits = 2; }
    	//This adds a 'sign' to the end to specify the order of magnitude and keep precision to x digits. e.g. 382k
    	return d3.format(',.' + digits + 's')(input);
    };
  });
