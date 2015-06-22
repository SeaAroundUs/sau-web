'use strict';

angular.module('sauWebApp').controller('AdvSearchFishingCountryCtrl', function ($scope, sauAPI, regionDimensions, regionMeasures, regionDimensionLimits, advSearchService, createQueryUrl) {

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

    //Update the variables that configure the search query.
    var urlConfig = {};

    //Create the CSV URL.
    advSearchService.state.downloadDataUrl = "Download Data URL";

    //Create the chart URL.
    advSearchService.state.graphDataUrl = "Graph Page URL";
  }

  //These are mostly used to populate the UI components with UI data.
  $scope.selectedCountries = [];
  $scope.countryList = sauAPI.GeoList.get({ nospatial: true });
  $scope.dimensions = regionDimensions['fishingCountry'];
  $scope.selectedDimension = $scope.dimensions[0];
  $scope.measures = regionMeasures['fishingCountry'];
  $scope.selectedMeasure = $scope.measures[0];
  $scope.limits = regionDimensionLimits['fishingCountry'];
  $scope.selectedLimit = $scope.limits[0];
  $scope.useScientificName = false;
  $scope.selectionLimit = 10;

  $scope.$watch('selectedCountries', $scope.queryChanged);
});