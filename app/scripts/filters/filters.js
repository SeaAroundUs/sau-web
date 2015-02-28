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
    });

})();