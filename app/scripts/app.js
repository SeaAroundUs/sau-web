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
  .config(function ($routeProvider) {
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
  });
