'use strict';

/**
 * @ngdoc function
 * @name sauWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sauWebApp
 */
angular.module('sauWebApp')
  .controller('RootCtrl', function ($scope, $rootScope, $location, sauAPI, mapConfig) {

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

    $scope.region = 'eez';

    $scope.changeRegion = function(region) {
      $location.path(region, false);
      $scope.region = region;
      $scope.getFeatures();
    };

    $scope.changeRegionGlobal = function() {
      var region = 'global';
      $location.path(region, true);
      $scope.region = region;
    };

    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };

    $scope.geojson = {};
    $scope.getFeatures = function() {

      $scope.features = sauAPI.Regions.get({region:$scope.region});
      $scope.features.$promise.then(function(data) {
          angular.extend($scope, {
            geojson: {
              data: data.data,
              style: mapConfig.defaultStyle,
            }
          });
        });
    };
    $scope.getFeatures();

    if ($rootScope.modalInstance) {
      $rootScope.modalInstance.close();
    }

    $scope.$on('backButtonClick', function() {
      if ($rootScope.modalInstance && $location.path() === ('/' + $scope.region)) {
        $rootScope.modalInstance.close();
      }
    });

  });