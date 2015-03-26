;(function() {

  'use strict';

  angular.module('sauWebApp')
    .controller('RootCtrl', function ($scope) {

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
