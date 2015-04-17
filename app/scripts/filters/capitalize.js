(function(angular) {
  'use strict';

  angular.module('sauWebApp').filter('capitalize', function() {
    return function(input) {
      if (typeof input === 'string' && input.length > 0) {
        return input.charAt(0).toUpperCase() + input.slice(1);
      } else {
        return input;
      }
    }
  });
})(angular);
