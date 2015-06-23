'use strict';

angular.module('sauWebApp').factory('regionTabs', function() {

  var tabs = {
    catchInfo: {title: 'Catch Info', template:'views/region-detail/catch.html'},
    catchInfoMulti: {title: 'Catch Info', template:'views/region-detail/catch-multi.html'},
    biodiversity: {title: 'Biodiversity', template: 'views/region-detail/biodiversity.html'},
    biodiversityLME: {title: 'Biodiversity', template: 'views/region-detail/biodiversity-lme.html'},
    biodiversityGlobal: {title: 'Biodiversity', template: 'views/region-detail/biodiversity-global.html'},
    ecosystems: {title: 'Ecosystems', template: 'views/region-detail/ecosystems.html'},
    ecosystemsLME: {title: 'Ecosystems', template: 'views/region-detail/ecosystems-lme.html'},
    ecosystemsHighSeas: {title: 'Ecosystems', template: 'views/region-detail/ecosystems-highseas.html'},
    ecosystemsGlobal: {title: 'Ecosystems', template: 'views/region-detail/ecosystems-global.html'},
    governance: {title: 'Governance', template: 'views/region-detail/governance.html'},
    indicators: {title: 'Indicators', template: 'views/region-detail/indicators.html'},
    indicatorsLME: {title: 'Indicators', template: 'views/region-detail/indicators-lme.html'},
    indicatorsHighSeas: {title: 'Indicators', template: 'views/region-detail/indicators-highseas.html'},
    indicatorsGlobal: {title: 'Indicators', template: 'views/region-detail/indicators-global.html'},
    productionInfo: {title: 'Production Info', template: 'views/region-detail/production-info.html'},
    otherTopics: {title: 'Other Topics', template: 'views/region-detail/other-topics.html'},
    feedback: {title: 'Feedback', template: 'views/region-detail/feedback.html'}
  };

  return {
    getRegionTabs: function(regionName) {
      var regionTabs;

      switch(regionName) {
        case 'global':
          regionTabs = [
            tabs.catchInfo,
            tabs.biodiversityGlobal,
            tabs.ecosystemsGlobal,
            tabs.indicatorsGlobal,
            tabs.otherTopics
          ];
          break;

        case 'rfmo':
          regionTabs = [
            tabs.catchInfo,
            tabs.governance
          ];
          break;

        case 'lme':
          regionTabs = [
            tabs.catchInfo,
            tabs.biodiversityLME,
            tabs.ecosystemsLME,
            tabs.indicatorsLME
          ];
          break;

        case 'highseas':
          regionTabs = [
            tabs.catchInfo,
            tabs.ecosystemsHighSeas,
            tabs.indicatorsHighSeas
          ];
          break;

        case 'mariculture':
          regionTabs = [
            tabs.productionInfo
          ];
          break;

        case 'eez':
          regionTabs = [
            tabs.catchInfo,
            tabs.biodiversity,
            tabs.ecosystems,
            tabs.governance,
            tabs.indicators
          ];
          break;

        case 'multi':
          regionTabs = [
            tabs.catchInfoMulti
          ];
          break;

        default:
          regionTabs = [];
      }

      return regionTabs;
    }
  };
});
