'use strict';

/**
 * @ngdoc service
 * @name sauWebApp.regionDimensions
 * @description
 * # regionDimensions
 * Service in the sauWebApp.
 */
angular.module('sauWebApp')
  .factory('regionDimensions', function () {

    var taxon = {
      label: 'Taxon',
      value: 'taxon',
      scientificNameOption: true,
      showDimensionLimit: true
    };

    var commercialGroup = {
      label: 'Commercial groups',
      value: 'commercialgroup',
      showDimensionLimit: false
    };

    var functionalGroup = {
      label: 'Functional groups',
      value: 'functionalgroup',
      showDimensionLimit: true
    };

    var fishingCountry = {
      label: 'Fishing country',
      value: 'country',
      showDimensionLimit: true
    };

    var fishingSector = {
      label: 'Fishing sector',
      value: 'sector',
      showDimensionLimit: false
    };

    var catchType = {
      label: 'Catch type',
      value: 'catchtype',
      overrideLabel: 'Type',
      showDimensionLimit: false
    };

    var reportingStatus = {
      label: 'Reporting status',
      value: 'reporting-status',
      showDimensionLimit: false
    };

    var defaultDimensions = [taxon, commercialGroup, functionalGroup, fishingCountry, fishingSector, catchType, reportingStatus];
    var maricultureDimensions = [taxon, commercialGroup, functionalGroup];
    var fishingEntityDimensions = [taxon, commercialGroup, functionalGroup, fishingSector, catchType, reportingStatus];

    return {
      eez: defaultDimensions,
      lme: defaultDimensions,
      highseas: defaultDimensions,
      mariculture: maricultureDimensions,
      global: defaultDimensions,
      rfmo: defaultDimensions,
      fishingCountry: defaultDimensions,
      'fishing-entity': fishingEntityDimensions,
      'country-eezs': defaultDimensions,
      multi: defaultDimensions
    };
  });
