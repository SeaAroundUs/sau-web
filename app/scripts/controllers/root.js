;(function() {

  'use strict';

  angular.module('sauWebApp')
    .controller('RootCtrl', function ($scope, $rootScope, $location) {

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

      if ($rootScope.modalInstance) {
        $rootScope.modalInstance.close();
      }

      $scope.region = {name: 'eez'};

      $scope.$on('backButtonClick', function() {
        if ($rootScope.modalInstance &&
              (
                // should be whitelisting modal-to-modal paths instead of this..
                $location.path() === ('/' + $scope.region.name) ||
                $location.path() === ('/topic/biodiversity'),
                $location.path() === ('/mariculture'),
                $location.path().slice(0,5) === ('/taxa')
              )
            ) {
          $rootScope.modalInstance.close({location: $location.path()});
        }
      });

    });
})();