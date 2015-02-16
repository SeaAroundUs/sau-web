'use strict';

angular.module('sauWebApp')
	.directive('lineChartWithRegression', function() {

	  return {
	    restrict: 'E',
	    templateUrl: 'views/line-chart-with-regression.html',
	    scope: {
	    	years:'=',
	    	chartdata: '=chartdata',
	    	options: '=options',
	    },
	  };
	});