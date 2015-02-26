'use strict';

angular.module('sauWebApp')
  .service('sauService', function($resource, SAU_CONFIG) {

    var Region = $resource(SAU_CONFIG.api_url + ':region/:region_id', {}, {get: {method: 'GET', cache: true}});

    var Regions = $resource(SAU_CONFIG.api_url + ':region/', {}, {get: {method: 'GET', cache: true}});

    var Data = $resource(SAU_CONFIG.api_url + ':region/:measure/:dimension/', {}, {get: {method: 'GET', cache: true}});

    var CSVData = $resource(SAU_CONFIG.api_url + ':region/:measure/:dimension/?format=csv');

    var MarineTrophicIndexData = $resource(SAU_CONFIG.api_url + ':region/marine-trophic-index/', {}, {get: {method: 'GET', cache: true}});

    var StockStatusData = $resource(SAU_CONFIG.api_url + ':region/stock-status/', {}, {get: {method: 'GET'}});

    var MultinationalFootprintData = $resource(SAU_CONFIG.api_url + ':region/multinational-footprint/', {}, {get: {method: 'GET', cache: true}});

    return {
      Region: Region,
      Regions: Regions,
      Data: Data,
      MarineTrophicIndexData: MarineTrophicIndexData,
      StockStatusData: StockStatusData,
      MultinationalFootprintData: MultinationalFootprintData,
      CSVData: CSVData,
      api_url: SAU_CONFIG.api_url
    };
  });