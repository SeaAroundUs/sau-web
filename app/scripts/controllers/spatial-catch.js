'use strict';
/* global d3 */
angular.module('sauWebApp').controller('SpatialCatchMapCtrl',
  function ($scope, testData, fishingCountries, taxa, commercialGroups, functionalGroups, reportingStatuses, catchTypes, sauAPI, spatialCatchColors) {

    $scope.submitQuery = function (query) {
      $scope.isQueryDirty = false;

      var queryParams = {};
      if (query.fishingCountries && query.fishingCountries.length > 0) {
        queryParams.entities = joinBy(query.fishingCountries, ',', 'id');
      }
      if (query.year) {
        queryParams.year = query.year;
      }

      $scope.spatialCatchData = sauAPI.SpatialCatchData.get(queryParams, handleSpatialCatchDataResponse);
    };

    var colors = [];
    var nextAvailableColor = 0;

    //Resolved service responses
    $scope.fishingCountries = fishingCountries.data;
    $scope.taxa = taxa.data;
    $scope.commercialGroups = commercialGroups.data;
    $scope.functionalGroups = functionalGroups.data;
    $scope.reportingStatuses = reportingStatuses;
    $scope.catchTypes = catchTypes;
    $scope.isQueryDirty = false;

    d3.json('countries.topojson', function(error, countries) {
      var map = d3.geo.GridMap;
      map.init('#cell-map', [720, 360], {
        projection: d3.geo.mollweide(),
        countries: countries,
        landColor: 'rgba(251, 250, 243, 1)',
        seaColor: 'rgba(181, 224, 249, 1)'
      });
    });

    $scope.queryChanged = function () {
      //TODO do a diff against the previously generated query to see if the query is actually different, instead of just assuming.
      $scope.isQueryDirty = true;
    };

    function joinBy(array, delimiter, property) {
      var s = '';
      for (var i = 0; i < array.length; i++) {
        s += array[i][property];
        if (i < array.length - 1) {
          s += delimiter;
        }
      }
      return s;
    }

    function handleSpatialCatchDataResponse (response) {
      console.log('Got response');

      var cellData = new Uint8ClampedArray(1036800); //Number of bytes: columns * rows * 4 (r,g,b,a)
      for (var i = 0; i < response.data.length; i++) {
        var cellBlob = response.data[i];
        var color = getColorForComparee(cellBlob.fishing_entity_id);
        var pct = (5 - cellBlob.threshold) / 5;
        for (var j = 0; j < cellBlob.cells.length; j++) {
          var cell = cellBlob.cells[j];
          //Don't use a color blend mode for cell's the first color.
          if (cellData[cell*4 + 3] === 0) {
            cellData[cell*4] = lightenChannel(color[0], pct);
            cellData[cell*4 + 1] = lightenChannel(color[1], pct);
            cellData[cell*4 + 2] = lightenChannel(color[2], pct);
            cellData[cell*4 + 3] = 255;
          //Multiply the colors for layered cells.
          } else {
            cellData[cell*4] = multiplyChannel(lightenChannel(color[0], pct), cellData[cell*4]);
            cellData[cell*4 + 1] = multiplyChannel(lightenChannel(color[1], pct), cellData[cell*4 + 1]);
            cellData[cell*4 + 2] = multiplyChannel(lightenChannel(color[2], pct), cellData[cell*4 + 2]);
            cellData[cell*4 + 3] = 255;
          }
        }
      }

      d3.geo.GridMap.setDataUnsparseTypedArray(cellData);
    }

    function getColorForComparee(compareeId) {
      if (!colors[compareeId]) {
        if (nextAvailableColor < spatialCatchColors.length) {
          colors[compareeId] = spatialCatchColors[nextAvailableColor++]; //Grab from the list of pre-created colors
        } else {

          colors[compareeId] = [~~(Math.random() * 256), ~~(Math.random() * 256), ~~(Math.random() * 256), 255]; //Create a random color
        }
      }
      return colors[compareeId];
    }

    function multiplyChannel(top, bottom) {
      return ~~(top * bottom / 255);
    }

    function lightenChannel(color, pct) {
      return ~~((255 - color) * pct + color);
    }
  })
  .value('spatialCatchColors', [
    [111, 0, 64, 255],
    [37, 188, 80, 255],
    [226, 220, 34, 255],
  ]);

