'use strict';

angular.module('sauWebApp').controller('ActivateRequstCtrl', function ($scope, authService) {

  function init() {
    $scope.activationEmailRequested = false;
  }

  $scope.requestActivationEmail = function() {
    $scope.activationEmailRequested = true;
    authService.requestActivationEmail(authService.user.email);
  }

  init();
});