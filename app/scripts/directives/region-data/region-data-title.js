'use strict';

angular.module('sauWebApp')
  .directive('regionDataTitle', function() {
    return {
      link: function(scope) {
        scope.$on('updateChartTitle', function(event, newTitle) { scope.title = newTitle; });
      },
      restrict: 'E',
      replace: true,
      scope: {},
      template: '<h1 ng-bind="title"></h1>'
    };
  });
