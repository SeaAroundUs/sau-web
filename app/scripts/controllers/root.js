;(function() {

  'use strict';

  angular.module('sauWebApp')
    .controller('RootCtrl', function ($scope) {

      $scope.templates = [
        {'name': 'Analyses & Visualization', 'url': '/data/#/', 'class': 'selected'},
        {'name': 'Publications', 'url': '', 'class': 'disabled'},
        {'name': 'News & About', 'url': '/about/'},
        {'name': 'Collaborations', 'url': '/collaborations/'},
        {'name': 'Contact Us', 'url': '', 'class': 'disabled'}
      ];
      $scope.template = $scope.templates[0];

      $scope.region = {name: 'eez'};

      $scope.go = function(url) {
        window.location = url;
      };
    });
})();
