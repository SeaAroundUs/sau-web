'use strict';

angular.module('sauWebApp').directive('regionDataReconstructionReference', function(sauAPI) {
  return {
    link: function(scope, ele) {
      scope.$watch('region', updateScope, true);

      function updateScope() {
        if (scope.region.id) {
          var params = {
            region: scope.region.name,
            region_id: scope.region.id
          };

          sauAPI.Region.get(params, function(res) {
            scope.references = res.data.reconstruction_documents;
            if (scope.references.length === 0) {
              ele.remove();
            }
          });

        } else {
          ele.remove();
        }
      }
    },
    replace: true,
    restrict: 'E',
    scope: {
      region: '='
    },
    template: '<div id="reconstruction-reference">' +
      '<h3>Reconstruction reference(s):</h3>' +
      '<span ng-repeat="ref in references" class="reference">' +
        '<a ng-href="{{ ref.url }}"><i class="fa fa-file-pdf-o red"></i> {{ ref.name | breakUnderscores }}</a>' +
      '</span></div>'
  };
});
