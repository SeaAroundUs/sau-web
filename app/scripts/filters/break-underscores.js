(function(angular) {
  'use strict';

  angular.module('sauWebApp').filter('breakUnderscores', function() {
    return function(input) {
      if (typeof input === 'string' && input.length > 0) {
        return input.replace(/_/g, '_\u200b');
      } else {
        return input;
      }
    };
  });
})(angular);
