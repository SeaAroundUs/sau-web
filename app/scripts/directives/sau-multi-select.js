'use strict';

/**
 * @ngdoc directive
 * @name sauWebApp.directive:sauMultiSelect
 * @description
 * # sauMultiSelect
 */
angular.module('sauWebApp')
  .directive('sauMultiSelect', function () {
    return {
      templateUrl: 'views/sau-multi-select.html',
      restrict: 'E',
      scope: {
        searchPlaceholder: '@',
        labelKey: '@',
        data: '=',
        selected: '='
      }
    };
  });
