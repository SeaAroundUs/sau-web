'use strict';

angular.module('sauWebApp')
  .factory('regionDataCatchChartTitleGenerator', function($rootScope, faos) {
    return {
      clearTitle: function() {
        $rootScope.$broadcast('updateChartTitle', '');
      },

      updateTitle: function(data, formModel, region) {
        var faoName;
        var dimensionLabel = formModel.dimension.overrideLabel === undefined ?
          formModel.dimension.label :
          formModel.dimension.overrideLabel;
        var chartTitle = formModel.measure.titleLabel + ' ' + dimensionLabel + ' in the ';

        if (region.name === 'global') {
          chartTitle += 'Global Ocean';

        } else if (region.name === 'rfmo') {
          chartTitle += data.long_title + ' (' + data.title + ')';

        } else if (region.name === 'highseas') {
          chartTitle += 'non-EEZ waters of the ' + data.title;

        } else {
          chartTitle += 'waters of ' + data.title;
        }

        if (region.faoId && (faoName = faos.getFAOName(region.name, region.id, region.faoId))) {
          chartTitle += ' - ' + faoName;
        }

        $rootScope.$broadcast('updateChartTitle', chartTitle);
      },

      setTitle: function(newTitle) {
        $rootScope.$broadcast('updateChartTitle', newTitle);
      }
    };
  });
