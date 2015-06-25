'use strict';

angular.module('sauWebApp').controller('ActivateCtrl', function ($scope, authService, $routeParams, $location, $timeout) {

  function init() {
    if (!$routeParams.code) {
      $location.path('/').replace();
    } else {
      authService.activate($routeParams.code).then(activateResponse, activateError);
    }
  }

  function activateResponse(response) {
    $scope.activationState = 1;

    var redirectPromise = $timeout(function() {
      $location.path('/');
    }, 1000);

    //Cancel the redirect if the user redirects themselves before the timeout is triggered.
    $scope.$on('$destroy', function() {
      $timeout.cancel(redirectPromise);
    })
  }

  function activateError(error) {
    $scope.errorMessage = error;
    $scope.activationState = -1;
  }

  $scope.activationState = 0;

  init();
});