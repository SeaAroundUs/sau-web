'use strict';

angular.module('sauWebApp')
  .directive('sauTaxonInfo', function ($filter, $location, taxonLevels) {

    //Formats the link to FishBase.de based on the taxon level.
    function getFishBaseUrl(taxon) {
      if (!!taxon) {
        switch (taxon.taxon_level_id) {
          case taxonLevels.taxonSpecies:
            var genericName = $filter('splitIndex')(taxon.scientific_name, ' ', 0);
            var specificName = $filter('splitIndex')(taxon.scientific_name, ' ', 1);
            return 'http://www.fishbase.org/Summary/SpeciesSummary.php?genusname=' + genericName +
              '&speciesname=' + specificName;
          case taxonLevels.taxonFamily:
            var familyId = extractLastThreeDigits(taxon.taxon_key);
            if (familyId === -1) { return null; }
            return 'http://www.fishbase.org/Summary/FamilySummary.php?ID=' + familyId.toString();
          case taxonLevels.taxonOrder:
            return 'http://www.fishbase.org/Summary/OrdersSummary.php?order=' + taxon.scientific_name;
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
      controller: function($scope) {
        // shows the habitat index chart and updates the url
        $scope.toggleHabitatIndex = function() {
          $scope.taxon.showHabitatIndex = !$scope.taxon.showHabitatIndex;
          $location.search('showHabitatIndex', $scope.taxon.showHabitatIndex ? 'true' : null);
        };

        $scope.$watch('taxon', function(newTaxon) {
          if (newTaxon && newTaxon.has_habitat_index && $location.search().showHabitatIndex === 'true') {
            newTaxon.showHabitatIndex = true;
          }
        });
      },
      link: function(scope, element, attrs) {
        scope.$watch(attrs.taxon, function(value) { scope.fishBaseUrl = getFishBaseUrl(value); });
      }
    };
  });
