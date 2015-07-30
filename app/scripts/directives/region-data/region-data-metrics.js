'use strict';

angular.module('sauWebApp')
  .directive('regionDataMetrics', function(sauAPI, metricLinks) {
    return {
      link: function(scope) {
        //TODO auto-hide for no metrics
        if (scope.region.id) {
          var params = { region: scope.region.name, region_id: scope.region.id };
          sauAPI.Region.get(params, function(res) { scope.metrics = res.data.metrics; });
          scope.metricLinks = metricLinks;
        } else {
          //TODO something else for multiple ID
        }
      },
      replace: true,
      restrict: 'E',
      scope: { region: '=' },
      templateUrl: 'views/region-data/metrics.html'
    };
  });
