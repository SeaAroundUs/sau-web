'use strict';

angular.module('sauWebApp').controller('ActivateRequestCtrl', function ($scope, authService) {

  function init() {
    $scope.activationEmailRequest = 0; //Not requested
  }

  $scope.requestActivationEmail = function() {
    $scope.activationEmailRequest = 1; //Requested
    authService.requestActivationEmail(authService.user.email).$promise.then(requestEmailResponse, requestEmailError);
  }

  function requestEmailResponse(response) {
  	$scope.activationEmailRequest = 2; //Request success
  }

  function requestEmailError(error) {
  	$scope.activationEmailRequest = -1; //Request failure.
    $scope.errorMessage = errorMessages[error.status.toString()] || errorMessages['default'];
  }

  var errorMessages = {
    'default': 'There was a problem requesting another activation email. Please try again later.'
  }

  init();
});
