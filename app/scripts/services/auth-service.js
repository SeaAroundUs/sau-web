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

    function authenticate() {
      authService.isAuthenticated = true;
      $rootScope.$broadcast('logIn');
    }

    var authService = {
      isAuthenticated: false,
      user: null,
      signUp: function(user) {
        var me = this;
        var deferred = $q(function (resolve, reject) {
          if (me.isAuthenticated) {
            deferred.pending = false;
            reject('Cannot signup from a computer where a user is already authenticated. Please log out first.');
          }
          $timeout(function() {
            if (Math.random() > 0.5) {
              me.user = user;
              deferred.pending = false;
              resolve('Success');
            } else {
              deferred.pending = false;
              reject('EXAMPLE This email address is already taken.');
            }
          }, 1000);
        });

        deferred.pending = true;
        return deferred;
      },
      logIn: function(user) {
        console.log('Logging in as ' + user.email);
        var me = this;
        var deferred = $q(function (resolve, reject) {
          if (me.isAuthenticated) {
            reject('Cannot log in from a computer where a user is already authenticated. Please log out first.');
          }
          $timeout(function() {
            if (Math.random() > 0.5) {
              me.user = {
                firstName: 'Activated',
                lastName: 'User',
                organization: 'Bumble Bee Tuna',
                email: 'activateduser@test.com'
              };
              authenticate();
              deferred.pending = false;
              resolve('Success');
            } else {
              deferred.pending = false;
              reject('EXAMPLE Your email address or password was incorrect.');
            }
          }, 1000);
        });

        deferred.pending = true;
        return deferred;
      },
      logOut: function() {
        this.isAuthenticated = false;
        this.user = null;
        $rootScope.$broadcast('logOut');
      },
      activate: function(code) {
        console.log('Activating with code ' + code);
        var me = this;
        var deferred = $q(function (resolve, reject) {
          if (me.isAuthenticated) {
            reject('Cannot activate from a computer where a user is already authenticated. Please log out first.');
          }
          $timeout(function() {
            if (Math.random() > 0.5) {
              me.user = {
                firstName: 'Activated',
                lastName: 'User',
                organization: 'Bumble Bee Tuna',
                email: 'activateduser@test.com'
              };
              authenticate();
              deferred.pending = false;
              resolve('Success');
            } else {
              deferred.pending = false;
              reject('EXAMPLE Activation code not found.');
            }
          }, 1000);
        });

        deferred.pending = true;
        return deferred;
      },
      requestActivationEmail: function(email) {
        console.log('Requesting activation email for ' + email);
        var me = this;
        var deferred = $q(function (resolve, reject) {
          if (me.isAuthenticated) {
            reject('Cannot request an activation email from a computer where a user is already authenticated. Please log out first.');
          }
          $timeout(function() {
            if (Math.random() > 0.5) {
              deferred.pending = false;
              resolve('Success');
            } else {
              deferred.pending = false;
              reject('EXAMPLE Email address not found.');
            }
          }, 1000);
        });

        deferred.pending = true;
        return deferred;
      },
      updateInfo: function(user) {
        console.log('Updating info...' + user);
        var me = this;
        var deferred = $q(function (resolve, reject) {
          if (!me.isAuthenticated) {
            reject('Unauthorized');
          }
          $timeout(function() {
            if (Math.random() > 0.5) {
              me.user = user;
              $rootScope.$broadcast('updateInfo');
              deferred.pending = false;
              resolve('Success');
            } else {
              deferred.pending = false;
              reject('EXAMPLE Please try again later.');
            }
          }, 1000);
        });

        deferred.pending = true;
        return deferred;
      },
      updatePassword: function(oldPassword, newPassword) {
        oldPassword = '';
        newPassword = '';
        console.log('Updating password...');
        var me = this;
        var deferred = $q(function (resolve, reject) {
          if (!me.isAuthenticated) {
            reject('Unauthorized');
          }
          $timeout(function() {
            if (Math.random() > 0.5) {
              deferred.pending = false;
              resolve('Success');
            } else {
              deferred.pending = false;
              reject('EXAMPLE Your old password is not correct.');
            }
          }, 1000);
        });

        deferred.pending = true;
        return deferred;
      },
      requestNewPassword: function(email) {
        console.log('Requesting new password for ' + email);
        var me = this;
        var deferred = $q(function (resolve, reject) {
          if (me.isAuthenticated) {
            reject('Cannot request a new password for a logged-in user. Use the updatePassword endpoint.');
          }
          $timeout(function() {
            if (Math.random() > 0.5) {
              deferred.pending = false;
              resolve('Success');
            } else {
              deferred.pending = false;
              reject('EXAMPLE Email address not found.');
            }
          }, 1000);
        });

        deferred.pending = true;
        return deferred;
      }
    };

    return authService;
  });
