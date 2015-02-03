'use strict';

/**
 * @ngdoc function
 * @name sauWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sauWebApp
 */
angular.module('sauWebApp')
  .controller('RootCtrl', ['$scope', '$location', function ($scope, $location) {

    var templateDir = 'views/';
    $scope.templates = [
      {'name': 'Analyses and Visualization', 'url': templateDir+'data.html'},
      {'name': 'News', 'url': templateDir+'news.html'},
      {'name': 'Publications', 'url': templateDir+'publications.html'},
      {'name': 'People', 'url': templateDir+'people.html'},
      {'name': 'Collaborations', 'url': templateDir+'collaborations.html'},
      {'name': 'About Us', 'url': templateDir+'about.html'},
    ];
    $scope.template = $scope.templates[0];
    $scope.hoverRegion = {};

    $scope.log = function(txt) {
      console.log(txt);
    };

    $scope.updateInclude = function(t) {
      $scope.template = t;
    };

    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };

  }]);