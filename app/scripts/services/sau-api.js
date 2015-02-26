;(function() {

'use strict';

angular.module('sauWebApp')
  .factory('sauAPI', function ($resource, SAU_CONFIG) {

    var methods = {

      Region: $resource(SAU_CONFIG.api_url + ':region/:region_id', {}, {get: {method: 'GET', cache: true}}),
      Regions: $resource(SAU_CONFIG.api_url + ':region/', {}, {get: {method: 'GET', cache: true}}),
      Data: $resource(SAU_CONFIG.api_url + ':region/:measure/:dimension/', {}, {get: {method: 'GET', cache: true}}),
      CSVData: $resource(SAU_CONFIG.api_url + ':region/:measure/:dimension/?format=csv'),
      MarineTrophicIndexData: $resource(SAU_CONFIG.api_url + ':region/marine-trophic-index/', {}, {get: {method: 'GET', cache: true}}),
      StockStatusData: $resource(SAU_CONFIG.api_url + ':region/stock-status/', {}, {get: {method: 'GET'}}),
      MultinationalFootprintData: $resource(SAU_CONFIG.api_url + ':region/multinational-footprint/', {}, {get: {method: 'GET', cache: true}}),
      ExploitedOrganismsData: $resource(SAU_CONFIG.api_url + ':region/exploited-organisms/', {}, {get: {method: 'GET', cache: true}}),
      api_url: SAU_CONFIG.api_url
    };

    return methods;
  });

})();
