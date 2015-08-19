'use strict';
/* global d3 */
angular.module('sauWebApp').controller('SpatialCatchMapCtrl',
  function ($scope, testData, fishingCountries, taxa, commercialGroups, functionalGroups, reportingStatuses, catchTypes, sauAPI, colorAssignment, $timeout) {

    $scope.submitQuery = function (query) {
      $scope.lastQuery = angular.copy(query);
      updateComparableTypeList();
      assignDefaultComparison();
      assignColorsToComparees();
      $scope.loadingText = 'Downloading cells';

      var queryParams = {};
      if (query.fishingCountries && query.fishingCountries.length > 0) {
        queryParams.entities = joinBy(query.fishingCountries, ',', 'id');
      }
      if (query.year) {
        queryParams.year = query.year;
      }

      $scope.spatialCatchData = sauAPI.SpatialCatchData.get(queryParams, drawCellData);
    };

    $scope.queryChanged = function () {

    };

    $scope.isQueryDirty = function() {
      return !angular.equals($scope.lastQuery, $scope.query);
    };

    $scope.getComparees = function() {
      var comparees = [];
      if ($scope.isQueryComparable()) {
        comparees = $scope.lastQuery[$scope.comparableType.field];
      }

      return comparees;
    };

    $scope.isQueryComparable = function() {
      return $scope.comparableType && $scope.comparableType.field;
    };

    $scope.getColorOfComparee = function (comparee) {
      if (!$scope.isQueryComparable()) {
        return null;
      }

      var compareeId = comparee[$scope.comparableType.key];
      return colorAssignment.colorOf(compareeId);
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

    function drawCellData() {
      $scope.isRendering = true;
      $scope.loadingText = 'Rendering';
      //The rendering process locks the CPU for a while, so the $timeout gives us a chance to
      //put up a loading screen.
      $timeout(function() {
        var response = $scope.spatialCatchData;

        if (!response || !response.data || response.data.length < 1) {
          return;
        }

        var cellData = new Uint8ClampedArray(1036800); //Number of bytes: columns * rows * 4 (r,g,b,a)
        for (var i = 0; i < response.data.length; i++) {
          var cellBlob = response.data[i];
          var color = colorAssignment.getDefaultColor();
          if ($scope.isQueryComparable()) {
            color = colorAssignment.colorOf([cellBlob[$scope.comparableType.serverId]]);
          }
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
      }, 50).then(function () {
        $scope.isRendering = false;
      });
    }

    function multiplyChannel(top, bottom) {
      return ~~(top * bottom / 255);
    }

    function lightenChannel(color, pct) {
      return ~~((255 - color) * pct + color);
    }

    function updateComparableTypeList() {
      $scope.comparableTypes = [];

      if (!$scope.lastQuery) {
        return;
      }

      //All searchable query dimensions that have multiple selections get added to this list.
      for (var i = 0; i < allComparableTypes.length; i++) {
        var p = allComparableTypes[i];
        if ($scope.lastQuery[p.field] && $scope.lastQuery[p.field].length > 1) {
          $scope.comparableTypes.push(p);
        }
      }

      //Make "Nothing" an option if any comparableTypes exist
      if ($scope.comparableTypes.length > 0) {
        $scope.comparableTypes.unshift({
          name: 'Nothing',
          field: '',
          key: '',
          serverId: '[not supported]'
        });
      }
    }

    function assignDefaultComparison() {
      if (!$scope.comparableType && $scope.comparableTypes) {
        $scope.comparableType = $scope.comparableTypes[1];
      }
    }

    function assignColorsToComparees() {
      if ($scope.isQueryComparable()) {
        var compareeIds = [];
        var comparees = $scope.lastQuery[$scope.comparableType.field];
        for (var i = 0; i < comparees.length; i++) {
          var comparee = comparees[i];
          var compareeId = comparee[$scope.comparableType.key];
          compareeIds.push(compareeId);
        }
        colorAssignment.setData(compareeIds);
      }
    }

    //Resolved service responses
    $scope.fishingCountries = fishingCountries.data;
    $scope.taxa = taxa.data;
    $scope.commercialGroups = commercialGroups.data;
    $scope.functionalGroups = functionalGroups.data;
    $scope.reportingStatuses = reportingStatuses;
    $scope.catchTypes = catchTypes;
    $scope.defaultColor = colorAssignment.getDefaultColor();

    $scope.$watch('comparableType', assignDefaultComparison);
    $scope.$watch('comparableType', assignColorsToComparees);
    $scope.$watch('comparableType', drawCellData);

    var allComparableTypes = [
      {
        name: 'Fishing countries',
        field: 'fishingCountries',
        key: 'id',
        serverId: 'fishing_entity_id',
        entityName: 'title',
      },
      {
        name: 'Taxa',
        field: 'taxa',
        key: 'taxon_key',
        serverId: '[not supported]',
        entityName: 'common_name'
      },
      {
        name: 'Commercial groups',
        field: 'commercialGroups',
        key: 'commercial_group_id',
        serverId: '[not supported]',
        entityName: 'name'
      },
      {
        name: 'Functional groups',
        field: 'functionalGroups',
        key: 'functional_group_id',
        serverId: '[not supported]',
        entityName: 'description',
      },
      {
        name: 'Reporting statuses',
        field: 'reportingStatuses',
        key: 'name',
        serverId: '[not supported]',
        entityName: 'name'
      },
      {
        name: 'Catch types',
        field: 'catchTypes',
        key: 'name',
        serverId: '[not supported]',
        entityName: 'name'
      }
    ];

    d3.json('countries.topojson', function(error, countries) {
      var map = d3.geo.GridMap;
      map.init('#cell-map', [720, 360], {
        projection: d3.geo.mollweide(),
        countries: countries,
        landColor: 'rgba(251, 250, 243, 1)',
        seaColor: 'rgba(181, 224, 249, 1)',
        landOutlineColor: 'rgba(0, 0, 0, 0)',
        graticuleColor: 'rgba(255, 255, 255, 0.3)',
        geoJsonColor: 'rgba(0, 0, 0, 0)'
      });
    });
  });

