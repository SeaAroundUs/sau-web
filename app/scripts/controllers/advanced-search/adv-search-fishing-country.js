'use strict';

angular.module('sauWebApp').controller('AdvSearchFishingCountryCtrl', function ($scope, sauAPI, advSearchService, createQueryUrl) {

  //Called by the UI components whenever the user changes a parameter of the query.
  $scope.queryChanged = function() {
    updateQueryUrls();
    updateSubmitButtons();
  };

  //Tells the parent controller what the state of the query buttons should be (via a service)
  function updateSubmitButtons() {
    advSearchService.state.isQueryGraphable = ($scope.selectedCountries && $scope.selectedCountries.length > 0);
    advSearchService.state.isQueryDownloadable = ($scope.selectedCountries && $scope.selectedCountries.length > 0);
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
    var urlConfig = {
      regionType: $scope.section,
      measure: $scope.selectedMeasure.value,
      dimension: $scope.selectedDimension.value,
      limit: $scope.selectedLimit.value,
      useScientificName: $scope.useScientificName,
      regionIds: getSelectedCountryIds()
    };

    //Create the CSV URL.
    advSearchService.state.downloadDataUrl = createQueryUrl.forRegionCsv(urlConfig);

    //Create the chart URL.
    advSearchService.state.graphPageUrl = createQueryUrl.forRegionCatchChart(urlConfig);
  }

  //These are mostly used to populate the UI components with UI data.
  $scope.selectedCountries = [];
  $scope.countryList = sauAPI.GeoList.get({ nospatial: true });
  $scope.selectionLimit = 10;

  $scope.$watch('selectedCountries', $scope.queryChanged);

  //Make an array of all the region IDs from the user's selected list of regions.
  function getSelectedCountryIds() {
    var selectedCountryIds = [];
    for (var i = 0; i < $scope.selectedCountries.length; i++) {
      selectedCountryIds.push($scope.selectedCountries[i].jurisdiction_id);
    }
    return selectedCountryIds;
  }
});
