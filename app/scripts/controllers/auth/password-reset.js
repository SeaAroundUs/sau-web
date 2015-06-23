'use strict';

angular.module('sauWebApp').controller('PasswordResetCtrl', function ($scope, authService) {

  $scope.requestPasswordReset = function(email) {
    $scope.errorMessage = '';
    $scope.resetPromise = authService.requestNewPassword(email);
    $scope.resetPromise.then(resetSuccess, resetError);
  }

  function resetSuccess(response) {
    $scope.resetRequested = true;
  }

  function resetError(error) {
    $scope.errorMessage = error;
  }
});