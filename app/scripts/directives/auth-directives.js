'use strict';

angular.module('sauWebApp')
  .directive('compareTo', function () {
    return {
      require: 'ngModel',
      restrict: 'A',
      scope: {
        otherValue: '=compareTo'
      },
      link: function(scope, element, attrs, ngModel) {
        ngModel.$validators.compareTo = function(modelValue) {
          return modelValue === scope.otherValue;
        };

        scope.$watch('otherValue', function() {
          ngModel.$validate();
        });
      }
    };
  })

  .directive('authStatusButton', function(authService, $modal) {
    return {
      restrict: 'E',
      templateUrl: 'views/auth/auth-status-button.html',
      link: function(scope) {

        scope.logOut = function() {
          authService.logOut();
        };

        scope.logIn = function() {
          //Open a modal that allows the user to log in.
          $modal.open({
            templateUrl: 'views/auth/login-modal.html',
            controller: 'LoginModalCtrl',
            resolve: {
              nothing: 'something'
            }
          });
        };

        scope.user = authService.user;
        authService.updateUser();
      }
    };
  });
