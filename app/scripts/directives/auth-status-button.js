'use strict';

angular.module('sauWebApp').directive('authStatusButton', function(authService) {
  return {
    restrict: 'E',
    templateUrl: 'views/auth/auth-status-button.html',
    link: function(scope) {

      function updateButtonState() {
        scope.username = authService.username;
        scope.isAuthenticated = authService.isAuthenticated;
      }

      function destructor() {
        offLogin();
        offLogout();
      }

      var offLogin = scope.$on('login', updateButtonState);
      var offLogout = scope.$on('logout', updateButtonState);
      scope.$on('$destroy', destructor);

      updateButtonState();
    }
  };
});
