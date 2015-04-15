(function(angular) {
  'use strict';
  angular.module('sauWebApp').directive('method', function(externalURLs) {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        anchor: '@'
      },
      template: '<span><a target="_blank" ng-href="' + externalURLs.manual + '#{{ anchor }}">Method</a></span>'
    };
  });
})(angular);
