;(function() {

  'use strict';

  angular.module('sauWebApp')
    .controller('RootCtrl', function ($scope, $rootScope, $location) {

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

      if ($rootScope.modalInstance) {
        $rootScope.modalInstance.close();
      }

      $scope.region = {name: 'eez'};

      $scope.$on('backButtonClick', function() {
        if ($rootScope.modalInstance &&
              (
                $location.path() === ('/' + $scope.region.name) ||
                $location.path() === ('/topic/biodiversity') // should be whitelisting modal-to-modal paths instead of this..
              )
            ) {
          $rootScope.modalInstance.close({location: $location.path()});
        }
      });

    });
})();