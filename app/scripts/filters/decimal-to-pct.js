'use strict';


angular.module('sauWebApp')
  .filter('decimalToPct', function () {
    return function (input) {
      return Math.round(input * 100) + '%';
    };
  });
