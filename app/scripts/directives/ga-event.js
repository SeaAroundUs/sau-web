(function(angular) {
  'use strict';

  angular.module('sauWebApp').directive('gaEvent', function(ga) {
    return {
      link: function(scope, ele) {
        ele.on('click', function() {
          ga.sendEvent(scope.gaEvent);
        });
      },
      restrict: 'A',
      scope: {
        'gaEvent': '='
      }
    };
  });
})(angular);
