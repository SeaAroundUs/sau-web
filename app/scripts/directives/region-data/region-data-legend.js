'use strict';

angular.module('sauWebApp')
  .directive('regionDataLegend', function(insetMapLegendData, regionToggles) {
    return {
      link: function(scope, ele) {
        if (!scope.region.id) {
          return ele.hide();
        }

        scope.$watch('region', function() {
          scope.legendKeys = insetMapLegendData[scope.region.name];
          scope.toggles = regionToggles.getToggles(scope.region.name);
        });

        scope.selectFAO = function(faoId) {
          scope.region.faoId = faoId;
        }
      },
      restrict: 'E',
      scope: { region: '=', faos: '=' },
      templateUrl: 'views/region-data/legend.html'
    };
  });
