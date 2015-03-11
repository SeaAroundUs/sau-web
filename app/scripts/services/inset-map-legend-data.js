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
      { pattern: 'images/legend/fao.png', label: 'FAO area' },
      { pattern: 'images/legend/high_seas.png', label: 'High seas' },
      { pattern: 'images/legend/ifa.png', label: 'IFA boundary' }
    ];
    
  	var lme = [
      { pattern: 'images/legend/lme.png', label: 'LME' },
      { pattern: 'images/legend/disputed_lme.png', label: 'Disputed' },
      { pattern: 'images/legend/other_lme.png', label: 'Other LME' },
      { pattern: 'images/legend/fao.png', label: 'FAO area' },
      { pattern: 'images/legend/high_seas.png', label: 'High seas' },
      { pattern: 'images/legend/ifa.png', label: 'IFA boundary' }
    ];

    var highseas = [
      { pattern: 'images/legend/eez.png', label: 'High seas' },
      { pattern: 'images/legend/other_eez.png', label: 'Other high seas' },
      { pattern: 'images/legend/fao.png', label: 'FAO area' },
      { pattern: 'images/legend/high_seas.png', label: 'EEZ' }
    ];

    return {
      eez: eez,
      lme: lme,
      highseas: highseas,
      global: null,
      rfmo: null
    };
});
