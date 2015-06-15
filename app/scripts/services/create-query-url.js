'use strict';

/**
 * @ngdoc service
 * @name sauWebApp.createQueryUrl
 * @description
 * # createQueryUrl
 * Call create() to obtain the URL to download a CSV file of SAU data.
 */
angular.module('sauWebApp')
  .factory('createQueryUrl', function () {

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
      forRegionCSV(exampleConfig);
      */
      forRegionCsv: function(config) {
        var strBuilder = [
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
          strBuilder.push('&fao_id=', config.faoId);
        }

        for (var i = 0; i < config.regionIds.length; i++) {
          strBuilder.push('&region_id=' + config.regionIds[i]);
        }

        return strBuilder.join('');
      },

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
      forRegionCatchChart(exampleConfig);
      */
      forRegionCatchChart: function(config) {
        var strBuilder = [
          '/',
          config.regionType,
          '/',
          config.regionIds[0],
          '?chart=catch-chart',
          '&dimension=',
          config.dimension,
          '&measure=',
          config.measure,
          '&limit=',
          config.limit
        ];
        return strBuilder.join('');
      }
    };
  });
