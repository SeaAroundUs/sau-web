'use strict';

angular.module('sauWebApp')
  .directive('sauLinkOrDisabled', function () {
    return {
      templateUrl: 'views/link-or-disabled.html',
      restrict: 'E',
      scope: {
        link: '=',
        show: '='
      }
    };
  });