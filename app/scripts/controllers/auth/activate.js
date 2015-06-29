'use strict';

angular.module('sauWebApp').controller('ActivateCtrl', function ($scope, authService, $routeParams, $location, $timeout) {

  function init() {
    var email = $location.search().email;
    if (!$routeParams.code && email) {
      $location.path('/').replace();
    } else {
      authService.activate($routeParams.code, email).$promise.then(activateResponse, activateError);
    }
  }

  function activateResponse() {
    $scope.activationState = 1;
    authService.updateUser();

    var redirectPromise = $timeout(function() {
      $location.search({});
      $location.path('/');
    }, 1000);

    //Cancel the redirect if the user redirects themselves before the timeout is triggered.
    $scope.$on('$destroy', function() {
      $timeout.cancel(redirectPromise);
    })
  }

  function activateError(error) {
    $scope.activationState = -1;
    $scope.errorMessage = errorMessages[error.status.toString()] || errorMessages['default'];
  }

  $scope.activationState = 0;
  var errorMessages = {
    '400': 'We could not activate any account using the activation code provided. Please make sure your URL matches the one provided in your email.',
    'default': 'We\'re sorry, there was a problem activating your account.'
  };

  init();
});
