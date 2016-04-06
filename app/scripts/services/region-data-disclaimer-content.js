'use strict';

angular.module('sauWebApp')
  .factory('regionDataDisclaimerContent', function() {
    var masterDisclaimer = '<b>Note</b>: The data we present (\'reconstructed data\') combine official reported data ' +
      'and reconstructed estimates of unreported data (including major discards), with reference to individual EEZs. ' +
      'Official reported data are <a popover-html="National data are used for some countries.">mainly</a> extracted ' +
      'from the Food and Agriculture Organization of the United Nations (FAO) ' +
      '<a href="http://www.fao.org/fishery/statistics/en" target="_blank">FishStat database</a>. The ' +
      '"Reported catch" line overlaid on the catch graph represent all catches deemed reported (including foreign) ' +
      'and allocated to this spatial entity. <b>For background information on the reconstruction data, download ' +
      'the .pdf file for the specific EEZ(s) and also examine our ' +
      '<a href="/catch-reconstruction-and-allocation-methods/">methods</a> for data and spatial allocation.</b>';

    return {
      getDisclaimer: function() {
        return masterDisclaimer;
      }
    };
  });
