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
    'leaflet-directive',
    'ui.bootstrap',
    'nvd3'
  ])
  .config(['$resourceProvider', function($resourceProvider) {
    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;
  }])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/eez', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
      })
      .when('/eez/:id', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
      })
      .when('/lme', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
      })
      .when('/lme/:id', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
      })
      .when('/rfmo', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
      })
      .when('/rfmo/:id', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
      })
      .when('/fao', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl'
      })
      .when('/fao/:id', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl'
      })
      .when('/global', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl'
      })

      .otherwise({
        redirectTo: '/'
      });
  });
