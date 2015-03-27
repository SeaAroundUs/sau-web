;(function() {

  'use strict';

  angular.module('sauWebApp')
    .controller('RootCtrl', function ($scope) {

      $scope.$on('$routeChangeSuccess', function(evt, location) {
        $scope.showCBDLogo = (location.$$route.controller === 'MarineTrophicIndexCtrl');
      });

      var hiddenData = {
        eez: [ 554, 555 ],
        lme: [ 46 ]
      };

      $scope.$on('$routeChangeSuccess', function(evt, location) {
        var region = location.locals.region;
        var id = location.params.id;
        $scope.hideView = (location.$$route.controller !== 'ExploitedOrganismsCtrl' &&
            hiddenData[region] &&
            hiddenData[region].indexOf(parseInt(id)) > -1
        );
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
