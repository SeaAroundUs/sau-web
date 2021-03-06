'use strict';

angular.module('sauWebApp')
.controller('BiodiversityTab', function ($scope) {

  $scope.$watch('formModel.region_id', function() {

    $scope.feature.$promise.then(function() {

      var fishbase_id = null;

      if ($scope.region.name === 'eez') {
        fishbase_id = $scope.feature.data.fishbase_id;

        $scope.fishbaseLinks = [
          {label: 'Marine fishes', url: 'http://www.fishbase.org/Country/CountryChecklist.php?c_code='+fishbase_id+'&vhabitat='+'saltwater'+'&csub_code='},
          {label: 'Fresh water fishes', url: 'http://www.fishbase.org/Country/CountryChecklist.php?c_code='+fishbase_id+'&vhabitat='+'fresh'+'&csub_code='},
          {label: 'Pelagic fishes', url: 'http://www.fishbase.org/Country/CountryChecklist.php?c_code='+fishbase_id+'&vhabitat='+'pelagic'+'&csub_code='},
          {label: 'Reef fishes', url: 'http://www.fishbase.org/Country/CountryChecklist.php?c_code='+fishbase_id+'&vhabitat='+'reef'+'&csub_code='},
          {label: 'Deep water fishes', url: 'http://www.fishbase.org/Country/CountryChecklist.php?c_code='+fishbase_id+'&vhabitat='+'deepwater'+'&csub_code='},
          {label: 'Threatened fishes', url: 'http://www.fishbase.org/Country/CountryChecklist.php?c_code='+fishbase_id+'&vhabitat=threatened&csub_code='}
        ];

        $scope.sealifebaseLinks = [
          {label: 'Non-fish marine vertebrates', url: 'http://www.sealifebase.org/speciesgroup/index.php?group=nonfishvertebrates&c_code='+fishbase_id+'&action=list'},
          {label: 'Crustaceans', url: 'http://www.sealifebase.org/speciesgroup/index.php?group='+'crustaceans'+'&c_code='+fishbase_id+'&action=list'},
          {label: 'Mollusks', url: 'http://www.sealifebase.org/speciesgroup/index.php?group='+'mollusks'+'&c_code='+fishbase_id+'&action=list'},
          {label: 'Echinoderms', url: 'http://www.sealifebase.org/speciesgroup/index.php?group='+'echinoderms'+'&c_code='+fishbase_id+'&action=list'},
          {label: 'Coelenterates', url: 'http://www.sealifebase.org/speciesgroup/index.php?group='+'coelenterates'+'&c_code='+fishbase_id+'&action=list'},
          {label: 'Threatened non-fish organisms', url: 'http://www.sealifebase.org/Country/CountryChecklist.php?c_code='+fishbase_id+'&vhabitat=threatened&csub_code='}
        ];

      } else if ($scope.region.name === 'lme') {
        $scope.fishbaseLink = $scope.feature.data.fishbase_link;
        $scope.sealifebaseLink = $scope.feature.data.fishbase_link.replace('fishbase.org', 'sealifebase.org');
      } else if ($scope.region.name === 'meow') {
        $scope.fishbaseLink = $scope.feature.data.fishbase_link;
        $scope.sealifebaseLink = $scope.feature.data.fishbase_link.replace('fishbase.org', 'sealifebase.org');
      }
    });
  });
});
