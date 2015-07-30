'use strict';

angular.module('sauWebApp')
  .directive('regionDataMetrics', function(sauAPI, metricLinks) {
    return {
      link: function(scope, ele) {
        scope.$watch('region', updateScope);

        function updateScope() {
          if (scope.region.id) {
            var params = { region: scope.region.name, region_id: scope.region.id };
            sauAPI.Region.get(params, function(res) {
              // hide for no metrics
              if (!res.metrics || res.metrics.length === 0) {
                return ele.remove();
              }

              scope.metrics = res.data.metrics;
              scope.metricLinks = metricLinks;
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
