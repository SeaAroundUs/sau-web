;(function() {

  'use strict';

  angular.module('sauWebApp')
  .controller('TopicBiodiversityCtrl', function ($scope, $location, sauAPI, toggles) {

    $scope.regionId = null;
    $scope.regionName = 'eez';

    $scope.regions = [
      {title: 'EEZ', value: 'eez'},
      {title: 'LME', value: 'lme'},
      {title: 'MEOW', value: 'meow'},
      {title: 'RFMO', value: 'rfmo'}
    ];

    if (toggles.isEnabled('fao')) {
      $scope.regions.push({title: 'FAO Area', value: 'fao'});
    }

    if (toggles.isEnabled('highseas')) {
      $scope.regions.push({title: 'High seas', value: 'highseas'});
    }

    if (toggles.isEnabled('global')) {
      $scope.regions.push({title: 'Global', value: 'global'});
    }

    $scope.selectedRegion = $scope.regions[0];

    $scope.$watch('selectedRegion', function() {

      $scope.regionName = $scope.selectedRegion.value;

      //There are no regions within the global ocean.
      //So don't bother trying to make a request for any.
      if ($scope.regionName === 'global') {
        //For global ocean, we directly set the regionID to 1, because there are no regions.
        $scope.selectedSubregion = null;
        $scope.regionId = 1;
        return;
      }

      var data = sauAPI.Regions.get({region: $scope.selectedRegion.value, nospatial: true}, function() {
        $scope.subregions = data.data;
        if ($scope.regionName === 'rfmo') {
          data.data = data.data.map(function(datum) {
            datum.title = datum.long_title + ' (' + datum.title + ')';
            return datum;
          });
        }
        $scope.subregions.unshift({title: '-- All regions --', id: 0});
        $scope.selectedSubregion = data.data[0];
      });

    });

    $scope.$watch('selectedSubregion', function() {
      if ($scope.selectedSubregion) {
        $scope.regionId = $scope.selectedSubregion.id;
      }
    });

  });

})();
