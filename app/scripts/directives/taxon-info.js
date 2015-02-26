/**
 * @ngdoc directive
 * @name sauWebApp.directive:taxonInfo
 * @description
 * Renders tabular "key info" on an individual taxon (e.g. Salmon).
 * 
 */
angular.module('sauWebApp')
  .directive('sauTaxonInfo', function () {
    return {
      templateUrl: 'views/taxon-info.html',
      restrict: 'E',
      scope: {
      	taxon: '='
      }
    };
  });
