(function(angular) {
  'use strict';
  angular.module('sauWebApp').directive('feedback', function($location) {
    return {
      link: function(scope) {
        function updateHref() {
          scope.url = '/feedback/?referringURL=/data/%23' + $location.$$path;
        }
        updateHref();
        scope.$on('$destroy', scope.$on('$locationChangeSuccess', updateHref));

      },
      restrict: 'E',
      replace: true,
      scope: {},
      template: '<a class="feedback" ng-href="{{ url }}">Feedback</a>'
    };
  });
})(angular);
