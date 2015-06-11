'use strict';

/**
 * @ngdoc service
 * @name sauWebApp.regionDimensions
 * @description
 * # regionDimensions
 * Service in the sauWebApp.
 */
angular.module('sauWebApp')
  .factory('regionMeasures', function () {

    var defaultMeasures = [
      {label: 'Tonnage', value: 'tonnage', chartlabel: 'Catch (t x 1000)', titleLabel: 'Catches by'},
      {label: 'Landed value', value: 'value', chartlabel: 'Real 2005 value (million US$)', titleLabel: 'Real 2005 value (US$) by'}
    ];

    return {
      eez: defaultMeasures,
      lme: defaultMeasures,
      highseas: defaultMeasures,
      mariculture: defaultMeasures,
      global: defaultMeasures,
      rfmo: defaultMeasures
    };
  });
