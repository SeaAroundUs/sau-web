'use strict';

angular.module('sauWebApp').controller('KeyInfoOnSpeciesCtrl',
  function ($scope, sauAPI, $routeParams) {
  	sauAPI.Taxon.get({taxon_key: $routeParams.taxon}, function(result) {
        $scope.taxon = result.data;
    });
  });