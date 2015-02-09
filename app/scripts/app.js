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
    'nvd3',
    'angular-data.DSCacheFactory'
  ])
  .config(['$resourceProvider', function($resourceProvider) {
    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;
  }])
  .run(function($http, DSCacheFactory) {

      var cache = new DSCacheFactory('defaultCache', {
          deleteOnExpire: 'aggressive',
          storageMode: 'localStorage'
      });

      $http.defaults.cache = cache.get('defaultCache');
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/eez'
      })
      // .when('/', {
      //   templateUrl: 'views/main.html',
      //   controller: 'MainCtrl'
      // })
      .when('/eez', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        resolve: {region: function() {return 'eez';}, detailView: function(){return false;}}
      })
      .when('/eez/:id', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        resolve: {region: function() {return 'eez';}, detailView: function(){return true}}
      })
      .when('/lme', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        resolve: {region: function() {return 'lme';}, detailView: function(){return false;}}
      })
      .when('/lme/:id', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        resolve: {region: function() {return 'lme';}, detailView: function(){return true}}
      })
      .when('/rfmo', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        resolve: {region: function() {return 'rfmo';}, detailView: function(){return false;}}
      })
      .when('/rfmo/:id', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        resolve: {region: function() {return 'rfmo';}, detailView: function(){return true}}
      })
      .when('/fao', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        resolve: {region: function() {return 'fao';}, detailView: function(){return false;}}
      })
      .when('/fao/:id', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        resolve: {region: function() {return 'fao';}, detailView: function(){return true}}
      })
      .when('/global', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        resolve: {region: function() {return 'global';}, detailView: function(){return false;}}
      })

      .otherwise({
        redirectTo: '/'
      });
  })
  // add option to not refresh view on location change
  // courtesy http://joelsaupe.com/programming/angularjs-change-path-without-reloading/
  .run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };
}]);
