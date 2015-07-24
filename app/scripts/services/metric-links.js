'use strict';

angular.module('sauWebApp').factory('metricLinks', function(externalURLs) {
  return {
    'EEZ area': externalURLs.areaDef + '#_Toc421807899',
    'LME area': externalURLs.areaDef + '#_Toc421807917',
    'Shelf Area': externalURLs.areaDef + '#_Toc421807905',
    'Inshore Fishing Area (IFA)': externalURLs.areaDef + '#_Toc421807906',
    'Coral Reefs': externalURLs.areaDef + '#_Toc421807907',
    'Seamounts': externalURLs.areaDef + '#_Toc421807908',
    'Primary production': externalURLs.areaDef + '#_Toc421807913'
  };
});
