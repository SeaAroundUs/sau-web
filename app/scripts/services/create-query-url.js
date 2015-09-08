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

    var newLayoutRegions = ['fishing-entity', 'rfmo', 'global', 'fao', 'eez-bordering', 'taxon'];

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
          config.regionType === 'taxon' ? 'taxa' : config.regionType,
          '/',
          config.measure,
          '/',
          config.dimension,
          '/?format=csv&limit=',
          config.limit,
          '&sciname=',
          config.useScientificName
        ];

        if (config.managed_species) {
          strBuilder.push('&managed_species=All');
        }

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
        var strBuilder;

        //Catch chart for one region.
        if (config.regionIds.length === 1) {
          strBuilder = [
            '/',
            config.regionType,
            '/',
            config.regionIds[0],
            '?chart=catch-chart',
          ];

        //Catch chart for multiple regions for new layouts
        } else if (newLayoutRegions.indexOf(config.regionType) !== -1) {
          strBuilder = [
            '/',
            config.regionType,
            '/',
            config.regionIds.join(','),
            '?chart=catch-chart'
          ];

        //Catch chart for multiple regions.
        } else {
          strBuilder = [
            '/result/?id=',
            config.regionIds.join(','),
            '&region=',
            config.regionType
          ];
        }

        //Shared URL params, whether single or multi region.
        if (config.dimension) {
          strBuilder = strBuilder.concat(['&dimension=', config.dimension]);
        }
        if (config.measure) {
          strBuilder = strBuilder.concat(['&measure=', config.measure]);
        }
        if (config.limit) {
          strBuilder = strBuilder.concat(['&limit=', config.limit]);
        }
        if (config.useScientificName) {
          strBuilder = strBuilder.concat(['&sciname=1']);
        }

        return strBuilder.join('');
      }
    };
  });
