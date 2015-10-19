'use strict';

angular.module('sauWebApp').controller('AdvSearchDefaultQueryCtrl',
        function ($scope, sauAPI, advSearchService, createQueryUrl, advSearchRegionConfig) {

  //Called by the UI components whenever the user changes a parameter of the query.
  $scope.queryChanged = function() {


    $scope.selectedRegions = Array.isArray($scope.selectedSearchOptions) ? $scope.selectedSearchOptions : [$scope.selectedSearchOptions];

    updateQueryUrls();
    updateSubmitButtons();
  };

  //Tells the parent controller what the state of the query buttons should be (via a service)
  function updateSubmitButtons() {
    advSearchService.state.isQueryGraphable = (
      ($scope.selectedRegions && $scope.selectedRegions.length > 0) || $scope.sectionConfig.selectionLimit == 0
    );
    advSearchService.state.isQueryDownloadable = (
      ($scope.selectedRegions && $scope.selectedRegions.length > 0) || $scope.sectionConfig.selectionLimit == 0
    );
  }

  //When the query buttons are pushed, they call these URLS, which are generated based on the query params.
  function updateQueryUrls() {

    if (!$scope.selectedDimension ||
        !$scope.selectedMeasure ||
        !$scope.selectedLimit ||
        !$scope.selectedRegions ||
        ($scope.selectedRegions.length === 0 && $scope.sectionConfig.selectionLimit > 0)) {
      return;
    }

    //Update the variables that configure the search query.
    var urlConfig = {
      regionType: $scope.sectionConfig.graphResultsPath,
      measure: $scope.selectedMeasure.value,
      dimension: $scope.selectedDimension.value,
      limit: $scope.selectedLimit.value,
      useScientificName: false,
      regionIds: $scope.selectedRegions
    };

    //Create the CSV URL.
    advSearchService.state.downloadDataUrl = createQueryUrl.forRegionCsv(urlConfig);

    //Create the chart URL.
    advSearchService.state.graphPageUrl = createQueryUrl.forRegionCatchChart(urlConfig);
  }

  //These are mostly used to populate the UI components with UI data.
  $scope.sectionConfig = advSearchRegionConfig[$scope.section];
  $scope.sectionConfig.getRegionData().$promise.then(function (results) {
    $scope.searchOptions = $scope.sectionConfig.getSearchOptions(results);
  });

  //CONFUSING HACK:
  //$scope.selectedSearchOptions can be an ARRAY OR A STRING. If the selectize component allows for multiple selections, it is an array.
  //Otherwise, it is a string that contains a single ID.
  //We use "$scope.selectedRegions" variable instead, that way we can ensure that we're always working with the same data type (an array).
  //-Eric
  $scope.selectedSearchOptions = []; //This variable is tied to the view. It can be an array or a string.
  $scope.selectedRegions = []; //This is the variable we actually use. We update it whenever the above variable changes.

  //Whenever the user changes a query paramter, we notify that the query has changed.
  $scope.$watchGroup(['selectedSearchOptions', 'selectedDimension', 'selectedMeasure', 'selectedLimit'], $scope.queryChanged);
});
