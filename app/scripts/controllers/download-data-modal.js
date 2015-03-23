'use strict';

/**
 * @ngdoc function
 * @name sauWebApp.controller:DownloadDataModalCtrl
 * @description
 * # DownloadDataModalCtrl
 * Controller for the download data attribution modal dialog.
 */
angular.module('sauWebApp')
  .controller('DownloadDataModalCtrl', function ($scope, $modalInstance, dataUrl, $window) {
    $scope.downloadData = function() {
    	$window.open(dataUrl);
    	$modalInstance.dismiss('download');
    };

    $scope.cancel = function() {
    	$modalInstance.dismiss('cancel');
    };
  });
