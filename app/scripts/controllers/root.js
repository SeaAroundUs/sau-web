;(function() {

  'use strict';

  angular.module('sauWebApp')
    .controller('RootCtrl', function ($scope) {

      var templateDir = 'views/';
      $scope.templates = [
        {'name': 'Analyses & Visualization', 'url': templateDir+'data.html', 'class': 'selected'},
        {'name': 'Publications', 'url': templateDir+'publications.html'},
        {'name': 'News & About', 'url': templateDir+'news.html'},
        {'name': 'Collaborations', 'url': templateDir+'collaborations.html'},
        // {'name': 'People', 'url': templateDir+'people.html'},
        {'name': 'Contact Us', 'url': templateDir+'about.html'},
      ];
      $scope.template = $scope.templates[0];

      $scope.region = {name: 'eez'};

    });
})();