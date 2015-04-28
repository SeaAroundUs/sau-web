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
        regions: sauAPI.Regions.get({region: 'eez'}),
        dims: dims,
        selected: {}
      },
      {
        title: 'LME',
        active: false,
        longTitle: 'LME Landed Values*',
        regions: sauAPI.Regions.get({region: 'lme'}),
        dims: dims,
        selected: {}
      }
    ];

    $scope.country = {};

    sauAPI.GeoList.get({ nospatial: true }, function(resp) {
      $scope.countries = resp.data;
    });

    $scope.submitRegion = function(selection) {
      var region = selection.region.properties.region;
      var regionId = selection.region.properties.region_id;
      var dim = selection.dim === undefined ? dims[0].value : selection.dim.value;
      var url = '/' + region + '/' + regionId;
      var search = { chart: 'catch-chart', dimension: dim, measure: 'value' };
      $location.path(url).search(search);
    };

    $scope.submitCountry = function(country) {
      if (country.selected) {
        $location.path('/subsidy/' + country.selected.geo_entity_id);
      }
    };
  });
