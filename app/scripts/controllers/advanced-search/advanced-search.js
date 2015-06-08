'use strict';

angular.module('sauWebApp').controller('AdvancedSearchCtrl', function ($scope, $location, advSearchQueryState, $window, sauAPI, $modal) {

  //Tied to the "view graph" button
  $scope.viewGraph = function() {
    $location.url($scope.queryState.graphDataUrl);
  };

  //Tied to the "download data" button
  $scope.downloadData = function() {
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

  //The active child controller uses the "advSearchQueryState" service to communicate with this controller.
  //Assigning it to the $scope object so that variable changes are $watch-able
  $scope.queryState = advSearchQueryState;
  //Tied to the "view graph" button.
  $scope.enableViewGraph = false;
  //Tied to the "download data" button.
  $scope.enableDownloadData = false;
});