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

    var functionalGroupMariculture = {
      label: 'Functional groups',
      value: 'functionalgroup',
      showDimensionLimit: false
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

    var eez = {
      'label': 'EEZ',
      'value': 'eez',
      showDimensionLimit: true
    };

    var lme = {
      'label': 'LME',
      'value': 'lme',
      showDimensionLimit: true
    };

    var meow = {
      'label': 'MEOW',
      'value': 'meow',
      showDimensionLimit: true
    };

    var highseas = {
      'label': 'High Seas',
      'value': 'highseas',
      showDimensionLimit: false
    };

    var layer = {
      'label': 'Data layer',
      'value': 'layer',
      showDimensionLimit: false
    };
    //TODO this is getting cumbersome and deserves a refactor
    var eezDefaultDimensions = [taxon, commercialGroup, functionalGroup, fishingCountry, fishingSector, catchType, reportingStatus, layer];
    var defaultDimensions = [taxon, commercialGroup, functionalGroup, fishingCountry, fishingSector, catchType, reportingStatus];
    var expandedDefaults = [eez, highseas, taxon, commercialGroup, functionalGroup, fishingCountry, fishingSector, catchType, reportingStatus];
    var eezBorderingDimensions = [eez, taxon, commercialGroup, functionalGroup, fishingCountry, fishingSector, catchType, reportingStatus];
    var maricultureDimensions = [taxon, commercialGroup, functionalGroupMariculture];
    var fishingEntityDimensions = [eez, highseas, taxon, commercialGroup, functionalGroup, fishingSector, catchType, reportingStatus];
    var taxonDimension = [eez, lme, highseas, fishingCountry, commercialGroup, functionalGroup, fishingSector, catchType, reportingStatus];

    return {
      eez: eezDefaultDimensions,
      lme: defaultDimensions,
      meow: defaultDimensions,
      highseas: defaultDimensions,
      mariculture: maricultureDimensions,
      global: defaultDimensions,
      rfmo: defaultDimensions,
      fishingCountry: defaultDimensions,
      'fishing-entity': fishingEntityDimensions,
      'country-eezs': defaultDimensions,
      taxa: taxonDimension,
      fao: expandedDefaults,
      'eez-bordering': eezBorderingDimensions,
      multi: defaultDimensions
    };
  });
