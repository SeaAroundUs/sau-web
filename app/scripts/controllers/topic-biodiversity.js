;(function() {

  'use strict';

  angular.module('sauWebApp')
  .controller('TopicBiodiversityCtrl', function ($scope, $location, sauAPI) {

    $scope.regionId = null;
    $scope.regionName = 'eez';

    $scope.regions = [
      {title: 'EEZ', value: 'eez'},
      {title: 'LME', value: 'lme'}
    ];

    $scope.selectedRegion = $scope.regions[0];

    $scope.$watch('selectedRegion', function() {

      $scope.regionName = $scope.selectedRegion.value;

      var data = sauAPI.Regions.get({region: $scope.selectedRegion.value, nospatial: true}, function() {
        $scope.subregions = data.data;
        $scope.subregions.unshift({title: '-- All regions --', id: 0});
        $scope.selectedSubregion = data.data[0];
      });

    });

    $scope.$watch('selectedSubregion', function() {
      if ($scope.selectedSubregion) {
        $scope.regionId = $scope.selectedSubregion.id;
      }
    });

    $scope.changeRoute = function() {
      var newPath;

      if ($scope.regionId === 0) {
        return;
      }

      newPath = '/' + $scope.regionName + '/' + $scope.regionId;
      $location.path(newPath);
    };

  });

})();
