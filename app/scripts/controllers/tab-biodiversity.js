'use strict';

angular.module('sauWebApp')
.controller('BiodiversityTab', function ($scope) {

  $scope.$watch('formModel.region_id', function() {

    $scope.feature.$promise.then(function() {

      var fishbase_id = null;

      if ($scope.region.name === 'eez') {
        fishbase_id = $scope.feature.data.fishbase_id;

        var padToThree = function(d){
          // given an integer in the range 0-999, returns a 0-padded string representation
          return ('100' + d).slice(-3);
        };

        $scope.fishbaseLinks = {
          fish: [
            {label: 'Reef fishes', url: 'http://www.fishbase.org/Country/CountryChecklist.php?c_code='+padToThree(fishbase_id)+'&vhabitat='+'reef'+'&csub_code='},
            {label: 'Fresh water fishes', url: 'http://www.fishbase.org/Country/CountryChecklist.php?c_code='+padToThree(fishbase_id)+'&vhabitat='+'fresh'+'&csub_code='},
            {label: 'Marine fishes', url: 'http://www.fishbase.org/Country/CountryChecklist.php?c_code='+padToThree(fishbase_id)+'&vhabitat='+'saltwater'+'&csub_code='},
            {label: 'Pelagic fishes', url: 'http://www.fishbase.org/Country/CountryChecklist.php?c_code='+padToThree(fishbase_id)+'&vhabitat='+'pelagic'+'&csub_code='},
            {label: 'Deep water fishes', url: 'http://www.fishbase.org/Country/CountryChecklist.php?c_code='+padToThree(fishbase_id)+'&vhabitat='+'deepwater'+'&csub_code='},
            {label: 'Non-fish vertebrates', url: 'http://www.sealifebase.org/speciesgroup/index.php?group=nonfishvertebrates&c_code='+fishbase_id+'&action=list'},
          ],

          threatened: [
            {label: 'Fish', url: 'http://www.fishbase.org/Country/CountryChecklist.php?c_code='+padToThree(fishbase_id)+'&vhabitat=threatened&csub_code='},
            {label: 'Non-fish', url: 'http://www.sealifebase.org/Country/CountryChecklist.php?c_code='+fishbase_id+'&vhabitat=threatened&csub_code='},
          ],

          invertebrates: [
            {label: 'Crustaceans', url: 'http://www.sealifebase.org/speciesgroup/index.php?group='+'crustaceans'+'&c_code='+fishbase_id+'&action=list'},
            {label: 'Mollusks', url: 'http://www.sealifebase.org/speciesgroup/index.php?group='+'mollusks'+'&c_code='+fishbase_id+'&action=list'},
            {label: 'Echinoderms', url: 'http://www.sealifebase.org/speciesgroup/index.php?group='+'echinoderms'+'&c_code='+fishbase_id+'&action=list'},
            {label: 'Coelenterates', url: 'http://www.sealifebase.org/speciesgroup/index.php?group='+'coelenterates'+'&c_code='+fishbase_id+'&action=list'}
          ]
        };
      } else if ($scope.region.name === 'lme') {

        var sealifebaseLink = $scope.feature.data.fishbase_link.replace('fishbase.org', 'sealifebase.org');

        $scope.fishbaseLinks = {
          fish: [
            {label: 'Reef fishes', url: $scope.feature.data.fishbase_link},
            {label: 'Fresh water fishes', url: $scope.feature.data.fishbase_link},
            {label: 'Marine fishes', url: $scope.feature.data.fishbase_link},
            {label: 'Pelagic fishes', url: $scope.feature.data.fishbase_link},
            {label: 'Deep water fishes', url: $scope.feature.data.fishbase_link},
            {label: 'Non-fish vertebrates', url: $scope.feature.data.fishbase_link},
          ],

          threatened: [
            {label: 'Fish', url: $scope.feature.data.fishbase_link},
            {label: 'Non-fish', url: sealifebaseLink},
          ],

          invertebrates: [
            {label: 'Crustaceans', url: sealifebaseLink},
            {label: 'Mollusks', url: sealifebaseLink},
            {label: 'Echinoderms', url: sealifebaseLink},
            {label: 'Coelenterates', url: sealifebaseLink}
          ]
        };
      }
    });
  });
});