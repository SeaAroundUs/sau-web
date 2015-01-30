'use strict';

/**
 * @ngdoc overview
 * @name sauWebApp
 * @description
 * # sauWebApp
 *
 * Main module of the application.
 */
angular
  .module('sauWebApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'leaflet-directive'
  ])
  .config(function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html'
      })
      .otherwise({
        redirectTo: '/'
      });
      $httpProvider.defaults.useXDomain = true;
  })
  .run(function ($http, SAU_CONFIG) {
    if (SAU_CONFIG.auth_b64) {
      $http.defaults.headers.common.Authorization = 'Basic ' + SAU_CONFIG.auth_b64;
    }
  });