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
    //BEGIN MOD SORTIZ 11-28-17
    var gear = {
      label: 'Gear',
      value: 'gear',
      showDimensionLimit: false
    };
    //END MOD SORTIZ 11-28-17
    //BEGIN MOD SORTIZ 10-12-18
    var endUse = {
      label: 'End use',
      value: 'enduse',
      showDimensionLimit: false
    };
    //END MOD SORTIZ 10-12-18
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
      'label': 'ME',
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

    var sector = {
      'label': 'Sector',
      'value': 'sector',
      showDimensionLimit: false
    };

    var length_class = {
      'label': 'Boat length class',
      'value': 'length',
      showDimensionLimit: false
    };

    var fishinggear = {
      label: 'Fishing gear',
      value: 'gear',
      showDimensionLimit: false
    };

    //TODO this is getting cumbersome and deserves a refactor
    //BEGIN MOD SORTIZ 11-28-17
    //var eezDefaultDimensions = [taxon, commercialGroup, functionalGroup, fishingCountry, fishingSector, catchType, reportingStatus, layer];
    //var defaultDimensions = [taxon, commercialGroup, functionalGroup, fishingCountry, fishingSector, catchType, reportingStatus];
    //var expandedDefaults = [eez, highseas, taxon, commercialGroup, functionalGroup, fishingCountry, fishingSector, catchType, reportingStatus];
    //var eezBorderingDimensions = [eez, taxon, commercialGroup, functionalGroup, fishingCountry, fishingSector, catchType, reportingStatus];
    //var maricultureDimensions = [taxon, commercialGroup, functionalGroupMariculture];
    //var fishingEntityDimensions = [eez, highseas, taxon, commercialGroup, functionalGroup, fishingSector, catchType, reportingStatus];
    //var taxonDimension = [eez, lme, meow, highseas, fishingCountry, commercialGroup, functionalGroup, fishingSector, catchType, reportingStatus];

    //var eezDefaultDimensions = [taxon, commercialGroup, functionalGroup, fishingCountry, gear, fishingSector, catchType, reportingStatus, layer];
    //var defaultDimensions = [taxon, commercialGroup, functionalGroup, fishingCountry, gear, fishingSector, catchType, reportingStatus, layer];
    //var expandedDefaults = [eez, highseas, taxon, commercialGroup, functionalGroup, fishingCountry, gear, fishingSector, catchType, reportingStatus];
    //var eezBorderingDimensions = [eez, taxon, commercialGroup, functionalGroup, fishingCountry, gear, fishingSector, catchType, reportingStatus];
    //var maricultureDimensions = [taxon, gear, commercialGroup, functionalGroupMariculture];
    //var fishingEntityDimensions = [eez, highseas, taxon, commercialGroup, functionalGroup, gear, fishingSector, catchType, reportingStatus];
    //var taxonDimension = [eez, lme, meow, highseas, fishingCountry, commercialGroup, functionalGroup, gear, fishingSector, catchType, reportingStatus];
    //END MOD SORTIZ 11-28-17

    //BEGIN MOD SORTIZ 10-12-18
    var eezDefaultDimensions = [taxon, commercialGroup, functionalGroup, fishingCountry, gear, endUse, fishingSector, catchType, reportingStatus, layer];
    var defaultDimensions = [taxon, commercialGroup, functionalGroup, fishingCountry, gear, endUse, fishingSector, catchType, reportingStatus, layer];
    var expandedDefaults = [eez, highseas, taxon, commercialGroup, functionalGroup, fishingCountry, gear, endUse, fishingSector, catchType, reportingStatus];
    var eezBorderingDimensions = [eez, taxon, commercialGroup, functionalGroup, fishingCountry, gear, endUse, fishingSector, catchType, reportingStatus];
    var maricultureDimensions = [taxon, gear, endUse, commercialGroup, functionalGroupMariculture];
    var fishingEntityDimensions = [eez, highseas, taxon, commercialGroup, functionalGroup, gear, endUse, fishingSector, catchType, reportingStatus];
    var taxonDimension = [eez, lme, meow, highseas, fishingCountry, commercialGroup, functionalGroup, gear, endUse, fishingSector, catchType, reportingStatus];
    var fishingentityeffortDimension = [sector, fishinggear,length_class];
    //END MOD SORTIZ 10-12-18

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
      'fishing-entity-effort': fishingentityeffortDimension,
      'country-eezs': defaultDimensions,
      taxa: taxonDimension,
      fao: expandedDefaults,
      'eez-bordering': eezBorderingDimensions,
      multi: defaultDimensions
    };
  });
