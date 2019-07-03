'use strict';

angular.module('sauWebApp')
  .factory('sauAPI', function ($resource, SAU_CONFIG, $http) {

    var resourceFactory = function(apiPath) {
      return $resource(SAU_CONFIG.apiURL + apiPath,
        {},
        {
          get: {method: 'GET', cache: true, headers: {'X-Request-Source': 'web'}},
          post: {method: 'POST', cache: true, headers: {'X-Request-Source': 'web'}}
        }
      );
    };

    var methods = {

      Region: resourceFactory(':region/:region_id'),
      MultiRegionMetrics: resourceFactory(':region/metrics/'),
      Regions: resourceFactory(':region/'),
      IFA: resourceFactory('eez/:region_id/ifa/'),
      AccessAgreementExternal: resourceFactory('fishing-entity/:region_id/access-agreement-external/'),
      AccessAgreementInternal: $resource(SAU_CONFIG.apiURL + 'eez/:region_id/access-agreement-internal/',
        {},
        {
          get: {
            method: 'GET',
            cache: true,
            transformResponse: function(response) {
              //TEMPORARY: Deleting all Pre-EEZ declaration-year agreements.
              //Revert this change (blame) when UBC is ready to show that data.
              response = JSON.parse(response);
              response.data.pre.length = 0;
              return response;
            }
          },
          post: {
            method: 'POST',
            cache: true
          }
        }
      ),
      CountryProfile: resourceFactory('country/:region_id'),
      Mariculture: resourceFactory('mariculture/:region_id'),
      MaricultureData: resourceFactory('mariculture/:dimension/:entity_id'),
      Data: resourceFactory(':region/:measure/:dimension/'),
      MarineTrophicIndexData: resourceFactory(':region/marine-trophic-index/'),
      StockStatusData: resourceFactory(':region/stock-status/'),
      EstuariesData: resourceFactory(':region/estuaries/'),
      MultinationalFootprintData: resourceFactory(':region/multinational-footprint/'),
      ExploitedOrganismsData: resourceFactory(':region/exploited-organisms/'),
      ExploitedOrganismsList: resourceFactory('exploited-organisms/'),
      EEZVsHighSeasData: resourceFactory('global/eez-vs-high-seas/'),
      Taxa: resourceFactory('taxa/'),
      MSY: resourceFactory('msy/:region_id'),
      Taxon: resourceFactory('taxa/:taxon_key'),
      TaxonLevels: resourceFactory('taxon-level/'),
      TaxonGroups: resourceFactory('taxon-group/'),
      GeoList: resourceFactory('geo-entity/'),
      Subsidies: resourceFactory('geo-entity/:geo_id/subsidies/'),
      SubsidyReference: resourceFactory('subsidy-reference/:id'),
      Expeditions: resourceFactory('expeditions/:subview/:id'),
      UnderReview: resourceFactory('under-review/'),
      FishingEntities: resourceFactory('fishing-entity/'),
      FishingEffort: resourceFactory('fishing-entity-effort/'),
      CommercialGroups: resourceFactory('commercial-group/'),
      FunctionalGroups: resourceFactory('functional-group/'),
      Gear: resourceFactory('gear/'),
      SpatialCatchData: {
        get: function (params) {
          var url = SAU_CONFIG.apiURL + 'spatial-catch/cells';
          var urlParams = [];
          for (var key in params) {
            if (!params.hasOwnProperty(key)) {
              return;
            }
            urlParams.push(key + '=' + params[key]);
          }
          if (urlParams.length > 0) {
            url += '?';
          }
          for (var i = 0; i < urlParams.length; i++) {
            url += urlParams[i];
            if (i < urlParams.length - 1) {
              url += '&';
            }
          }
          var requestConfig = {headers:{}};
          if (!params.stats) {
            requestConfig = {
              responseType: 'arraybuffer',
              headers: {'Accept': 'application/octet-stream'}
            };
          }
          requestConfig.headers['X-Request-Source'] = 'web';
          return $http.get(url, requestConfig);
        }
      },
      TaxonDistribution: {
        get: function (params) {
          if (!params || !params.id) {
            console.log('An id parameter is required for TaxonDistribution.get().');
            params = {id: 'missing'};
          }
          return $http.get(SAU_CONFIG.apiURL + 'taxa/' + params.id + '/distribution',
          {
            responseType: 'arraybuffer',
            headers: {'Accept': 'application/octet-stream', 'X-Request-Source': 'web'}
          });
        }
      },
      Glossary: resourceFactory('glossary/'),
      ProceduresAndOutcomes: resourceFactory('p-and-o/'),
      Years: resourceFactory('years/'),
      apiURL: SAU_CONFIG.apiURL
    };

    return methods;
  });
