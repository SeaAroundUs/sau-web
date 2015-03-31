;(function() {

  'use strict';

  angular.module('sauWebApp')
    .controller('RootCtrl', function ($scope, $location) {

      $scope.$on('$routeChangeSuccess', function(evt, location) {
        $scope.showCBDLogo = (location.$$route && location.$$route.controller === 'MarineTrophicIndexCtrl');

        if (location.$$route && location.$$route.controller === 'FERUCtrl') {
          $scope.templates[0].class = '';
          $scope.templates[3].class = 'selected';
        } else {
          $scope.templates[0].class = 'selected';
          $scope.templates[3].class = '';
        }
      });

      var hiddenData = {
        eez: [ 554, 555 ],
        lme: [ 46 ]
      };

      $scope.$watch(function() { return $location.url(); }, function(url) {
        var splitURL = url.split('/');
        var region = splitURL[1];
        var regionId = splitURL[2];
        var subView = splitURL[3];
        $scope.hideView = hiddenData[region] &&
          hiddenData[region].indexOf(parseInt(regionId)) > -1 &&
          subView !== 'exploited-organisms';
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
