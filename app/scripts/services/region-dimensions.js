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

    var defaultDimensions = [
      {label: 'Taxon', value: 'taxon', scientificNameOption: true},
      {label: 'Commercial groups', value: 'commercialgroup'},
      {label: 'Functional groups', value: 'functionalgroup'},
      {label: 'Fishing country', value: 'country'},
      // {label: 'Gear', value: 'gear'},
      {label: 'Fishing sector', value: 'sector'},
      {label: 'Catch type', value: 'catchtype', overrideLabel: 'Type'},
      {label: 'Reporting status', value: 'reporting-status'}
    ];

    var mariculture = [
      {label: 'Taxon', value: 'taxon'},
      {label: 'Commercial groups', value: 'commercialgroup'},
      {label: 'Functional groups', value: 'functionalgroup'}
    ];

    return {
      eez: defaultDimensions,
      lme: defaultDimensions,
      highseas: defaultDimensions,
      mariculture: mariculture,
      global: defaultDimensions
    };
  });
