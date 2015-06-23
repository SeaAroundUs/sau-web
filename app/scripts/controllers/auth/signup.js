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
    $scope.signUpResponse.$promise.then(
      function(response) {
        $location.path('/activate').replace();
      },
      function(error) {
        $scope.errorMessage = errorMessages[error.status.toString()] || errorMessages['default'];
      });
  }

  var errorMessages = {
    '400': 'This email address already has an account.',
    '418': 'I\'m a teapot.',
    'default': 'There was a problem signing up. Please try again.'
  };

  init();
});
