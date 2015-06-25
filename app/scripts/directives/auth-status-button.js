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
        offUpdateInfo();
      }

      var offLogin = scope.$on('login', updateButtonState);
      var offLogout = scope.$on('logout', updateButtonState);
      var offUpdateInfo = scope.$on('updateInfo', updateButtonState);
      scope.$on('$destroy', destructor);

      updateButtonState();
    }
  };
});
