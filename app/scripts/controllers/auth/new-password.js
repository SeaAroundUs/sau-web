'use strict';

angular.module('sauWebApp').controller('NewPasswordCtrl', function ($scope, authService, $routeParams, $location) {

  function init() {
    if (!$routeParams.code || !$routeParams.email) {
      $location.path('/').replace();
    } else {
      $scope.newPasswordState = 0;
      $scope.newPasswordPromise = authService.generateNewPassword($routeParams.code, $routeParams.email);
      $scope.newPasswordPromise.then(newPasswordSuccess, newPasswordError);
    }
  }

  function newPasswordSuccess() {
    $scope.newPasswordState = 1;
  }

  function newPasswordError(error) {
    $scope.newPasswordState = -1;
    $scope.errorMessage = errorMessages[error.status.toString()] || errorMessages['default'];
  }

  var errorMessages = {
    'default': 'We could not generate a new password. Please make sure the URL in your browser\'s address bar is correct.'
  };

  init();
});
