'use strict';

angular.module('sauWebApp')
  .factory('sauAPI', function ($resource, SAU_CONFIG, $http) {

    var resourceFactory = function(apiPath) {
      return $resource(SAU_CONFIG.apiURL + apiPath,
        {},
        {get: {method: 'GET', cache: true}, post: {method: 'POST', cache: true}}
      );
    };

    var methods = {

      Region: resourceFactory(':region/:region_id'),
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
      Taxon: resourceFactory('taxa/:taxon_key'),
      TaxonLevels: resourceFactory('taxon-level/'),
      TaxonGroups: resourceFactory('taxon-group/'),
      GeoList: resourceFactory('geo-entity/'),
      Subsidies: resourceFactory('geo-entity/:geo_id/subsidies/'),
      SubsidyReference: resourceFactory('subsidy-reference/:id'),
      Expeditions: resourceFactory('expeditions/:subview/:id'),
      UnderReview: resourceFactory('under-review/'),
      FishingEntities: resourceFactory('fishing-entity/'),
      CommercialGroups: resourceFactory('commercial-group/'),
      FunctionalGroups: resourceFactory('functional-group/'),
      SpatialCatchData: resourceFactory('spatial-catch/cells'),
      TaxonDistribution: {
        get: function (params) {
          if (!params || !params.id) {
            console.log('An id parameter is required for TaxonDistribution.get().');
            params = {id: 'missing'};
          }
          return $http.get(SAU_CONFIG.apiURL + 'taxa/' + params.id + '/distribution',
          {
            responseType: 'arraybuffer',
            headers: {'Accept': 'application/octet-stream'}
          });
        }
      },
      apiURL: SAU_CONFIG.apiURL
    };

    return methods;
  });
