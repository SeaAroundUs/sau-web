(function(angular) {
  'use strict';
  angular.module('sauWebApp').directive('method', function(externalURLs) {
    return {
      link: function(scope) {
        switch(scope.anchor) {
          case '13':
            scope.url = '/catch-reconstruction-and-allocation-methods/';
          break;
          case '23':
            scope.url = '/fisheries-subsidies/';
          break;
          case 'estuaries':
            scope.url = '/about-estuaries-database/';
          break;
          case 'multinational-footprint':
            scope.url = '/multinational-footprint-method';
          break;
          case 'marine-trophic-index':
            scope.url = '/mti-fib-rmti/';
          break;
          case 'catch-reconstruction-and-allocation-methods/taxon-distributions':
            scope.url = '/catch-reconstruction-and-allocation-methods/#_Toc421534359';
          break;
          case 'catch-reconstruction-and-allocation-methods/foreign-fishing-access':
            scope.url = '/catch-reconstruction-and-allocation-methods/#_Toc421534365';
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
