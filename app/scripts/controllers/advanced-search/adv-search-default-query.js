'use strict';

angular.module('sauWebApp').controller('AdvSearchDefaultQueryCtrl', function ($scope, sauAPI, regionDimensions, regionMeasures, regionDimensionLimits, advSearchService, createQueryUrl) {

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

    //Update the variables that configure the search query.
    var urlConfig = {
      regionType: $scope.section,
      measure: $scope.selectedMeasure.value,
      dimension: $scope.selectedDimension.value,
      limit: $scope.selectedLimit.value,
      useScientificName: $scope.useScientificName,
      regionIds: getSelectedRegionIds()
    };

    //Create the CSV URL.
    advSearchService.state.downloadDataUrl = createQueryUrl.forRegionCsv(urlConfig);

    //Create the chart URL.
    if ($scope.selectedRegions.length === 1) { //condition is TEMPORARY until we start supporing multi-region graph pages.
      advSearchService.state.graphPageUrl = createQueryUrl.forRegionCatchChart(urlConfig);
    }
  }

  //Make an array of all the region IDs from the user's selected list of regions.
  function getSelectedRegionIds() {
    var selectedRegionIds = [];
    for (var i = 0; i < $scope.selectedRegions.length; i++) {
      selectedRegionIds.push($scope.selectedRegions[i].id);
    }
    return selectedRegionIds;
  }

  //UI stuff that is specific to each advanced search section.
  //This object allows us to re-use this controller to make it generic for a few advanced search sections.
  $scope.sectionConfig = {
    eez: {
      regionType: 'eez',
      regionListTitle: 'EEZ regions',
      selectedListTitle: 'Selected EEZ regions',
      searchPlaceholder: 'Search EEZ regions',
      selectionLimit: 10
    },
    lme: {
      regionType: 'lme',
      regionListTitle: 'LME regions',
      selectedListTitle: 'Selected LME regions',
      searchPlaceholder: 'Search LME regions',
      selectionLimit: 10
    }
  };

  //These are mostly used to populate the UI components with UI data.
  $scope.selectedRegions = [];
  $scope.regionList = sauAPI.Regions.get({region: $scope.sectionConfig[$scope.section].regionType, nospatial: true})
  $scope.dimensions = regionDimensions[$scope.section];
  $scope.selectedDimension = $scope.dimensions[0];
  $scope.measures = regionMeasures[$scope.section];
  $scope.selectedMeasure = $scope.measures[0];
  $scope.limits = regionDimensionLimits[$scope.section];
  $scope.selectedLimit = $scope.limits[0];
  $scope.useScientificName = false;

  //Whenever the user changes which regions are selected, we notify that the query has changed.
  $scope.$watch('selectedRegions', $scope.queryChanged);
});