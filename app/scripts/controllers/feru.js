'use strict';

angular.module('sauWebApp')
  .controller('FERUCtrl', function($scope, $location, sauAPI) {
    var dims = [
      {label: 'Taxon', value: 'taxon'},
      {label: 'Commercial Groups', value: 'commercialgroup'},
      {label: 'Functional Groups', value: 'functionalgroup'},
      {label: 'Fishing Country', value: 'country'},
      // {label: 'Gear', value: 'gear'},
      {label: 'Fishing Sector', value: 'sector'},
      {label: 'Catch Type', value: 'catchtype', overrideLabel: 'Type'},
      {label: 'Reporting Status', value: 'reporting-status'}
    ];

    $scope.tabs = [
      {
        title: 'EEZ',
        active: true,
        longTitle: 'EEZ Landed Values*',
        shortText: 'lorem ipsum EEZ',
        regions: sauAPI.Regions.get({region: 'eez'}),
        dims: dims,
        selected: {}
      },
      {
        title: 'LME',
        active: false,
        longTitle: 'LME Landed Values*',
        shortText: 'lorem ipsum LME',
        regions: sauAPI.Regions.get({region: 'lme'}),
        dims: dims,
        selected: {}
      }
    ];

    $scope.selectedCountry = null;

    $scope.countries = [
      {label: 'Foo', value: 1},
      {label: 'Bar', value: 2},
      {label: 'Baz', value: 3}
    ];

    $scope.submitRegion = function(selection) {
      var region = selection.region.properties.region;
      var regionId = selection.region.properties.region_id;
      var dim = selection.dim === undefined ? dims[0].value : selection.dim.value;
      var url = '/' + region + '/' + regionId + '/' + dim;
      $location.path(url);
    };

    $scope.submitCountry = function() {
      console.log($scope.selectedCountry);
    };
  });
