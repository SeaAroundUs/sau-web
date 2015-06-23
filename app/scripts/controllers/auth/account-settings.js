'use strict';

angular.module('sauWebApp').controller('AccountSettingsCtrl', function ($scope, authService, $location) {

  function init() {
    if (!authService.user) {
      //TODO Take the user to a login page instead of the home page.
      $location.path('/')
    } else {
      //Fills in the input fields with pre-existing values
      $scope.user = {
        firstName: authService.user.firstName,
        lastName: authService.user.lastName,
        organization: authService.user.organization
      };
    }
  }

  $scope.updateInfo = function(user) {
    $scope.updateInfoErrorMessage = '';
    $scope.updateInfoPromise = authService.updateInfo(user).$promise.then(authService.updateUser);
    $scope.updateInfoPromise.then(updateInfoSuccess, updateInfoError);
    $scope.infoForm.$setPristine();
    $scope.infoForm.$setUntouched();
  };

  $scope.infoInputChanged = function() {
    $scope.infoUpdated = false;
  };

  $scope.updatePassword = function(oldPassword, newPassword) {
    $scope.updatePasswordErrorMessage = '';
    $scope.updatePasswordPromise = authService.updatePassword(oldPassword, newPassword);
    $scope.updatePasswordPromise.$promise.then(updatePasswordSuccess, updatePasswordError);
    $scope.passwordForm.$setPristine();
    $scope.passwordForm.$setUntouched();
  };

  $scope.passwordInputChanged = function() {
    $scope.passwordUpdated = false;
  };

  function updateInfoSuccess(response) {
    $scope.infoUpdated = true;
  }

  function updateInfoError(error) {
    $scope.infoUpdated = false;
    $scope.updateInfoErrorMessage = updateInfoErrorMessages[error.status.toString()] || updateInfoErrorMessages['default'];
  }

  function updatePasswordSuccess(response) {
    $scope.passwordUpdated = true;
  }

  function updatePasswordError(error) {
    $scope.passwordUpdated = false;
    $scope.updatePasswordErrorMessage = updatePasswordErrorMessages[error.status.toString()] || updatePasswordErrorMessages['default'];
  }

  var updateInfoErrorMessages = {
    '401': 'You are not authorized to update this information. Please try logging out and back in again.',
    'default': 'There was a problem updating your information. PLease try again later.'
  };

  var updatePasswordErrorMessages = {
    '400': 'You are not authorized to update this password. Please try logging out and back in again.',
    '401': 'Your old password is incorrect. Please try again.'
  };

  init();
});
