;(function() {

  'use strict';

  angular.module('sauWebApp')
    .filter('splitIndex', function() {
      return function(input, splitChar, splitIndex) {
        if (!input) {
          return;
        }
        return input.split(splitChar)[splitIndex];
      };
    })
    .filter('catchGridUnits', function() {
      return function (input) {
        return input.toExponential(1) + ' t/km²';
      };
    })
    .filter('totalCatchUnits', function() {
      return function (input) {
        return input + ' x 10³ t';
      }
    });

})();