'use strict';

angular.module('sauWebApp').controller('KeyInfoOnSpeciesCtrl', [ '$scope', '$routeParams',
  function ($scope, $routeParams) {
    $scope.taxonId = $routeParams.taxon;
  }]);