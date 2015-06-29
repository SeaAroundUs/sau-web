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
        return authAPI.Register.get(user);
      },

      logIn: function(user) {
        return authAPI.Login.get(user);
      },

      logOut: function() {
        return authAPI.Logout.get();
      },

      activate: function(code, email) {
        return authAPI.Activate.get({activationToken: code, email: email});
      },

      requestActivationEmail: function(email) {
        return authAPI.RequestActivationEmail.get({email: email});
      },

      updateInfo: function(user) {
        return authAPI.UpdateInfo.get(user);
      },

      updatePassword: function(oldPassword, newPassword) {
        return authAPI.UpdatePassword.get({
          oldPassword: oldPassword,
          newPassword: newPassword
        });
      },

      requestNewPassword: function(email) {
        return authAPI.RequestNewPassword.get({email: email});
      },

      generateNewPassword: function(code, email) {
        //return authAPI.GenerateNewPassword.get({token: code, email: email});
        console.log('Generate new password for ' + code + ', ' + email);
        var deferred = $q(function(respond, reject) {
          $timeout(function() {
            if (Math.random() > 0.5) {
              deferred.pending = false;
              respond('Success');
            } else {
              deferred.pending = true;
              reject({status: '1', statusText: 'We could not generate a new password. Please make sure the URL in your browser\'s address bar is correct.'});
            }
          }, 1000);
        });

        deferred.pending = true;
        return deferred;
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
