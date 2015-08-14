'use strict';
/* global d3 */
angular.module('sauWebApp').controller('SpatialCatchMapCtrl',
  function ($scope, testData, fishingCountries, taxa, commercialGroups, functionalGroups, reportingStatuses, catchTypes) {

    //Resolved service responses
    $scope.fishingCountries = fishingCountries.data;
    $scope.taxa = taxa.data;
    $scope.commercialGroups = commercialGroups.data;
    $scope.functionalGroups = functionalGroups.data;
    $scope.reportingStatuses = reportingStatuses;
    $scope.catchTypes = catchTypes;

    d3.json('countries.topojson', function(error, countries) {
      var map = d3.geo.GridMap;
      map.init('#cell-map', [720, 360], {
        projection: d3.geo.mollweide(),
        countries: countries,
        landColor: 'rgba(251, 250, 243, 1)',
        seaColor: 'rgba(181, 224, 249, 1)'
      });

      var cellData = new Uint8ClampedArray(720 * 360 * 4);
      var color = [228, 135, 242, 255]; //Purp

      //Value thresholds
      for (var i = 0; i < testData.data.length; i ++) {
        var pct = (5 - testData.data[i].threshold) / 5;
        //Color the cells in this value threshold
        for (var j = 0; j < testData.data[i].array_agg.length; j++) {
          var cell = testData.data[i].array_agg[j];
          cellData[cell*4] = lighten(color[0], pct);
          cellData[cell*4 + 1] = lighten(color[1], pct);
          cellData[cell*4 + 2] = lighten(color[2], pct);
          cellData[cell*4 + 3] = lighten(color[3], pct);
        }
      }

      map.setDataUnsparseTypedArray(cellData);
    });

    function lighten(color, pct) {
      return (255 - color) * pct + color;
    }
  });

