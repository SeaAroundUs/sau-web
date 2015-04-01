'use strict';

angular.module('sauWebApp')
  .directive('sauLinkOrDisabled', function () {
    return {
      templateUrl: 'views/link-or-disabled.html',
      restrict: 'E',
      transclude: true,
      scope: {
        href: '=',
        show: '=',
        target: '=?',
      },
      controller: function($scope) {
        $scope.target = $scope.target || '_blank';
      }
    };
  });