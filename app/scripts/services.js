'use strict';

angular.module('sauWebApp')
  .service('sauService', function($resource, SAU_CONFIG) {
    var removePathId = function(path) {
      var to = path.lastIndexOf('/');
      to = to === -1 ? path.length : to + 1;
      return path.substring(0, to);
    };

    var Region = $resource(SAU_CONFIG.api_url + ':region/:region_id');

    return {
      removePathId: removePathId,
      Region: Region
    };
  });