'use strict';

angular.module('sauWebApp').controller('AdvSearchEEZCtrl', function ($scope, sauAPI, regionDimensions, regionMeasures, regionDimensionLimits, advSearchQueryState, downloadDataUrl) {

  $scope.queryChanged = function() {
    updateQueryUrls();
    updateSubmitButtons();
  }

  function updateSubmitButtons() {
    advSearchQueryState.isQueryGraphable = ($scope.selectedEEZs && $scope.selectedEEZs.length === 1);
    advSearchQueryState.isQueryDownloadable = ($scope.selectedEEZs && $scope.selectedEEZs.length > 0);
  }

  function updateQueryUrls() {

    if ($scope.selectedEEZs.length === 1) { //condition is TEMPORARY until we start supporing multi-region graph pages.
      //Update the variables that configure the GRAPH search query.
      var strBuilder = [
        '/eez/',
        $scope.selectedEEZs[0].id,
        '?chart=catch-chart',
        '&dimension=',
        $scope.selectedDimension.value,
        '&measure=',
        $scope.selectedMeasure.value,
        '&limit=',
        $scope.selectedLimit.value
      ];
      advSearchQueryState.graphDataUrl = strBuilder.join('');
    }

    //Update the variables that configure the CSV search query.
    var urlConfig = {
      regionType: 'eez',
      measure: $scope.selectedMeasure.value,
      dimension: $scope.selectedDimension.value,
      limit: $scope.selectedLimit.value,
      useScientificNames: $scope.useScientificName, //we should make this configurable in the UI
      regionIds: getSelectedRegionIds()
    };
    advSearchQueryState.downloadDataUrl = downloadDataUrl.createRegionUrl(urlConfig);
  }

  //Make an array of all the region IDs from the user's selected list of EEZs.
  function getSelectedRegionIds() {
    var selectedRegionIds = [];
    for (var i = 0; i < $scope.selectedEEZs.length; i++) {
      selectedRegionIds.push($scope.selectedEEZs[i].id);
    }
    return selectedRegionIds;
  }

  $scope.selectedEEZs = [];
  $scope.eezList = sauAPI.Regions.get({region: 'eez', nospatial: true});
  $scope.dimensions = regionDimensions.eez;
  $scope.selectedDimension = $scope.dimensions[0];
  $scope.measures = regionMeasures.eez;
  $scope.selectedMeasure = $scope.measures[0];
  $scope.limits = regionDimensionLimits.eez;
  $scope.selectedLimit = $scope.limits[0];

  //$scope.$watch('selectedEEZs.length', updateSubmitButtons);
  $scope.$watch('selectedEEZs', $scope.queryChanged);
});