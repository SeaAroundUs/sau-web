'use strict';

angular.module('sauWebApp')
  .directive('regionDataMetrics', function(sauAPI, metricLinks) {
    return {
      link: function(scope, ele) {
        scope.$watch('region', updateScope, true);

        function updateScope() {
          if (scope.region.id || scope.region.name == 'global') {
            var params = {
              region: scope.region.name,
              region_id: scope.region.name == 'global' ? 1 : scope.region.id,
              fao_id: scope.region.faoId
            };

            sauAPI.Region.get(params, function(res) {
              // hide for no metrics
              if (!res.data.metrics || res.data.metrics.length === 0) {
                return ele.remove();
              }

              scope.metrics = res.data.metrics;
              scope.metricLinks = metricLinks;

              if (scope.region.name === 'eez') {
                scope.declaration_year = res.data.declaration_year;
              }

              if (scope.region.name === 'highseas') {
                scope.metrics[0].title = 'High seas area';
              }
            });

          } else { //TODO something else for multiple ID?
            ele.remove();
          }
        }
      },
      replace: true,
      restrict: 'E',
      scope: { region: '=' },
      templateUrl: 'views/region-data/metrics.html'
    };
  });
