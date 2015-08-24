'use strict';

angular.module('sauWebApp').controller('AdvSearchCountryCtrl', function ($scope, sauAPI, advSearchService, createQueryUrl) {

  //Called by the UI components whenever the user changes a parameter of the query.
  $scope.queryChanged = function() {
    updateQueryUrls();
    updateSubmitButtons();
  };

  //Tells the parent controller what the state of the query buttons should be (via a service)
  function updateSubmitButtons() {
    advSearchService.state.isQueryGraphable = false;
    advSearchService.state.isQueryDownloadable = false;
  }

  //When the query buttons are pushed, they call these URLS, which are generated based on the query params.
  function updateQueryUrls() {

    if (!$scope.selectedDimension ||
        !$scope.selectedMeasure ||
        !$scope.selectedLimit ||
        $scope.selectedCountries.length === 0) {
      return;
    }

    //Update the variables that configure the search query.
    var urlConfig = {};

    //Create the CSV URL.
    advSearchService.state.downloadDataUrl = "Download Data URL";

    //Create the chart URL.
    advSearchService.state.graphDataUrl = "Graph Page URL";
  }

  function requestEezsInCountry() {
    if ($scope.selectedCountries.length != 1) {
      $scope.eezsInCountry = null;
    } else {
      console.log('Request EEZs of ' + $scope.selectedCountries[0].name + '.');
      $scope.eezsInCountry = sauAPI.Regions.get({region: 'country-eezs', region_id: $scope.selectedCountries[0].id, nospatial: true});
    }
  }

  //These are mostly used to populate the UI components with UI data.
  $scope.selectedCountries = [];
  $scope.countryList = sauAPI.GeoList.get({ nospatial: true });

  $scope.$watch('selectedCountries', $scope.queryChanged);
  $scope.$watch('selectedDimension', $scope.queryChanged);
  $scope.$watch('useScientificName', $scope.queryChanged);
  $scope.$watch('selectedMeasure', $scope.queryChanged);
  $scope.$watch('selectedLimit', $scope.queryChanged);

  $scope.$watch('selectedCountries', requestEezsInCountry);
});
