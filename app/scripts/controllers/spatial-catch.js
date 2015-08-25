'use strict';
/* global d3 */
angular.module('sauWebApp').controller('SpatialCatchMapCtrl',
  function ($scope, testData, fishingCountries, taxa, commercialGroups, functionalGroups, reportingStatuses, catchTypes, sauAPI, colorAssignment, $timeout, $location, $filter) {

    var map = null;

    $scope.submitQuery = function (query) {
      $scope.lastQuery = angular.copy(query);
      assignColorsToComparees();
      updateUrlFromQuery();
      $scope.loadingText = 'Downloading cells';

      //Form the query...
      var queryParams = {};

      //...Fishing countries
      if (query.fishingCountries && query.fishingCountries.length > 0) {
        queryParams.entities = joinBy(query.fishingCountries, ',', 'id');
      }

      //...Year
      if (query.year) {
        queryParams.year = query.year;
      }

      switch (query.catchesBy) {
        //...Taxa
        case 'taxa':
          if (query.taxa) {
            queryParams.taxa = joinBy(query.taxa, ',', 'taxon_key');
          }
          break;
        //...Commercial groups
        case 'commercial groups':
          if (query.commercialGroups) {
            queryParams.commgroups = joinBy(query.commercialGroups, ',', 'commercial_group_id');
          }
          break;
        //...Functional groups
        case 'functional groups':
          if (query.functionalGroups) {
            queryParams.funcgroups = joinBy(query.functionalGroups, ',', 'functional_group_id');
          }
          break;
      }

      //...Reporting statuses
      if (query.reportingStatuses) {
        queryParams.repstatus = joinBy(query.reportingStatuses, ',', 'id');
      }

      //...Catch types
      if (query.catchTypes) {
        queryParams.catchtypes = joinBy(query.catchTypes, ',', 'id');
      }

      //...Compare term
      queryParams.compare = query.comparableType.compareTerm;

      //Make the call
      $scope.spatialCatchData = sauAPI.SpatialCatchData.get(queryParams, drawCellData);
    };

    $scope.isQueryDirty = function() {
      return !angular.equals($scope.lastQuery, $scope.query);
    };

    $scope.getComparees = function(query) {
      var comparees = [];
      if ($scope.isQueryComparable(query)) {
        comparees = query[query.comparableType.field];
      }

      return comparees;
    };

    $scope.isQueryComparable = function(query) {
      return query && query.comparableType && query.comparableType.field;
    };

    $scope.getColorOfComparee = function (comparee) {
      if (!$scope.isQueryComparable($scope.lastQuery)) {
        return null;
      }

      var compareeId = comparee[$scope.lastQuery.comparableType.key];
      return colorAssignment.colorOf(compareeId);
    };

    $scope.isQueryValid = function () {
      return $scope.query && $scope.query.fishingCountries && $scope.query.fishingCountries.length > 0;
    };

    $scope.minCatch = function(groupId) {
      var min = 0;

      if ($scope.spatialCatchData.data) {
        for (var i = 0; i < $scope.spatialCatchData.data.length; i++) {
          if ($scope.spatialCatchData.data[i].rollup_key === groupId.toString()) {
            return $filter('number')(+$scope.spatialCatchData.data[i].min_catch, 0);
          }
        }
      }

      return min;
    };

    $scope.maxCatch = function(groupId) {
      var max = 0;

      if ($scope.spatialCatchData.data) {
        for (var i = 0; i < $scope.spatialCatchData.data.length; i++) {
          if ($scope.spatialCatchData.data[i].rollup_key === groupId.toString()) {
            return $filter('number')(+$scope.spatialCatchData.data[i].max_catch, 0);
          }
        }
      }

      return max;
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

        if (!response) {
          return;
        }

        var cellData = new Uint8ClampedArray(1036800); //Number of bytes: columns * rows * 4 (r,g,b,a)

        if (response.data) {
          for (var i = 0; i < response.data.length; i++) {
            var cellBlob = response.data[i]; //Grouped cells
            var color = colorAssignment.getDefaultColor();
            if ($scope.isQueryComparable($scope.lastQuery)) {
              color = colorAssignment.colorOf(cellBlob.rollup_key);
            }
            for (var j = 0; j < cellBlob.data.length; j++) {
              var cellSubBlob = cellBlob.data[j]; //Subgroups by threshold
              var pct = (5 - cellSubBlob.threshold) / 5;
              for (var k = 0; k < cellSubBlob.cells.length; k++) {
                var cell = cellSubBlob.cells[k];
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
          }
        }

        map.setDataUnsparseTypedArray(cellData);
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
      $scope.comparableTypes = [allComparableTypes[0]];

      //All searchable query dimensions that have multiple selections get added to this list.
      /*for (var i = 0; i < allComparableTypes.length; i++) {
        var p = allComparableTypes[i];
        if (($scope.query[p.field] && $scope.query[p.field].length > 1) ||
          p.alwaysComparable) {
          $scope.comparableTypes.push(p);
        }
      }*/

      switch ($scope.query.catchesBy) {
        case 'taxa':
          if ($scope.query.taxa && $scope.query.taxa.length > 1) {
            $scope.comparableTypes.push(allComparableTypes.getWhere('field', 'taxa'));
          }
          break;
        case 'commercial groups':
          if ($scope.query.commercialGroups && $scope.query.commercialGroups.length > 1) {
            $scope.comparableTypes.push(allComparableTypes.getWhere('field', 'commercialGroups'));
          }
          break;
        case 'functional groups':
          if ($scope.query.functionalGroups && $scope.query.functionalGroups.length > 1) {
            $scope.comparableTypes.push(allComparableTypes.getWhere('field', 'functionalGroups'));
          }
          break;
      }

      if ($scope.query.reportingStatuses && $scope.query.reportingStatuses.length > 1) {
        $scope.comparableTypes.push(allComparableTypes.getWhere('field', 'reportingStatuses'));
      }

      if ($scope.query.catchTypes && $scope.query.catchTypes.length > 1) {
        $scope.comparableTypes.push(allComparableTypes.getWhere('field', 'catchTypes'));
      }

      assignDefaultComparison();
    }

    function assignDefaultComparison() {
      if (!$scope.query.comparableType || $scope.comparableTypes.indexOf($scope.query.comparableType) === -1) {
        $scope.query.comparableType = $scope.comparableTypes[0];
      }
    }

    function assignColorsToComparees() {
      if ($scope.isQueryComparable($scope.lastQuery)) {
        var compareeIds = [];
        var comparees = $scope.getComparees($scope.lastQuery);
        for (var i = 0; i < comparees.length; i++) {
          var comparee = comparees[i];
          var compareeId = comparee[$scope.lastQuery.comparableType.key];
          compareeIds.push(compareeId.toString());
        }
        colorAssignment.setData(compareeIds);
      }
    }

    function updateQueryFromUrl() {
      var search = $location.search();

      //Fishing countries
      if (search.entities) {
        $scope.query.fishingCountries = getSubArray(fishingCountries.data, search.entities.split(','), 'id');
      }

      //Taxa, commercial groups, functional groups
      if (search.taxa) {
        $scope.query.catchesBy = 'taxa';
        $scope.query.taxa = getSubArray(taxa.data, search.taxa.split(','), 'taxon_key');
      } else if (search.commgroups) {
        $scope.query.catchesBy = 'commercial groups';
        $scope.query.commercialGroups = getSubArray(commercialGroups.data, search.commgroups.split(','), 'commercial_group_id');
      } else if (search.funcgroups) {
        $scope.query.catchesBy = 'functional groups';
        $scope.query.functionalGroups = getSubArray(functionalGroups.data, search.funcgroups.split(','), 'functional_group_id');
      } else {
        $scope.query.catchesBy = 'taxa';
      }

      //Reporting statuses
      if (search.repstatuses) {
        $scope.query.reportingStatuses = getSubArray(reportingStatuses, search.repstatuses.split(','), 'id');
      }

      //Catch types
      if (search.catchtypes) {
        $scope.query.catchTypes = getSubArray(catchTypes, search.catchtypes.split(','), 'id');
      }

      //Year
      $scope.query.year = Math.min(Math.max(+search.year || 2010, 1950), 2010); //Clamp(year, 1950, 2010). Why does JS not have a clamp function?

      //Compare type (must supply one, no matter what)
      updateComparableTypeList();
      if (search.compare) {
        $scope.query.comparableType = allComparableTypes.getWhere('compareTerm', search.compare);
      } else {
        $scope.query.comparableType = $scope.comparableTypes[0];
      }
    }

    function updateUrlFromQuery() {
      //Fishing countries
      if ($scope.query.fishingCountries && $scope.query.fishingCountries.length > 0) {
        $location.search('entities', joinBy($scope.query.fishingCountries, ',', 'id'));
      }

      //Taxa, commercial groups, functional groups
      switch ($scope.query.catchesBy) {
        case 'taxa':
          if ($scope.query.taxa && $scope.query.taxa.length > 0) {
            $location.search('taxa', joinBy($scope.query.taxa, ',', 'taxon_key'));
            $location.search('commgroups', null);
            $location.search('funcgroups', null);
          }
          break;
        case 'commercial groups':
          if ($scope.query.commercialGroups && $scope.query.commercialGroups.length > 0) {
            $location.search('taxa', null);
            $location.search('commgroups', joinBy($scope.query.commercialGroups, ',', 'commercial_group_id'));
            $location.search('funcgroups', null);
          }
          break;
        case 'functional groups':
          if ($scope.query.functionalGroups && $scope.query.functionalGroups.length > 0) {
            $location.search('taxa', null);
            $location.search('commgroups', null);
            $location.search('funcgroups', joinBy($scope.query.functionalGroups, ',', 'functional_group_id'));
          }
          break;
      }

      //Reporting statuses
      if ($scope.query.reportingStatuses && $scope.query.reportingStatuses.length > 0) {
        $location.search('repstatuses', joinBy($scope.query.reportingStatuses, ',', 'id'));
      } else {
        $location.search('repstatuses', null);
      }

      //Catch types
      if ($scope.query.catchTypes && $scope.query.catchTypes.length > 0) {
        $location.search('catchtypes', joinBy($scope.query.catchTypes, ',', 'id'));
      } else {
        $location.search('catchtypes', null);
      }

      //Year
      var queryYear = $scope.query.year || 2010;
      if (queryYear !== 2010) {
        $location.search('year', queryYear);
      } else {
        $location.search('year', null);
      }

      //Compare type
      if ($scope.query.comparableType) {
        var compareTerm = $scope.query.comparableType.compareTerm;
        $location.search('compare', compareTerm === 'entities' ? null : compareTerm); //No need to show the 'compare' query if it's entities, that's the default
      }

      $location.replace();
    }

    function getSubArray(array, ids, key) {
      var results = [];
      for (var i = 0; i < ids.length; i++) {
        for (var j = 0; j < array.length; j++) {
          if (array[j][key].toString() === ids[i].toString()) {
            results.push(array[j]);
          }
        }
      }

      return results;
    }

    //Resolved service responses
    $scope.fishingCountries = fishingCountries.data;
    $scope.taxa = taxa.data;
    $scope.commercialGroups = commercialGroups.data;
    $scope.functionalGroups = functionalGroups.data;
    $scope.reportingStatuses = reportingStatuses;
    $scope.catchTypes = catchTypes;
    $scope.defaultColor = colorAssignment.getDefaultColor();

    $scope.$watch(
      [
        'query.catchesBy',
        'query.reportingStatuses',
        'query.catchTypes'
      ],
      updateComparableTypeList
    );
    $scope.$watchCollection('query.taxa', updateComparableTypeList);
    $scope.$watchCollection('query.commercialGroups', updateComparableTypeList);
    $scope.$watchCollection('query.functionalGroups', updateComparableTypeList);
    $scope.$watch('query.reportingStatuses', updateComparableTypeList);
    $scope.$watch('query.catchTypes', updateComparableTypeList);
    $scope.$on('$destroy', $scope.$on('$locationChangeSuccess', updateQueryFromUrl));
    $scope.query = {};

    var allComparableTypes = [
      {
        name: 'Fishing countries',
        field: 'fishingCountries',
        key: 'id',
        entityName: 'title',
        compareTerm: 'entities'
      },
      {
        name: 'Taxa',
        field: 'taxa',
        key: 'taxon_key',
        entityName: 'common_name',
        compareTerm: 'taxa'
      },
      {
        name: 'Commercial groups',
        field: 'commercialGroups',
        key: 'commercial_group_id',
        entityName: 'name',
        compareTerm: 'commgroups'
      },
      {
        name: 'Functional groups',
        field: 'functionalGroups',
        key: 'functional_group_id',
        entityName: 'description',
        compareTerm: 'funcgroups'
      },
      {
        name: 'Reporting statuses',
        field: 'reportingStatuses',
        key: 'id',
        entityName: 'name',
        compareTerm: 'repstatus'
      },
      {
        name: 'Catch types',
        field: 'catchTypes',
        key: 'id',
        entityName: 'name',
        compareTerm: 'catchtypes'
      }
    ];

    allComparableTypes.getWhere = function(field, value) {
      for (var i = 0; i < allComparableTypes.length; i++) {
        if (allComparableTypes[i][field] === value) {
          return allComparableTypes[i];
        }
      }
      return null;
    };

    d3.json('countries.topojson', function(error, countries) {
      map = new d3.geo.GridMap('#cell-map', [720, 360], {
        projection: d3.geo.mollweide(),
        countries: countries,
        landColor: 'rgba(251, 250, 243, 1)',
        seaColor: 'rgba(181, 224, 249, 1)',
        landOutlineColor: 'rgba(0, 0, 0, 0)',
        graticuleColor: 'rgba(255, 255, 255, 0.3)',
        geoJsonColor: 'rgba(0, 0, 0, 0)'
      });
    });

    updateQueryFromUrl();

    //Boostrap the initial query if there are query params in the URL when the page loads.
    if ($scope.isQueryValid()) {
      $scope.submitQuery($scope.query);
    }
  });

