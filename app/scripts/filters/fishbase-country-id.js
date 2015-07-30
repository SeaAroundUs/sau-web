(function(angular) {
  'use strict';

  angular.module('sauWebApp').filter('fishbaseCountryId', function() {
    return function(input) {
      if (!input) { return undefined; }

      if (Number(input) < 100) {
        return '0' + input.toString();
      } else {
        return input.toString();
      }
    };
  });
})(angular);
