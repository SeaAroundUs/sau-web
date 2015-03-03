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
      Data: resourceFactory(':region/:measure/:dimension/'),
      CSVData: resourceFactory(':region/:measure/:dimension/?format=csv'),
      MarineTrophicIndexData: resourceFactory(':region/marine-trophic-index/'),
      StockStatusData: resourceFactory(':region/stock-status/'),
      MultinationalFootprintData: resourceFactory(':region/multinational-footprint/'),
      ExploitedOrganismsData: resourceFactory(':region/exploited-organisms/'),
      Taxon: resourceFactory('taxa/:taxon_key'),
      TaxonLevels: resourceFactory('taxon-level/'),
      TaxonGroups: resourceFactory('taxon-group/'),

      apiURL: SAU_CONFIG.apiURL
    };

    return methods;
  });

})();
