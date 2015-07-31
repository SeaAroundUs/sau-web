'use strict';

angular.module('sauWebApp')
  .directive('regionDataLegend', function() {
    return {
      scope: { region: '=' }
    };
  });
