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
  .directive('authStatusButton', function(authService) {
    return {
      restrict: 'E',
      templateUrl: 'views/auth/auth-status-button.html',
      link: function(scope) {

        scope.logOut = function() {
          authService.logOut();
        }

        function updateButtonState() {
          scope.username = authService.username;
          scope.isAuthenticated = authService.isAuthenticated;
        }

        function destructor() {
          offLogin();
          offLogout();
        }

        var offLogin = scope.$on('logIn', updateButtonState);
        var offLogout = scope.$on('logOut', updateButtonState);
        scope.$on('$destroy', destructor);

        updateButtonState();
      }
    };
  });