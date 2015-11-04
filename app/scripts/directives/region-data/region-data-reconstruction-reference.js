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
            scope.references = (res.data.eezs && !res.data.reconstruction_documents) ?
              res.data.eezs.reduce(function(recons, eez) {
                recons = recons.concat(eez.reconstruction_documents);
                return recons;
              }, []) :
              res.data.reconstruction_documents;

            if (!scope.references || scope.references.length === 0) {
              ele.remove();
            }
          });

        } else {
          ele.remove();
        }
      }
    }, //Reconstruction reference(s):
    replace: true,
    restrict: 'E',
    scope: {
      region: '='
    },
    template: '<div id="reconstruction-reference">' +
      '<h2 ng-pluralize count="references.length" ' +
        'when="{\'1\': \'Reconstruction reference\', \'other\': \'Reconstruction references\'}"></h2>' +
      '<span ng-repeat="ref in references | unique: \'name\'" class="reference">' +
        '<a ng-href="{{ ref.url }}"><i class="fa fa-file-pdf-o red"></i> {{ ref.name | breakUnderscores }}</a>' +
      '</span></div>'
  };
});
