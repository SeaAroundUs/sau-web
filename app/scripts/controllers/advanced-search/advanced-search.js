'use strict';

angular.module('sauWebApp').controller('AdvancedSearchCtrl', function ($scope, $location, advSearchService, $window, sauAPI, $modal) {

  //Tied to the "view graph" button
  $scope.viewGraph = function() {
    $location.url($scope.queryState.graphPageUrl);
  };

  //Tied to the "download data" button
  $scope.downloadData = function() {

    //Open a modal that reminds the user to attribute SAU in their paper.
    $modal.open({
      templateUrl: 'views/download-data-modal.html',
      controller: 'DownloadDataModalCtrl',
      resolve: {
        dataUrl: function() {
          return sauAPI.apiURL + $scope.queryState.downloadDataUrl;
        }
      }
    });
  };

  //Changes the query controller when the user changed the "search on" input.
  $scope.updateSearchOn = function() {
    $scope.queryController = advSearchService.controllers[$scope.searchOn];
  }

  //The active child controller uses the "advSearchService" service to communicate with this controller.
  //I assign it to the $scope object so that variable changes are $watch-able
  $scope.queryState = advSearchService.state;
});