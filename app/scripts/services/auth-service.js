'use strict';

/**
 * @ngdoc service
 * @name sauWebApp.authService
 * @description
 * # authService
 * Provides an interface for interacting with the status and properties of user authentication.
 */
angular.module('sauWebApp')
  .factory('authService', function ($timeout, $q, $rootScope, authAPI) {
    var authService = {
      user: false,

      signUp: function(user) {
        return authAPI.Register.get(user).$promise;
      },

      logIn: function(user) {
        return authAPI.Login.get(user).$promise;
      },

      logOut: function() {
        return authAPI.Logout.get().$promise;
      },

      activate: function(code, email) {
        return authAPI.Activate.get({activationToken: code, email: email}).$promise;
      },

      requestActivationEmail: function(email) {
        return authAPI.RequestActivationEmail.get({email: email}).$promise;
      },

      updateInfo: function(user) {
        return authAPI.UpdateInfo.get(user).$promise;
      },

      updatePassword: function(oldPassword, newPassword) {
        angular.noop(oldPassword, newPassword); //TODO
      },

      requestNewPassword: function(email) {
        return authAPI.RequestNewPassword.get({email: email}).$promise;
      },

      updateUser: function() {
        return authAPI.Status.get(function(result) {
          authService.user = result.user;
        }, function() {
          authService.user = false;
        });
      }
    };

    return authService;
  });
