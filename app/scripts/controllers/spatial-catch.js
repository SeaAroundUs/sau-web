'use strict';
/* global d3 */
angular.module('sauWebApp').controller('SpatialCatchMapCtrl',
  function ($scope, testData, fishingCountries, taxa, commercialGroups, functionalGroups, reportingStatuses, catchTypes, sauAPI, colorAssignment, $timeout, $location, $filter) {

    $scope.submitQuery = function (query) {
      $scope.lastQuery = angular.copy(query);
      assignColorsToComparees();
      updateUrlFromQuery();
      $scope.loadingText = 'Downloading cells';

      //Form the query...
      var queryParams = {};

      //...Fishing countries
      if (query.fishingCountries && query.fishingCountries.length > 0) {
        queryParams.entities = query.fishingCountries.join(',');
      }

      //...Year
      if (query.year) {
        queryParams.year = query.year;
      }

      switch (query.catchesBy) {
        //...Taxa
        case 'taxa':
          if (query.taxa) {
            queryParams.taxa = query.taxa.join(',');
          }
          break;
        //...Commercial groups
        case 'commercial groups':
          if (query.commercialGroups) {
            queryParams.commgroups = query.commercialGroups.join(',');
          }
          break;
        //...Functional groups
        case 'functional groups':
          if (query.functionalGroups) {
            queryParams.funcgroups = query.functionalGroups.join(',');
          }
          break;
      }

      //...Reporting statuses
      if (query.reportingStatuses) {
        queryParams.repstatus = query.reportingStatuses.join(',');
      }

      //...Catch types
      if (query.catchTypes) {
        queryParams.catchtypes = query.catchTypes.join(',');
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
      return colorAssignment.colorOf(comparee);
    };

    $scope.isQueryValid = function () {
      return $scope.query && $scope.query.fishingCountries && $scope.query.fishingCountries.length > 0;
    };

    $scope.minCatch = function(comparee) {
      if ($scope.spatialCatchData.data) {
        for (var i = 0; i < $scope.spatialCatchData.data.length; i++) {
          if ($scope.spatialCatchData.data[i].rollup_key === ''+comparee) {
            return $filter('number')(+$scope.spatialCatchData.data[i].min_catch, 0);
          }
        }
      }

      return 0;
    };

    $scope.maxCatch = function (comparee) {
      if ($scope.spatialCatchData.data) {
        for (var i = 0; i < $scope.spatialCatchData.data.length; i++) {
          if ($scope.spatialCatchData.data[i].rollup_key === ''+comparee) {
            return $filter('number')(+$scope.spatialCatchData.data[i].max_catch, 0);
          }
        }
      }

      return 0;
    };

    $scope.getCompareeName = function (comparee) {
      var array = $scope[$scope.lastQuery.comparableType.field];
      for (var i = 0; i < array.length; i++) {
        if (''+array[i][$scope.lastQuery.comparableType.key] === ''+comparee) {
          return array[i][$scope.lastQuery.comparableType.entityName];
        }
      }

      return 'Catches';
    };

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
          compareeIds.push(''+comparees[i]);
        }
        colorAssignment.setData(compareeIds);
      }
    }

    function updateQueryFromUrl() {
      var search = $location.search();

      //Fishing countries
      if (search.entities) {
        $scope.query.fishingCountries = search.entities.split(',');
      }

      //Taxa, commercial groups, functional groups
      if (search.taxa) {
        $scope.query.catchesBy = 'taxa';
        $scope.query.taxa = search.taxa.split(',');
      } else if (search.commgroups) {
        $scope.query.catchesBy = 'commercial groups';
        $scope.query.commercialGroups = search.commgroups.split(',');
      } else if (search.funcgroups) {
        $scope.query.catchesBy = 'functional groups';
        $scope.query.functionalGroups = search.funcgroups.split(',');
      } else {
        $scope.query.catchesBy = 'taxa';
      }

      //Reporting statuses
      if (search.repstatuses) {
        $scope.query.reportingStatuses = search.repstatuses.split(',');
      }

      //Catch types
      if (search.catchtypes) {
        $scope.query.catchTypes = search.catchtypes.split(',');
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
        $location.search('entities', $scope.query.fishingCountries.join(','));
      }

      var searchValue;
      //Taxa, commercial groups, functional groups
      switch ($scope.query.catchesBy) {
        case 'taxa':
          searchValue = ($scope.query.taxa && $scope.query.taxa.length > 0) ? $scope.query.taxa.join(',') : null;
          $location.search('taxa', searchValue);
          $location.search('commgroups', null);
          $location.search('funcgroups', null);
          break;
        case 'commercial groups':
          searchValue = ($scope.query.commercialGroups && $scope.query.commercialGroups.length > 0) ? $scope.query.commercialGroups.join(',') : null;
          $location.search('taxa', null);
          $location.search('commgroups', searchValue);
          $location.search('funcgroups', null);
          break;
        case 'functional groups':
          searchValue = ($scope.query.functionalGroups && $scope.query.functionalGroups.length > 0) ? $scope.query.functionalGroups.join(',') : null;
          $location.search('taxa', null);
          $location.search('commgroups', null);
          $location.search('funcgroups', searchValue);
          break;
      }

      //Reporting statuses
      if ($scope.query.reportingStatuses && $scope.query.reportingStatuses.length > 0) {
        $location.search('repstatuses', $scope.query.reportingStatuses.join(','));
      } else {
        $location.search('repstatuses', null);
      }

      //Catch types
      if ($scope.query.catchTypes && $scope.query.catchTypes.length > 0) {
        $location.search('catchtypes', $scope.query.catchTypes.join(','));
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

    var map;
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

