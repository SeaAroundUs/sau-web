;(function() {

'use strict';

angular.module('sauWebApp')
  .factory('sauAPI', function ($resource, SAU_CONFIG) {

    var resourceFactory = function(apiPath) {
      return $resource(SAU_CONFIG.apiURL + apiPath, {}, {get: {method: 'GET', cache: true}});
    };

    var methods = {

      Region: resourceFactory(':region/:region_id'),
      Regions: resourceFactory(':region/'),
      IFA: resourceFactory('eez/:region_id/ifa/'),
      CountryProfile: resourceFactory('country/:region_id'),
      Mariculture: resourceFactory('country/:region_id/mariculture/'),
      MaricultureData: resourceFactory('mariculture/:region_id'),
      Data: resourceFactory(':region/:measure/:dimension/'),
      MarineTrophicIndexData: resourceFactory(':region/marine-trophic-index/'),
      StockStatusData: resourceFactory(':region/stock-status/'),
      EstuariesData: resourceFactory(':region/estuaries/'),
      MultinationalFootprintData: resourceFactory(':region/multinational-footprint/'),
      ExploitedOrganismsData: resourceFactory(':region/exploited-organisms/'),
      EEZVsHighSeasData: resourceFactory('global/eez-vs-high-seas/'),
      Taxon: resourceFactory('taxa/:taxon_key'),
      TaxonLevels: resourceFactory('taxon-level/'),
      TaxonGroups: resourceFactory('taxon-group/'),

      apiURL: SAU_CONFIG.apiURL
    };

    return methods;
  });

})();
