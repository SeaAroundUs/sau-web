'use strict';

/**
 * @ngdoc service
 * @name sauWebApp.downloadDataUrl
 * @description
 * # downloadDataUrl
 * Call create() to obtain the URL to download a CSV file of SAU data.
 */
angular.module('sauWebApp')
  .factory('downloadDataUrl', function () {

    return {
      /*
      var exampleConfig = {
        regionType: 'eez',
        measure: 'value',
        dimension: 'taxon',
        limit: 10,
        useScientificName: true,
        faoId: 1,
        regionIds: [1, 2]
      };
      createRegionUrl(exampleConfig);
      */
      createRegionUrl: function(config) {
        var params = [
          config.regionType,
          '/',
          config.measure,
          '/',
          config.dimension,
          '/?format=csv&limit=',
          config.limit,
          '&sciname=',
          config.useScientificNames
        ];

        if (config.faoId) {
          params.push('&fao_id=', config.faoId);
        }

        for (var i = 0; i < config.regionIds.length; i++) {
          params.push('&region_id=' + config.regionIds[i]);
        }

        return params.join('');
      }
    };
  });
