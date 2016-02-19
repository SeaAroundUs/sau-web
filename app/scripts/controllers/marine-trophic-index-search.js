(function(angular) {
  'use strict';
  angular.module('sauWebApp').controller('MarineTrophicIndexSearchCtrl',
    function($scope, $location, sauAPI) {
      $scope.tabs = [
        {
          title: 'EEZ',
          text: 'Select Exclusive Economic Zone (EEZ)',
          regions: sauAPI.Regions.get({region: 'eez'}),
          active: true
        },
        {
          title: 'LME',
          text: 'Select Large Marine Ecosystem (LME)',
          regions: sauAPI.Regions.get({region: 'lme'})
        },
        {
          title: 'RFMO',
          text: 'Select Regional Fisheries Management Organization (RFMO)',
          regions: sauAPI.Regions.get({region: 'rfmo'})
        }
      ];

      $scope.submitRegion = function(selection) {
        var region = selection.region.properties.region;
        var regionId = selection.region.properties.region_id;
        var url = '/' + region + '/' + regionId + '/marine-trophic-index';
        $location.path(url);
      };
    });
})(angular);
