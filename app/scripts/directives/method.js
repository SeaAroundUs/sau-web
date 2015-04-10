(function(angular) {
  'use strict';
  angular.module('sauWebApp').directive('method', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        anchor: '@'
      },
      template: '<span><a target="_blank" ng-href="/reference.html#{{ anchor }}">Method</a></span>'
    };
  });
})(angular);
