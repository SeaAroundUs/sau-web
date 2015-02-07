'use strict';

/**
 * @ngdoc function
 * @name sauWebApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sauWebApp
 */
angular.module('sauWebApp')
  .controller('RootCtrl', function ($scope, $location, sauService) {

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

    $scope.region = 'eez';

    $scope.changeRegion = function(region) {
      $location.path(region, false);
      $scope.region = region;
      $scope.getFeatures();
    };

    $scope.updateInclude = function(t) {
      $scope.template = t;
    };

    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };

    $scope.getFeatures = function() {

      sauService.Regions.get({region:$scope.region})
        .$promise.then(function(data) {
          angular.extend($scope, {
            geojson: {
              data: data.data,
              style: sauService.mapConfig.defaultStyle,
              resetStyleOnMouseout: true
            }
          });
        });
      };


  });