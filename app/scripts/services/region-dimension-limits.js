'use strict';

/**
 * @ngdoc service
 * @name sauWebApp.regionDimensions
 * @description
 * # regionDimensions
 * Service in the sauWebApp.
 */
angular.module('sauWebApp')
  .factory('regionDimensionLimits', function () {

    var defaultLimits = [
      {label: '5', value: '5'},
      {label: '10', value: '10'},
      {label: '15', value: '15'},
      {label: '20', value: '20'}
    ];

    return {
      eez: defaultLimits,
      lme: defaultLimits,
      meow: defaultLimits,
      highseas: defaultLimits,
      mariculture: defaultLimits,
      freshwater: defaultLimits,
      global: defaultLimits,
      rfmo: defaultLimits,
      fishingCountry: defaultLimits,
      'fishing-entity': defaultLimits,
      'fishing-entity-effort': defaultLimits,
      'country-eezs': defaultLimits,
      taxa: defaultLimits,
      fao: defaultLimits,
      'eez-bordering': defaultLimits,
      multi: defaultLimits
    };
  });
