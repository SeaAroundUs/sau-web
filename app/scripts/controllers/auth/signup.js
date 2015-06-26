'use strict';

angular.module('sauWebApp').controller('SignUpCtrl', function ($scope, authService, $location) {

  function init() {
    //The user shouldn't be on a signup page if they are signed in.
    //Redirect the user to the main page if they are already signed in.
    if (authService.isAuthenticated) {
      $location.path('/').replace();
    }
  }

  $scope.signUp = function(user) {
    $scope.errorMessage = '';
    $scope.signUpResponse = authService.signUp(user);
    $scope.signUpResponse.then(
      function(response) {
        $location.path('/activate').replace();
      },
      function(error) {
        if (error.code === 401) {
          $scope.errorCode = error.code;
        }
        $scope.errorMessage = error;
      });
  }

  init();
});
