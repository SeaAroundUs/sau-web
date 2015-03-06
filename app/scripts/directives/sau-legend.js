'use strict';

/**
 * @ngdoc directive
 * @name sauWebApp.directive:sauLegend
 * @description
 * # A directive to represent the legends that appear below the inset map on the region detail screens.
 */
angular.module('sauWebApp')
  .directive('sauLegend', function () {
    return {
      templateUrl: 'views/sau-legend.html',
      restrict: 'E',
      scope: {
      	legendKeys: '='
      }
    };
  });
