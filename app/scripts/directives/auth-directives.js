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

  .directive('authStatusButton', function(authService, $modal, $location, toggles) {
    return {
      restrict: 'E',
      templateUrl: 'views/auth/auth-status-button.html',
      link: function(scope) {

        scope.logOut = function() {
          authService.logOut().$promise.then(function() {
            authService.updateUser();
            $location.path('/');
          });
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

        scope.$watch(function() { return authService.user; }, function() {
          scope.user = authService.user;
        }, function() {
          scope.user = false;
        });

        if (toggles.isEnabled('auth')) {
          authService.updateUser();
        }
      }
    };
  });
