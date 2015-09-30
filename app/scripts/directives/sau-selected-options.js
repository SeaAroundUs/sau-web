'use strict';

/**
 * @ngdoc directive
 * @name sauWebApp.directive:sauSelectedOptions
 * @description
 * # sauSelectedOptions
 */
angular.module('sauWebApp')
  .directive('sauSelectedOptions', function ($window) {
    return {
      templateUrl: 'views/sau-selected-options.html',
      restrict: 'E',
      scope: {
        limit: '=',
        selected: '=',
        title: '@',
        labelKey: '@',
        hideSelectHint: '='
      },
      link: function postLink(scope) {
        var platform = $window.navigator.platform.toLowerCase();
        if (platform.indexOf('win') !== -1) {
          scope.multiKey = 'Control';
        } else if (platform.indexOf('mac') !== -1) {
          scope.multiKey = 'Command';
        }
      }
    };
  });