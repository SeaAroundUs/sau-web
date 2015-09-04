'use strict';

angular.module('sauWebApp')
  .directive('regionDataShortTitle', function(sauAPI) {
    return {
      link: function(scope, ele) {
        scope.$watch('region', updateScope, true);

        function updateScope() {
          if (scope.region.id) {
            var params = {
              region: scope.region.name,
              region_id: scope.region.id,
            };

            sauAPI.Region.get(params, function(res) {
              scope.title = res.data.title;
            });
          } else {
            ele.remove();
          }
        }
      },
      replace: true,
      restrict: 'E',
      scope: { region: '=' },
      template: '<h1 ng-bind="title"></h1>'
    };
  });
