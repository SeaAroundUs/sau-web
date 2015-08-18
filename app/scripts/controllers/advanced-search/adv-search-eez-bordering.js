'use strict';

angular.module('sauWebApp').controller('AdvSearchEEZBorderingCtrl', function ($scope, sauAPI, advSearchService, createQueryUrl) {

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
        $scope.selectedEezs.length === 0) {
      return;
    }

    //Update the variables that configure the search query.
    var urlConfig = {};

    //Create the CSV URL.
    advSearchService.state.downloadDataUrl = "Download Data URL";

    //Create the chart URL.
    advSearchService.state.graphDataUrl = "Graph Page URL";
  }

  //requests for the eezs that border the user-selected eez
  function requestBorderingEezs() {
    if ($scope.selectedEezs.length == 0) {
      $scope.borderingEezs = null;
    } else {
      console.log('Request bordering EEZs of ' + $scope.selectedEezs[0].title + '.');
      $scope.borderingEezs = sauAPI.Regions.get({region: 'eez-bordering', region_id: $scope.selectedEezs[0].id, nospatial: true});
    }
  }

  //These are mostly used to populate the UI components with UI data.
  $scope.selectedEezs = [];
  $scope.eezList = sauAPI.Regions.get({region: 'eez', nospatial: true});

  $scope.$watch('selectedEezs', requestBorderingEezs);
  $scope.$watch('selectedDimension', $scope.queryChanged);
  $scope.$watch('selectedMeasure', $scope.queryChanged);
  $scope.$watch('selectedLimit', $scope.queryChanged);

  $scope.$watch('selectedEezs', $scope.queryChanged);
});
