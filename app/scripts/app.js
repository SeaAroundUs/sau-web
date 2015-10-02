'use strict';

angular
  .module('sauWebApp', [
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'leaflet-directive',
    'ui.bootstrap',
    'nvd3',
    'angular-data.DSCacheFactory',
    'ui.grid',
    'ui.grid.cellNav',
    'ui.grid.selection',
    'ui.select',
    'angulartics',
    'angulartics.google.analytics',
    'selectize'
  ])

  // don't strip trailing slashes from calculated URLs
  .config(['$resourceProvider', function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
  }])

  // cache settings
  .run(function($http, DSCacheFactory) {
      var cache = new DSCacheFactory('defaultCache', {
        deleteOnExpire: 'aggressive',
        maxAge: 1000*60*60, // 1hr, value in ms
        capacity: Math.pow(2,20) * 128, // 128MB of memory storage
        storageMode: 'memory' // or 'localStorage', but size is limited
      });

      $http.defaults.cache = cache;
    })

  // route configurations
  .config(function ($routeProvider, SAU_CONFIG, togglesProvider) {

    // default and build version routes
    $routeProvider
      .when('/', {
        redirectTo: '/eez'
      })
      .when('/build', {
        template: SAU_CONFIG.buildNumber
      });

    // EEZ routes
    $routeProvider
      .when('/eez', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        resolve: {region: function() {return 'eez';}}
      })
      .when('/eez/:ids', {
        templateUrl: 'views/region-data/main.html',
        controller: 'RegionDataCtrl',
        reloadOnSearch: false,
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
      .when('/eez/:id/exploited-organisms', {
        templateUrl: 'views/exploited-organisms.html',
        controller: 'ExploitedOrganismsCtrl',
        resolve: {region: function() {return 'eez';}}
      })
      .when('/eez/:id/estuaries', {
        templateUrl: 'views/estuaries.html',
        controller: 'EstuariesCtrl',
        resolve: {region: function() {return 'eez';}}
      })
      .when('/eez/:id/internal-fishing-access', {
        templateUrl: 'views/internal-fishing-access.html',
        controller: 'InternalFishingAccessCtrl',
        resolve: {
          agreements: function($route, sauAPI) {
            return sauAPI.AccessAgreementInternal.get({'region_id': $route.current.params.id}).$promise;
          },
          region: function($route, sauAPI) {
            return sauAPI.Region.get({'region': 'eez', 'region_id': $route.current.params.id}).$promise;
          }
        }
      });

    // LME routes
    $routeProvider
      .when('/lme', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        reloadOnSearch: false,
        resolve: {region: function() {return 'lme';}}
      })
      .when('/lme/:ids', {
        templateUrl: 'views/region-data/main.html',
        controller: 'RegionDataCtrl',
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
      .when('/lme/:id/exploited-organisms', {
        templateUrl: 'views/exploited-organisms.html',
        controller: 'ExploitedOrganismsCtrl',
        resolve: {region: function() {return 'lme';}}
      });

    // RFMO routes
    $routeProvider
      .when('/rfmo', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        reloadOnSearch: false,
        resolve: {region: function() {return 'rfmo';}}
      })
      .when('/rfmo/:ids', {
        templateUrl: 'views/region-data/main.html',
        controller: 'RegionDataCtrl',
        reloadOnSearch: false,
        resolve: {region: function() {return 'rfmo';}}
      })
      .when('/rfmo/:id/procedures-and-outcomes', {
        templateUrl: 'views/procedures-and-outcomes.html',
        controller: 'ProceduresAndOutcomesCtrl'
      })
      .when('/rfmo/:id/marine-trophic-index', {
        templateUrl: 'views/marine-trophic-index.html',
        controller: 'MarineTrophicIndexCtrl',
        resolve: {region: function() {return 'rfmo';}}
      })
      .when('/rfmo/:id/stock-status', {
        templateUrl: 'views/stock-status.html',
        controller: 'StockStatusCtrl',
        resolve: {region: function() {return 'rfmo';}}
      });

    // High Seas routes
    if (togglesProvider.$get().isEnabled('highseas')) {
      $routeProvider
        .when('/highseas', {
          templateUrl: 'views/map.html',
          controller: 'MapCtrl',
          reloadOnSearch: false,
          resolve: {region: function() {return 'highseas';}}
        })
        .when('/highseas/:id', {
          templateUrl: 'views/region-detail/main.html',
          controller: 'RegionDetailCtrl',
          resolve: {region: function() {return 'highseas';}}
        })
        .when('/highseas/:id/marine-trophic-index', {
          templateUrl: 'views/marine-trophic-index.html',
          controller: 'MarineTrophicIndexCtrl',
          resolve: {region: function() {return 'highseas';}}
        })
        .when('/highseas/:id/stock-status', {
          templateUrl: 'views/stock-status.html',
          controller: 'StockStatusCtrl',
          resolve: {region: function() {return 'highseas';}}
        });
    }

    // Global routes
    if (togglesProvider.$get().isEnabled('global')) {
      $routeProvider
        .when('/global', {
          templateUrl: 'views/region-data/main.html',
          controller: 'RegionDataCtrl',
          reloadOnSearch: false,
          resolve: {region: function() {return 'global';}}
        })
        .when('/global/exploited-organisms', {
          templateUrl: 'views/exploited-organisms.html',
          controller: 'ExploitedOrganismsCtrl',
          resolve: {region: function() {return 'global';}}
        })
        .when('/global/marine-trophic-index', {
          templateUrl: 'views/marine-trophic-index.html',
          controller: 'MarineTrophicIndexCtrl',
          resolve: {region: function() {return 'global';}}
        })
        .when('/global/stock-status', {
          templateUrl: 'views/stock-status.html',
          controller: 'StockStatusCtrl',
          resolve: {region: function() {return 'global';}}
        });
    }

    // Fishing Entity routes
    if (togglesProvider.$get().isEnabled('fishingEntity')) {
      $routeProvider
        .when('/fishing-entity', {
          templateUrl: 'views/map.html',
          controller: 'MapCtrl',
          reloadOnSearch: false,
          resolve: {region: function() {return 'fishing-entity';}}
        })
        .when('/fishing-entity/:ids', {
          templateUrl: 'views/region-data/main.html',
          controller: 'RegionDataCtrl',
          reloadOnSearch: false,
          resolve: {region: function() {return 'fishing-entity';}}
        })
        .when('/fishing-entity/:id/external-fishing-access', {
          templateUrl: 'views/external-fishing-access.html',
          controller: 'ExternalFishingAccessCtrl',
          resolve: {
            agreements: function ($route, sauAPI) {
              return sauAPI.AccessAgreementExternal.get({'region_id': $route.current.params.id}).$promise;
            },
            region: function ($route, sauAPI) {
              return sauAPI.Region.get({'region': 'fishing-entity', 'region_id': $route.current.params.id}).$promise;
            }
          }
        });
    }

    // Country EEZs routes
    if (togglesProvider.$get().isEnabled('country-eezs')) {
      $routeProvider
        .when('/country-eezs/:ids', {
          templateUrl: 'views/region-data/main.html',
          controller: 'RegionDataCtrl',
          reloadOnSearch: false,
          resolve: {region: function() {return 'country-eezs';}}
        });
    }

    // Taxon routes
    if (togglesProvider.$get().isEnabled('taxon')) {
      $routeProvider
        .when('/taxon/:ids', {
          templateUrl: 'views/region-data/main.html',
          controller: 'RegionDataCtrl',
          reloadOnSearch: false,
          resolve: {region: function() {return 'taxa';}}
        });
    }

    // FAO routes
    if (togglesProvider.$get().isEnabled('fao')) {
      $routeProvider
        .when('/fao', {
          templateUrl: 'views/map.html',
          controller: 'MapCtrl',
          reloadOnSearch: false,
          resolve: {region: function() {return 'fao';}}
        })
        .when('/fao/:ids', {
          templateUrl: 'views/region-data/main.html',
          controller: 'RegionDataCtrl',
          reloadOnSearch: false,
          resolve: {region: function() {return 'fao';}}
        })
        .when('/fao/:id/exploited-organisms', {
          templateUrl: 'views/exploited-organisms.html',
          controller: 'ExploitedOrganismsCtrl',
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
        });
    }

    // EEZ Bordering
    if (togglesProvider.$get().isEnabled('eez-bordering')) {
      $routeProvider
        .when('/eez-bordering/:ids', {
          templateUrl: 'views/region-data/main.html',
          controller: 'RegionDataCtrl',
          reloadOnSearch: false,
          resolve: {region: function() {return 'eez-bordering';}}
        });
    }

    // mariculture routes
    $routeProvider
      .when('/mariculture', {
        templateUrl: 'views/map.html',
        controller: 'MapCtrl',
        reloadOnSearch: false,
        resolve: {region: function() {return 'mariculture';}}
      })
      .when('/mariculture/:id', {
        templateUrl: 'views/region-detail/main.html',
        controller: 'RegionDetailCtrl',
        resolve: {region: function() {return 'mariculture';}}
      });

    // non-regional routes
    $routeProvider
      .when('/taxa/:taxon', {
        templateUrl: 'views/key-info-on-taxon.html',
        controller: 'KeyInfoOnTaxonCtrl'
      })
      .when('/country/:id', {
        templateUrl: 'views/country-profile.html',
        controller: 'CountryProfileCtrl'
      })
      .when('/subsidy/:id', {
        templateUrl: 'views/subsidy.html',
        controller: 'SubsidyCtrl'
      })
      .when('/topic/biodiversity', {
        templateUrl: 'views/topic-biodiversity.html',
        controller: 'TopicBiodiversityCtrl'
      })
      .when('/feru', {
        templateUrl: 'views/feru.html',
        controller: 'FERUCtrl'
      })
      .when('/marine-trophic-index', {
        templateUrl: 'views/marine-trophic-index-search.html',
        controller: 'MarineTrophicIndexSearchCtrl'
      })
      .when('/expedition', {
        templateUrl: 'views/expedition.html',
        controller: 'ExpeditionCtrl'
      });

    // advanced search routes
    $routeProvider
      .when('/search', {
        templateUrl: 'views/advanced-search/advanced-search.html',
        controller: 'AdvancedSearchCtrl'
      })
      .when('/result/', {
        templateUrl: 'views/region-detail/main.html',
        controller: 'RegionDetailCtrl',
        reloadOnSearch: false,
        resolve: {region: function() {return 'multi';}}
      });

    // Spatial catch routes
    if (togglesProvider.$get().isEnabled('spatial')) {
      $routeProvider
        .when('/spatial-catch', {
          templateUrl: 'views/spatial-catch.html',
          controller: 'SpatialCatchMapCtrl',
          reloadOnSearch: false,
          resolve: {
            taxa: function (sauAPI) {
              return sauAPI.Taxa.get().$promise;
            },
            fishingCountries: function (sauAPI) {
              return sauAPI.FishingEntities.get().$promise;
            },
            commercialGroups: function (sauAPI) {
              return sauAPI.CommercialGroups.get().$promise;
            },
            functionalGroups: function (sauAPI) {
              return sauAPI.FunctionalGroups.get().$promise;
            },
            eezSpatialData: function (sauAPI) {
              return sauAPI.Regions.get({region: 'eez', format: 'topojson'}).$promise;
            }
          }
        });
    }

    // user auth routes
    if (togglesProvider.$get().isEnabled('auth')) {
      $routeProvider
        .when('/signup/', {
          templateUrl: 'views/auth/signup.html',
          controller: 'SignUpCtrl'
        })
        .when('/activate/', {
          templateUrl: 'views/auth/activate-request.html',
          controller: 'ActivateRequestCtrl'
        })
        .when('/activate/:code', {
          templateUrl: 'views/auth/activate.html',
          controller: 'ActivateCtrl'
        })
        .when('/me', {
          templateUrl: 'views/auth/account-settings.html',
          controller: 'AccountSettingsCtrl'
        })
        .when('/password-reset', {
          templateUrl: 'views/auth/password-reset.html',
          controller: 'PasswordResetCtrl'
        })
        .when('/new-password/:code', {
          templateUrl: 'views/auth/new-password.html',
          controller: 'NewPasswordCtrl'
        });
    }

    // missed route handling
    $routeProvider
      .otherwise({
        redirectTo: '/' //TODO should this 404?
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
  }])

  // on logout take user back to root path
  .run(function($rootScope, $location) {
    $rootScope.$on('logOut', function() {
      $location.path('/').replace();
    });
  });
