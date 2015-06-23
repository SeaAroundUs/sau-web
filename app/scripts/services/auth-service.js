'use strict';

/**
 * @ngdoc service
 * @name sauWebApp.authService
 * @description
 * # authService
 * Provides an interface for interacting with the status and properties of user authentication.
 */
angular.module('sauWebApp')
  .factory('authService', function () {
    return {
      isAuthenticated: false,
      username: null,
    };
  });
