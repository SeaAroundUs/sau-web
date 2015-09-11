'use strict';

angular.module('sauWebApp')
  .factory('regionDataDisclaimerContent', function() {
    var disclaimers = {};
    var baseDisclaimer = '<b>Note</b>: The data we present (\'reconstructed data\') combine official reported data and ' +
      'reconstructed estimates of unreported data (including major discards), with reference to ' +
      'individual EEZs. Official reported data are <a popover-html="National data are used for some countries.">' +
      'mainly</a> extracted from the Food and Agriculture Organization of the United Nations (FAO) ' +
      '<a href="http://www.fao.org/fishery/statistics/en" target="_blank">FishStat database</a>. ';

    disclaimers.eez = baseDisclaimer +
      '<b>For background information on reconstruction data, download the .pdf below.</b>';

    disclaimers.rfmo = baseDisclaimer +
      '<b>For background information on reconstruction data, download the .pdf from relevant ' +
      'EEZs and the RFMO evaluation report below.</b>';

    disclaimers.fao = baseDisclaimer +
      '<b>For background information on reconstruction data, download the .pdf associated ' +
      'with each relevant EEZ.</b>';
    disclaimers.taxa = disclaimers.fao;

    disclaimers.global = baseDisclaimer + '<b>For background information on reconstruction ' +
      'data, download the .pdf file for a specific EEZ.</b>';
    disclaimers.lme = disclaimers.global;
    disclaimers.highseas = disclaimers.global;
    disclaimers['fishing-entity'] = disclaimers.global;
    disclaimers['eez-bordering'] = disclaimers.global;

    return {
      getDisclaimer: function(region) {
        return disclaimers[region] || '';
      }
    };
  });
