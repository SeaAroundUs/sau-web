'use strict';

angular.module('sauWebApp')
  .controller('RegionDataCtrl', function($scope, $compile, region, faos) {
    var id = 1; //TODO
    angular.extend($scope, {
      region: {
        name: region,
        id: id,
        faoId: null,
        faos: faos.getFAOsByRegion(region, id)
      }
    });
  });
