'use strict';

angular.module('sauWebApp')
  .directive('sauTaxonInfo', function ($filter, $location, taxonLevels) {

    //Formats the link to FishBase.de based on the taxon level.
    function getFishBaseUrl(taxon) {
      if (!!taxon) {
        switch (taxon.taxon_level_id) {
          case taxonLevels.taxonSpecies:
            //Begin MOD SORTIZ 11-21-17
            if (taxon.fb_spec_code) {
              var link = 'http://www.fishbase.org';
            }else {
              var link = 'http://www.sealifebase.org';
            }
            var genericName = $filter('splitIndex')(taxon.scientific_name, ' ', 0);
            var specificName = $filter('splitIndex')(taxon.scientific_name, ' ', 1);
            //return 'http://www.fishbase.org/Summary/SpeciesSummary.php?genusname=' + genericName +
            //  '&speciesname=' + specificName;
            return link + '/Summary/SpeciesSummary.php?genusname=' + genericName +
              '&speciesname=' + specificName;
            //END MOD SORTIZ 11-21-17
          case taxonLevels.taxonFamily:
            //Begin MOD SORTIZ 11-21-17
            if (taxon.slb_fam_code) {
              var link = 'http://www.sealifebase.org';
              var familyId = taxon.slb_fam_code;
            }else{
              var link = 'http://www.fishbase.org';
              var familyId = extractLastThreeDigits(taxon.fam_code);
              if (familyId === -1) { return null; }
            }
            //return 'http://www.fishbase.org/Summary/FamilySummary.php?ID=' + familyId.toString();
            return link + '/Summary/FamilySummary.php?ID=' + familyId.toString();
            //END MOD SORTIZ 11-21-17
          case taxonLevels.taxonOrder:
            //Begin MOD SORTIZ 11-21-17
            if (taxon.slb_ord_code) {
              var link = 'http://www.sealifebase.org';
            }else{
              var link = 'http://www.fishbase.org';
            }
            //return 'http://www.fishbase.org/Summary/OrdersSummary.php?order=' + taxon.scientific_name;
            return link + '/Summary/OrdersSummary.php?order=' + taxon.scientific_name;
          //END MOD SORTIZ 11-21-17
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
