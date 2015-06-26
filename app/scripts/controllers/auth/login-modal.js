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
    function init() {
      //Register an event, and automatically deregister it when this scope is destroyed.
      $scope.$on('$destroy', $scope.$on('$locationChangeStart', handleLocationChange));
    }

    $scope.logIn = function(user) {
      $scope.errorMessage = '';
      $scope.logInResponse = authService.logIn(user);
      $scope.logInResponse.then(function() {
        authService.updateUser();
        $modalInstance.dismiss('logIn');
      },
      function(error) {
        $scope.errorMessage = error;
      });
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

    function handleLocationChange() {
      $modalInstance.dismiss('cancel');
    }

    init();
  });
