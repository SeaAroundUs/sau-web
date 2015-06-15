(function(angular) {
  'use strict';
  angular.module('sauWebApp').directive('method', function(externalURLs) {
    return {
      link: function(scope) {
        switch(scope.anchor) {
          case '13':
            scope.url = '/catch-reconstruction-and-allocation-methods/';
            break;
          case 'estuaries':
            scope.url = '/about-estuaries-database/';
            break;
          default:
            scope.url = externalURLs.manual + '#' + scope.anchor;
        }
      },
      restrict: 'E',
      replace: true,
      scope: {
        anchor: '@'
      },
      template: '<span><a target="_blank" ng-href="{{ url }}">Method</a></span>'
    };
  });
})(angular);
