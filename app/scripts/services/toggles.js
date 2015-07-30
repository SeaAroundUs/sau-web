'use strict';

angular.module('sauWebApp')
  .provider('toggles', function(SAU_CONFIG) {
    var disabledOnDev = ['auth'];
    var disabledOnQA = ['auth'];
    var disabledOnStageAndProd = ['auth', 'fishingEntity', 'highseas', 'global'];

    var disabled = {
      dev: disabledOnDev,
      qa: disabledOnQA,
      stage: disabledOnStageAndProd,
      prod: disabledOnStageAndProd
    };

    var toggleFactory = {
      isEnabled: function(feature) {
        return disabled[SAU_CONFIG.env].indexOf(feature) === -1;
      }
    };

    return { $get: function() { return toggleFactory; }};
  });

angular.module('sauWebApp')
  .directive('toggleHide', function(toggles) {
    return {
      link: function(scope, ele, attr) {
        if (!toggles.isEnabled(attr.toggleHide)) {
          ele.remove();
        }
      },
      restrict: 'A'
    };
  });
