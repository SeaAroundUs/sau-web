;(function() {
    'use strict';

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
})();