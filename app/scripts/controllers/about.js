'use strict';

/**
 * @ngdoc function
 * @name sauWebApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the sauWebApp
 */
angular.module('sauWebApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
