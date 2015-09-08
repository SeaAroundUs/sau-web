'use strict';

angular.module('sauWebApp').controller('AdvSearchTaxonCtrl', function ($scope, sauAPI, advSearchService, createQueryUrl) {

  //Called by the UI components whenever the user changes a parameter of the query.
  $scope.queryChanged = function() {
    updateQueryUrls();
    updateSubmitButtons();
  };

  //Tells the parent controller what the state of the query buttons should be (via a service)
  function updateSubmitButtons() {
    advSearchService.state.isQueryGraphable = ($scope.selectedTaxa && $scope.selectedTaxa.length > 0);
    advSearchService.state.isQueryDownloadable = ($scope.selectedTaxa && $scope.selectedTaxa.length > 0);
  }

  //When the query buttons are pushed, they call these URLS, which are generated based on the query params.
  function updateQueryUrls() {

    if (!$scope.selectedDimension ||
      !$scope.selectedMeasure ||
      !$scope.selectedLimit ||
      $scope.selectedTaxa.length === 0) {
      return;
    }

    //Update the variables that configure the search query.
    var urlConfig = {
      regionType: $scope.section,
      measure: $scope.selectedMeasure.value,
      dimension: $scope.selectedDimension.value,
      limit: $scope.selectedLimit.value,
      useScientificName: $scope.useScientificName,
      regionIds: getSelectedTaxaKeys()
    };

    //Create the CSV URL.
    advSearchService.state.downloadDataUrl = createQueryUrl.forRegionCsv(urlConfig);

    //Create the chart URL.
    advSearchService.state.graphPageUrl = createQueryUrl.forRegionCatchChart(urlConfig);
  }

  //These are mostly used to populate the UI components with UI data.
  $scope.selectedTaxa = [];
  sauAPI.Taxa.get().$promise.then(function(data) {
    $scope.taxaList = data.data.map(function(taxon) {
      taxon.id = taxon.taxon_key;
      taxon.title = taxon.scientific_name + ' (' + taxon.common_name + ')';
      return taxon;
    });
  });
  $scope.selectionLimit = 10;

  $scope.$watch('selectedTaxa', $scope.queryChanged);
  $scope.$watch('selectedDimension', $scope.queryChanged);
  $scope.$watch('useScientificName', $scope.queryChanged);
  $scope.$watch('selectedMeasure', $scope.queryChanged);
  $scope.$watch('selectedLimit', $scope.queryChanged);

  //Make an array of all the region IDs from the user's selected list of regions.
  function getSelectedTaxaKeys() {
    var selectedTaxaKeys = [];
    for (var i = 0; i < $scope.selectedTaxa.length; i++) {
      selectedTaxaKeys.push($scope.selectedTaxa[i].taxon_key);
    }
    return selectedTaxaKeys;
  }
});
