(function(angular) {
  'use strict';

  /*
  Details on GA event tracking:
  https://developers.google.com/analytics/devguides/collection/analyticsjs/events
  */

  angular.module('sauWebApp').factory('ga', function() {
    return {
      sendEvent: function(opt) {
        if (typeof opt.category === 'string' && typeof opt.action === 'string' &&
          (opt.label === undefined || typeof opt.label === 'string') &&
          (opt.value === undefined || (typeof opt.value === 'number' && opt.value > 0))) {

          return ga('send', 'event', opt.category, opt.action, opt.label, opt.value);

        } else {
          console.log('illegal GA arguments');
          console.log(opt);
        }
      }
    };
  });
})(angular);
