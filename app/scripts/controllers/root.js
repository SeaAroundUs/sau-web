;(function() {

  'use strict';

  angular.module('sauWebApp')
    .controller('RootCtrl', function ($scope) {

      $scope.$on('$routeChangeSuccess', function(evt, location) {
        console.log(location.$$route.controller);
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

      $scope.region = {name: 'eez'};

      $scope.go = function(url) {
        window.location = url;
      };
    });
})();
