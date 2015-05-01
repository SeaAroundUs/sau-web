(function(angular) {
  'use strict';

  angular.module('sauWebApp').directive('gaEvent', function($parse, ga) {
    return {
      link: function(scope, ele, attrs) {
        ele.on('click', function() {
          ga.sendEvent($parse(attrs.gaEvent)(scope));
        });
      },
      restrict: 'A'
    };
  });
})(angular);
