'use strict';

angular.module('sauWebApp')
  .factory('authAPI', function($resource, SAU_CONFIG) {
    var resourceFactory = function(authPath) {
      return $resource(SAU_CONFIG.authURL + authPath,
        {},
        {
          get: {method: 'GET', cache: false, withCredentials: true},
          post: {method: 'POST', cache: false, withCredentials: true}
        }
      );
    };

    return {
      Register: resourceFactory('register/'),
      Activate: resourceFactory('activate/'),
      Login: resourceFactory('login/'),
      Logout: resourceFactory('logout/'),
      RequestActivationEmail: resourceFactory('resend-activation-email/'),
      RequestNewPassword: resourceFactory('password-reset/'),
      UpdateInfo: resourceFactory('update-info/'),
      Status: resourceFactory('status/')
    };
  });
