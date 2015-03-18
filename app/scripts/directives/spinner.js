(function(angular) {
  'use strict';
  angular.module('sauWebApp').directive('spinner', function(spinnerState) {
    return {
      link: function(scope, ele) {
        scope.$watch(function() { return spinnerState.loading; }, function(loading) {
          loading ? ele.addClass('loading') : ele.removeClass('loading');
        });
      },
      restrict: 'A'
    };
  });
})(angular);
