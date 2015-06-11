'use strict';

angular.module('sauWebApp').controller('AdvSearchDefaultQueryCtrl', function ($scope, sauAPI, regionDimensions, regionMeasures, regionDimensionLimits, advSearchService, downloadDataUrl) {

  //Called by the UI components whenever the user changes a parameter of the query.
  $scope.queryChanged = function() {
    updateQueryUrls();
    updateSubmitButtons();
  };

  //Tells the parent controller what the state of the query buttons should be (via a service)
  function updateSubmitButtons() {
    advSearchService.state.isQueryGraphable = ($scope.selectedRegions && $scope.selectedRegions.length === 1);
    advSearchService.state.isQueryDownloadable = ($scope.selectedRegions && $scope.selectedRegions.length > 0);
  }

  //When the query buttons are pushed, they call these URLS, which are generated based on the query params.
  function updateQueryUrls() {

    if ($scope.selectedRegions.length === 1) { //condition is TEMPORARY until we start supporing multi-region graph pages.
      //Update the variables that configure the GRAPH search query.
      var strBuilder = [
        '/',
        $scope.searchOn,
        '/',
        $scope.selectedRegions[0].id,
        '?chart=catch-chart',
        '&dimension=',
        $scope.selectedDimension.value,
        '&measure=',
        $scope.selectedMeasure.value,
        '&limit=',
        $scope.selectedLimit.value
      ];
      advSearchService.state.graphDataUrl = strBuilder.join('');
    }

    //Update the variables that configure the CSV search query.
    var urlConfig = {
      regionType: $scope.searchOn,
      measure: $scope.selectedMeasure.value,
      dimension: $scope.selectedDimension.value,
      limit: $scope.selectedLimit.value,
      useScientificNames: $scope.useScientificName, //we should make this configurable in the UI
      regionIds: getSelectedRegionIds()
    };
    advSearchService.state.downloadDataUrl = downloadDataUrl.createRegionUrl(urlConfig);
  }

  //Make an array of all the region IDs from the user's selected list of regions.
  function getSelectedRegionIds() {
    var selectedRegionIds = [];
    for (var i = 0; i < $scope.selectedRegions.length; i++) {
      selectedRegionIds.push($scope.selectedRegions[i].id);
    }
    return selectedRegionIds;
  }

  //These are mostly used to populate the UI components with UI data.
  $scope.selectedRegions = [];
  $scope.regionList = sauAPI.Regions.get({region: $scope.searchOn, nospatial: true});
  $scope.dimensions = regionDimensions[$scope.searchOn];
  $scope.selectedDimension = $scope.dimensions[0];
  $scope.measures = regionMeasures[$scope.searchOn];
  $scope.selectedMeasure = $scope.measures[0];
  $scope.limits = regionDimensionLimits[$scope.searchOn];
  $scope.selectedLimit = $scope.limits[0];

  //UI stuff that is specific to each region type.
  //This object allows us to re-use this controller to make it generic for EEZ, LME, etc.
  $scope.regionTypeData = {
    eez: {
      regionListTitle: 'EEZ Regions',
      selectedListTitle: 'Selected EEZ regions',
      searchPlaceholder: 'Search EEZ regions'
    },
    lme: {
      regionListTitle: 'LME Regions',
      selectedListTitle: 'Selected LME regions',
      searchPlaceholder: 'Search LME regions'
    }
  };

  //Whenever the user changes which regions are selected, we notify that the query has changed.
  $scope.$watch('selectedRegions', $scope.queryChanged);
});