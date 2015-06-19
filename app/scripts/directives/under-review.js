(function(angular) {
  'use strict';
  angular.module('sauWebApp').directive('underReview',
    function() {
      var eezs = [
        634, // Qatar (634)
        684, 683, // Saudi Arabia (684 & 683)
      ];
      var message = '<p class="under-review">** Data under review</p>';

      return {
        link: function(scope, ele) {
          scope.$watch('eez', function() {
            if (eezs.indexOf(scope.eez) !== -1) {
              ele.html(message);
            } else {
              ele.html('');
            }
          });
        },
        restrict: 'E',
        scope: { eez: '=' }
      };
    }
  );
})(angular);
