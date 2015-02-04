'use strict';

angular.module('sauWebApp')
  .service('sauService', function($resource, SAU_CONFIG) {
    var removePathId = function(path) {
      var to = path.lastIndexOf('/');
      to = to === -1 ? path.length : to + 1;
      return path.substring(0, to);
    };

    var Region = $resource(SAU_CONFIG.api_url + ':region/:region_id');

    var Data = $resource(SAU_CONFIG.api_url + ':region/:measure/:dimension/', {}, {get: {method: 'GET', cache: true}});

    var CSVData = $resource(SAU_CONFIG.api_url + ':region/:measure/:dimension/?format=csv');

    return {
      removePathId: removePathId,
      Region: Region,
      Data: Data,
      CSVData: CSVData
    };
  });