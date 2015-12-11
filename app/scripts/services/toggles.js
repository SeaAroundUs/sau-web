'use strict';

angular.module('sauWebApp')
  .provider('toggles', function(SAU_CONFIG) {
    var disabledOnDev = ['auth'];
    var disabledOnQA = ['auth'];
    var disabledOnStageAndProd = [
      'auth',
      'country-eezs',
      'taxon-distribution'
    ];

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
  })
  .directive('envHide', function (SAU_CONFIG) {
    return {
      link: function (scope, element, attributes) {
        var hideInEnvs = attributes.envHide.split(' ');
        if (hideInEnvs.indexOf(SAU_CONFIG.env) !== -1) {
          element.remove();
        }
      },
      restrict: 'A'
    };
  });
