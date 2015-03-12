'use strict';

angular.module('sauWebApp').controller('KeyInfoOnTaxonCtrl',
  function ($scope, $rootScope, sauAPI, $routeParams) {

    if ($rootScope.modalInstance) {
        // clean house
        $rootScope.modalInstance.close();
    }
  	sauAPI.Taxon.get({taxon_key: $routeParams.taxon}, function(result) {
        $scope.taxon = result.data;
    });
  });