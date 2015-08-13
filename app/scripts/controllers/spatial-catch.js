'use strict';
/* global d3 */
angular.module('sauWebApp').controller('SpatialCatchMapCtrl',
  function ($scope, $window, mapConfig, countries110, testData) {
    d3.json('countries.json', function(error, countries) {
      var map = d3.geo.GridMap;
      map.init('#cell-map', [720, 360], {
        projection: d3.geo.mollweide(),
        countries: countries
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

    $scope.fishingCountries = [
      { name: 'A'},
      { name: 'B'},
      { name: 'C'},
      { name: 'D'},
      { name: 'E'},
      { name: 'F'}
    ];

    $scope.taxa = [
      { name: 'A'},
      { name: 'B'},
      { name: 'C'},
      { name: 'D'},
      { name: 'E'},
      { name: 'F'},
      { name: 'G'},
      { name: 'H'},
      { name: 'I'},
    ];

    $scope.commercialGroups = [
      { name: 'A'},
      { name: 'B'},
      { name: 'C'},
      { name: 'D'},
      { name: 'E'},
      { name: 'F'},
      { name: 'G'},
      { name: 'H'},
      { name: 'I'},
    ];

    $scope.functionalGroups = [
      { name: 'A'},
      { name: 'B'},
      { name: 'C'},
      { name: 'D'},
      { name: 'E'},
      { name: 'F'},
      { name: 'G'},
      { name: 'H'},
      { name: 'I'},
    ];

    $scope.reportingStatuses = [
      { name: 'Reported'},
      { name: 'Unreported'}
    ];

    $scope.catchTypes = [
      { name: 'Landings'},
      { name: 'Discards'}
    ];

    $scope.catchesBy = [
      'Taxa',
      'Commercial groups',
      'Functional groups'
    ];

    function lighten(color, pct) {
      return (255 - color) * pct + color;
    }
  });

