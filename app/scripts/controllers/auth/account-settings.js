'use strict';

angular.module('sauWebApp').controller('AccountSettingsCtrl', function ($scope, authService, $location) {

  function init() {
    if (!authService.isAuthenticated) {
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
    $scope.updateInfoPromise = authService.updateInfo(user);
    $scope.updateInfoPromise.then(updateInfoSuccess, updateInfoError);
    $scope.infoForm.$setPristine();
    $scope.infoForm.$setUntouched();
  }

  $scope.infoInputChanged = function() {
    $scope.infoUpdated = false;
  }

  $scope.updatePassword = function(oldPassword, newPassword) {
    $scope.updatePasswordErrorMessage = '';
    $scope.updatePasswordPromise = authService.updatePassword(oldPassword, newPassword);
    $scope.updatePasswordPromise.then(updatePasswordSuccess, updatePasswordError);
    $scope.passwordForm.$setPristine();
    $scope.passwordForm.$setUntouched();
  }

  $scope.passwordInputChanged = function() {
    $scope.passwordUpdated = false;
  }

  function updateInfoSuccess(response) {
    $scope.infoUpdated = true;
  }

  function updateInfoError(error) {
    $scope.infoUpdated = false;
    $scope.updateInfoErrorMessage = error;
  }

  function updatePasswordSuccess(response) {
    $scope.passwordUpdated = true;
  }

  function updatePasswordError(error) {
    $scope.passwordUpdated = false;
    $scope.updatePasswordErrorMessage = error;
  }

  init();
});