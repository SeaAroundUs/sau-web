(function(angular) {
  'use strict';
  angular.module('sauWebApp')
      .factory('spinnerState', function() {
        return { loading: false };
      });
})(angular);
