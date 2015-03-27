;(function() {

  'use strict';

  angular.module('sauWebApp')
    .controller('RootCtrl', function ($scope) {

      $scope.$on('$routeChangeSuccess', function(evt, location) {
        $scope.showCBDLogo = (location.$$route.controller === 'MarineTrophicIndexCtrl');
      });

      $scope.templates = [
        {'name': 'Analyses & Visualization', 'url': '/data/#/', 'class': 'selected'},
        {'name': 'Publications', 'url': '/articles/'},
        {'name': 'News & About', 'url': '/about/'},
        {'name': 'Collaborations', 'url': '/collaborations/'},
        {'name': 'Contact Us', 'url': '/contact/'}
      ];
      $scope.template = $scope.templates[0];

      $scope.go = function(url) {
        window.location = url;
      };
    });
})();
