'use strict';

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
          maxAge: 1000*60*60, // 1hr, value in ms
          capacity: Math.pow(2,20) * 128, // 128MB of memory storage
          storageMode: 'memory' // or 'localStorage', but size is limited
      });

      $http.defaults.cache = cache;
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        redirectTo: '/eez'
      })

      .when('/eez', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        resolve: {region: function() {return 'eez';}}
      })
      .when('/eez/:id', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        resolve: {region: function() {return 'eez';}}
      })
      .when('/eez/:id/marine-trophic-index', {
        templateUrl: 'views/marine-trophic-index.html',
        controller: 'MarineTrophicIndexCtrl',
        resolve: {region: function() {return 'eez';}}
      })
      .when('/eez/:id/stock-status', {
        templateUrl: 'views/stock-status.html',
        controller: 'StockStatusCtrl',
        resolve: {region: function() {return 'eez';}}
      })
      .when('/eez/:id/multinational-footprint', {
        templateUrl: 'views/multinational-footprint.html',
        controller: 'MultinationalFootprintCtrl',
        resolve: {region: function() {return 'eez';}}
      })

      .when('/lme', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        resolve: {region: function() {return 'lme';}}
      })
      .when('/lme/:id', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        resolve: {region: function() {return 'lme';}}
      })
      .when('/lme/:id/marine-trophic-index', {
        templateUrl: 'views/marine-trophic-index.html',
        controller: 'MarineTrophicIndexCtrl',
        resolve: {region: function() {return 'lme';}}
      })
      .when('/lme/:id/stock-status', {
        templateUrl: 'views/stock-status.html',
        controller: 'StockStatusCtrl',
        resolve: {region: function() {return 'lme';}}
      })

      .when('/rfmo', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        resolve: {region: function() {return 'rfmo';}}
      })
      .when('/rfmo/:id', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        resolve: {region: function() {return 'rfmo';}}
      })
      .when('/fao', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        resolve: {region: function() {return 'fao';}}
      })
      .when('/fao/:id', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        resolve: {region: function() {return 'fao';}}
      })
      .when('/fao/:id/marine-trophic-index', {
        templateUrl: 'views/marine-trophic-index.html',
        controller: 'MarineTrophicIndexCtrl',
        resolve: {region: function() {return 'fao';}}
      })
      .when('/fao/:id/stock-status', {
        templateUrl: 'views/stock-status.html',
        controller: 'StockStatusCtrl',
        resolve: {region: function() {return 'fao';}}
      })

      .when('/global', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        resolve: {region: function() {return 'global';}}
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
