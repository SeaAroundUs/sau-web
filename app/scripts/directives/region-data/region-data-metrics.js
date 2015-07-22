'use strict';

angular.module('sauWebApp')
  .directive('regionDataMetrics', function(sauAPI, metricLinks) {
    return {
      link: function(scope) {
        var params = { region: scope.region.name, region_id: scope.region.id };
        sauAPI.Region.get(params, function(res) { scope.metrics = res.data.metrics; });
        scope.metricLinks = metricLinks;
      },
      replace: true,
      restrict: 'E',
      scope: { region: '=' },
      templateUrl: 'views/region-data/metrics.html'
    };
  });
