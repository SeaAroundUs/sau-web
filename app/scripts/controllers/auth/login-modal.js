'use strict';

/**
 * @ngdoc function
 * @name sauWebApp.controller:LoginModalCtrl
 * @description
 * # LoginModalCtrl
 * Controller for the login modal dialog.
 */
angular.module('sauWebApp')
  .controller('LoginModalCtrl', function ($scope, $modalInstance, authService) {
    $scope.logIn = function(user) {
      $scope.errorMessage = '';
      $scope.logInResponse = authService.logIn(user);
      $scope.logInResponse.then(function(response) {
        $modalInstance.dismiss('logIn');
      },
      function(error) {
        $scope.errorMessage = error;
      });
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  });
