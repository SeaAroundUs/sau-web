'use strict';

/**
 * @ngdoc service
 * @name sauWebApp.authService
 * @description
 * # authService
 * Provides an interface for interacting with the status and properties of user authentication.
 */
angular.module('sauWebApp')
  .factory('authService', function ($timeout, $q, $rootScope) {

    function authenticate(username) {
      authService.username = username;
      authService.isAuthenticated = true;
      $rootScope.$broadcast('logIn');
    }

    var authService = {
      isAuthenticated: false,
      username: null,
      signUp: function(user) {
        var me = this;
        var deferred = $q(function (resolve, reject) {
          if (me.isAuthenticated) {
            deferred.pending = false;
            reject('Cannot signup from a computer where a user is already authenticated. Please log out first.');
          }
          $timeout(function() {
            if (Math.random() > 0.5) {
              authenticate(user.email);
              deferred.pending = false;
              resolve('Success');
            } else {
              deferred.pending = false;
              reject('EXAMPLE This username is already taken.');
            }
          }, 1000);
        });

        deferred.pending = true;
        return deferred;
      },
      logIn: function(user) {
        var me = this;
        var deferred = $q(function (resolve, reject) {
          if (me.isAuthenticated) {
            deferred.pending = false;
            reject('Cannot log in from a computer where a user is already authenticated. Please log out first.');
          }
          $timeout(function() {
            if (Math.random() > 0.5) {
              authenticate(user.email);
              deferred.pending = false;
              resolve('Success');
            } else {
              deferred.pending = false;
              reject('EXAMPLE Your username or password was incorrect.');
            }
          }, 1000);
        });

        deferred.pending = true;
        return deferred;
      },
      logOut: function() {
        this.isAuthenticated = false;
        this.username = false;
        $rootScope.$broadcast('logOut');
      }
    };

    return authService;
  });
