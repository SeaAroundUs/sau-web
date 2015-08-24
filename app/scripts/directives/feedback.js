(function(angular) {
  'use strict';
  angular.module('sauWebApp').directive('feedback', function($location) {
    return {
      link: function(scope) {
        scope.$on('$destroy', scope.$on('$locationChangeSuccess', updateHref));

        updateHref();

        function updateHref() {
          scope.url = '/feedback/?referringURL=/data/%23' + encodeURIComponent($location.$$url);
        }
      },
      restrict: 'E',
      replace: true,
      scope: {},
      template: '<a class="feedback" ng-href="{{ url }}">Feedback</a>'
    };
  });
})(angular);
