(function(angular) {
  'use strict';

  angular.module('sauWebApp').filter('fileOfUrl', function() {
    return function(input) {
      if (typeof input === 'string' && input.length > 0) {
        var index = Math.max(input.lastIndexOf('/'), 0);
        return input.substr(index + 1);
      } else {
        return input;
      }
    };
  });
})(angular);
