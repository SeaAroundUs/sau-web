(function(angular) {
  'use strict';
  angular.module('sauWebApp').directive('underReview',
    function() {
      var eezs = [
        634, // Qatar (634)
        684, 683, // Saudi Arabia (684 & 683)
        48, // SAU-1196
        86,
        111,
        174,
        175,
        251,
        252,
        262,
        356,
        368,
        400,
        404,
        414,
        450,
        462,
        480,
        508,
        512,
        586,
        638,
        690,
        706,
        711,
        736,
        784,
        834,
        895,
        896,
        911,
        916,
        917,
        922,
        923,
        934,
        940,
        954,
        968,
        972,
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
