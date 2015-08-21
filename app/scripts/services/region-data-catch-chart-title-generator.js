'use strict';

angular.module('sauWebApp')
  .factory('regionDataCatchChartTitleGenerator', function($rootScope, $q, faos, sauAPI) {
    return {
      clearTitle: function() {
        $rootScope.$broadcast('updateChartTitle', '');
      },

      updateTitle: function(formModel, region) {
        var faoName, promiseData;
        var dimensionLabel = formModel.dimension.overrideLabel === undefined ?
          formModel.dimension.label :
          formModel.dimension.overrideLabel;
        var chartTitle = formModel.measure.titleLabel + ' ' + dimensionLabel + ' in the ';
        var regionData = region.id ?
          sauAPI.Region.get({ region: region.name, region_id: region.id }).$promise :
          $q.defer();

        if (!region.id) {
          if (region.name === 'fishing-entity') {
            promiseData = { data: { title: 'selected fishing countries' }};

          } else if (region.name === 'rfmo') {
            promiseData = { data: { title: 'selected RFMOs' }};

          } else {
            promiseData = { data: { title: 'selected regions' }};
          }

          regionData.resolve(promiseData);
          regionData = regionData.promise;
        }

        regionData.then(function(data) {
          data = data.data;

          if (region.name === 'global') {
            chartTitle += 'Global Ocean';

          } else if (region.name === 'rfmo') {
            chartTitle += data.long_title ? data.long_title + ' (' + data.title + ')' : ' ' + data.title;

          } else if (region.name === 'highseas') {
            chartTitle += 'non-EEZ waters of the ' + data.title;

          } else if (region.name === 'fishing-entity') {
            chartTitle = chartTitle.replace(' in the ', '') + ' by the fleets of ' + data.title;

          } else if (region.name === 'country-eezs') {
            chartTitle = chartTitle.replace(' in the ', ' in all the EEZ waters of ') + data.title;

          } else {
            chartTitle += 'waters of ' + data.title;
          }

          if (region.faoId && (faoName = faos.getFAOName(region.name, region.id, region.faoId))) {
            chartTitle += ' - ' + faoName;
          }

          $rootScope.$broadcast('updateChartTitle', chartTitle);
        });
      },

      setTitle: function(newTitle) {
        $rootScope.$broadcast('updateChartTitle', newTitle);
      }
    };
  });
