'use strict';

/**
 * @ngdoc service
 * @name sauWebApp.insetMapLegendData
 * @description
 * # insetMapLegendData
 * Data that defines the keys for the legend in each region-type
 */
angular.module('sauWebApp')
  .factory('insetMapLegendData', function() {
    var eez = [
      { pattern: 'images/legend/eez.png', label: 'EEZ' },
      { pattern: 'images/legend/disputed_eez.png', label: 'Disputed/shared' },
      { pattern: 'images/legend/other_eez.png', label: 'Other EEZ' },
      { pattern: 'images/legend/fao.png', label: 'FAO boundary' },
      { pattern: 'images/legend/high_seas.png', label: 'High seas' },
      { pattern: 'images/legend/ifa.png', label: 'IFA area' }
    ];

    var lme = [
      { pattern: 'images/legend/lme.png', label: 'LME' },
      { pattern: 'images/legend/other_lme.png', label: 'Other LME' },
      { pattern: 'images/legend/high_seas.png', label: 'Non-LME waters' }
    ];

    var meow = [
      { pattern: 'images/legend/Meow.png', label: 'ME' },
      { pattern: 'images/legend/other_meow.png', label: 'Other ME' },
      { pattern: 'images/legend/high_seas.png', label: 'Non-ME waters' }
    ];

    var highseas = [
      { pattern: 'images/legend/eez.png', label: 'High seas' },
      { pattern: 'images/legend/other_eez.png', label: 'Other high seas' },
      { pattern: 'images/legend/ocean.png', label: 'EEZs' }
    ];

    var mariculture = [
      {value: 99, label: '1-99'},
      {value: 999, label: '100-999'},
      {value: 9999, label: '1,000-9,999'},
      {value: 999999, label: '10,000-999,999'},
      {value: 9999999, label: '1,000,000-9,999,999'},
      {value: 12999999, label: '10,000,000-12,999,999'}
    ];

    var fao = [
      {pattern: 'images/legend/this_fao.png', label: 'FAO area'},
      {pattern: 'images/legend/other_fao.png', label: 'Other FAOs'}
    ];

    return {
      eez: eez,
      lme: lme,
      meow: meow,
      highseas: highseas,
      global: null,
      rfmo: null,
      mariculture: mariculture,
      'fishing-entity': null,
      fao: fao
    };
  });
