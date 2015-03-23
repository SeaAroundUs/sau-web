(function(angular) {
  'use strict';
  angular.module('sauWebApp').directive('scrollClick', function() {
    return {
      link: function(scope, ele) {
        ele.on('click', function() {
          window.scrollTo(0, document.getElementById(scope.scrollTarget).offsetTop + 200);
        });
      },
      restrict: 'A',
      scope: {
        'scrollTarget': '@scrollClick'
      }
    };
  });
})(angular);
