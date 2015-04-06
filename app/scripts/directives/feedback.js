(function(angular) {
  'use strict';
  angular.module('sauWebApp').directive('feedback', function($location) {
    return {
      link: function(scope) {
        scope.url = '/feedback/?referringURL=/data/%23/' + $location.$$path;
      },
      restrict: 'E',
      replace: true,
      scope: {},
      template: '<a class="feedback" ng-href="{{ url }}">Feedback</a>'
    };
  });
})(angular);
