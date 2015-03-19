(function(angular) {
  'use strict';
  angular.module('sauWebApp').directive('spinner', function(spinnerState) {
    return {
      link: function(scope, ele) {
        scope.$watch(function() { return spinnerState.loading; }, function(loading) {
          if(loading) {
            ele.addClass('loading');
          } else {
            ele.removeClass('loading');
          }
        });
      },
      restrict: 'A'
    };
  });
})(angular);
