'use strict';

angular.module('sauWebApp').controller('AdvancedSearchCtrl', function ($scope) {

	/* Child controllers should call this function in order to control
	the state of the graph button from their perspective. */
	$scope.isQueryGraphable = function (isGraphable) {
		$scope.enableViewGraph = isGraphable;
	};

	/* Child controllers should call this function in order to control
	the state of the download data button from their perspective. */
	$scope.isQueryDownloadable = function (isDownloadable) {
		$scope.enableDownloadData = isDownloadable;
	}

	//Tied to the "view graph" button.
	$scope.enableViewGraph = false;
	//Tied to the "download data" button.
	$scope.enableDownloadData = false;
});