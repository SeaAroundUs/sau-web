'use strict';

angular.module('sauWebApp')
  .directive('regionDataLegend', function(insetMapLegendData, regionToggles) {
    return {
      link: function(scope, ele) {
        if (!scope.region.id) {
          return ele.hide();
        }

        scope.legendKeys = insetMapLegendData[scope.region.name];
        scope.toggles = regionToggles;

        //TODO
        scope.selectFAO = function(fao) {
          console.log(fao + ' FAO selected');
        }
      },
      replace: true,
      restrict: 'E',
      scope: { region: '=' },
      templateUrl: 'views/region-data/legend.html'
    };
  });
