;(function() {
    'use strict';

  angular.module('sauWebApp')
    .directive('sauTaxonInfo', function ($filter, taxonLevels) {

      //Formats the link to FishBase.de based on the taxon level.
      function getFishBaseUrl(taxon) {
        if (!!taxon) {
          switch (taxon.taxon_level_id) {
            case taxonLevels.taxonSpecies:
              var genericName = $filter('splitIndex')(taxon.scientific_name, ' ', 0);
              var specificName = $filter('splitIndex')(taxon.scientific_name, ' ', 1);
              return 'http://www.fishbase.de/Summary/SpeciesSummary.cfm?genusname=' + genericName + '&SpeciesName=' + specificName;
            case taxonLevels.taxonFamily:
              var familyId = extractLastThreeDigits(taxon.taxon_key);
              if (familyId === -1) { return null; }
              return 'http://www.fishbase.de/Summary/FamilySummary.cfm?ID=' + familyId.toString();
            case taxonLevels.taxonOrder:
              return 'http://www.fishbase.de/Summary/OrdersSummary.cfm?order=' + taxon.scientific_name;
            default:
              return null;
          }
        }

        return null;
      }

      //Pulls out the three least significant digits of a number.
      //Only the three least significant digits appear to be used when generating the fishBase ID from the taxon_key.
      function extractLastThreeDigits(n) {
        var s = n.toString();
        return Number(s.substring(s.length - 3, s.length)) || -1;
      }

      return {
        templateUrl: 'views/taxon-info.html',
        restrict: 'E',
        scope: {
          taxon: '='
        },
        link: function(scope, element, attrs) {
          scope.$watch(attrs.taxon, function(value) { scope.fishBaseUrl = getFishBaseUrl(value); });
        }
      };
    });
})();