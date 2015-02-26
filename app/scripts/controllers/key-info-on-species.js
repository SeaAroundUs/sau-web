'use strict';

angular.module('sauWebApp').controller('KeyInfoOnSpeciesCtrl',
  function ($scope) {
  	//TODO This is hard-coded. Replace with taxon service request.
  	$scope.taxon = {
  		commercialGroup: 'Herring-likes'
  	};
  });