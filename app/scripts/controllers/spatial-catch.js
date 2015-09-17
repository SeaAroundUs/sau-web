'use strict';
/* global d3 */
angular.module('sauWebApp').controller('SpatialCatchMapCtrl',
  function ($scope, fishingCountries, taxa, commercialGroups, functionalGroups, reportingStatuses, catchTypes, sauAPI, colorAssignment, $timeout, $location, $filter, $q, createQueryUrl) {

    $scope.submitQuery = function (query) {
      $scope.lastQuery = angular.copy(query);
      assignColorsToComparees();
      updateUrlFromQuery();
      $scope.loadingText = 'Downloading cells';
      $scope.lastQuerySentence = getQuerySentence(query);
      $scope.catchGraphLinkText = getCatchGraphLinkText(query);
      $scope.catchGraphLink = getCatchGraphLink(query);
      $scope.queryResolved = false;

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

      var promises = [];

      //Make the spatial catch call
      $scope.spatialCatchData = null;
      if (query.fishingCountries && query.fishingCountries.length > 0) {
        $scope.spatialCatchData = sauAPI.SpatialCatchData.get(queryParams);
        promises.push($scope.spatialCatchData.$promise);
      }

      //...Taxon distribution
      if (query.taxonDistribution && query.taxonDistribution.length > 0) {
        for (var i = 0; i < query.taxonDistribution.length; i++) {
          var taxonId = query.taxonDistribution[i];
          var taxonDistributionPromise = sauAPI.TaxonDistribution.get({id: taxonId});
          promises.push(taxonDistributionPromise);
        }
      }

      $q.all(promises).then(drawCellData);
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

    $scope.getAssignedColor = function (id) {
      return colorAssignment.colorOf(id);
    };

    $scope.isQueryValid = function (query) {
      return query && ((query.fishingCountries && query.fishingCountries.length > 0) || (query.taxonDistribution && query.taxonDistribution.length > 0));
    };

    $scope.minCatch = function(comparee) {
      var val = 0;
      if ($scope.spatialCatchData.data) {
        for (var i = 0; i < $scope.spatialCatchData.data.length; i++) {
          if ($scope.spatialCatchData.data[i].rollup_key === ''+comparee) {
            val = $filter('number')(+$scope.spatialCatchData.data[i].min_catch, 0);
            break;
          }
        }
      }

      var strVal = ''+val;
      if (val < 1) {
        strVal = '< 1';
      }
      var units = 't/km²';
      return strVal + ' ' + units;
    };

    $scope.maxCatch = function (comparee) {
      var val = 0;
      if ($scope.spatialCatchData.data) {
        for (var i = 0; i < $scope.spatialCatchData.data.length; i++) {
          if ($scope.spatialCatchData.data[i].rollup_key === ''+comparee) {
            val = $filter('number')(+$scope.spatialCatchData.data[i].max_catch, 0);
            break;
          }
        }
      }

      var strVal = ''+val;
      if (val < 1) {
        strVal = '< 1';
      }
      var units = 't/km²';
      return strVal + ' ' + units;
    };

    $scope.totalCatch = function (comparee) {
      var val = 0;
      if ($scope.spatialCatchData.data) {
        for (var i = 0; i < $scope.spatialCatchData.data.length; i++) {
          if ($scope.spatialCatchData.data[i].rollup_key === ''+comparee) {
            val = $filter('number')(+$scope.spatialCatchData.data[i].total_catch, 0);
            break;
          }
        }
      }

      var units = 'x 10³ t';
      return val + ' ' + units;
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

    $scope.getValueFromObjectArray = function (array, Idkey, IdValue, property) {
      for (var i = 0; i < array.length; i++) {
        if (''+array[i][Idkey] === ''+IdValue) {
          return array[i][property];
        }
      }
      return null;
    };

    $scope.zoomMapIn = function() {
      map.zoomIn();
    };

    $scope.zoomMapOut = function() {
      map.zoomOut();
    };

    function drawCellData(responses) {
      $scope.queryResolved = true;
      $scope.isRendering = true;
      $scope.loadingText = 'Rendering';
      var i, j, cell, color, whiteness;
      //The rendering process locks the CPU for a while, so the $timeout gives us a chance to
      //put up a loading screen.
      $timeout(function() {
        var cellData = new Uint8ClampedArray(1036800); //Number of bytes: columns * rows * 4 (r,g,b,a)

        //Color up the spatial catch data cells
        if ($scope.spatialCatchData === responses[0] && responses[0].data) {
          var spatialCatchResponse = responses[0].data;
          for (i = 0; i < spatialCatchResponse.length; i++) {
            var cellBlob = spatialCatchResponse[i]; //Grouped cells
            color = colorAssignment.getDefaultColor();
            if ($scope.isQueryComparable($scope.lastQuery)) {
              color = colorAssignment.colorOf(cellBlob.rollup_key);
            }
            for (j = 0; j < cellBlob.data.length; j++) {
              var cellSubBlob = cellBlob.data[j]; //Subgroups by threshold
              whiteness = (5 - cellSubBlob.threshold) / 5;
              for (var k = 0; k < cellSubBlob.cells.length; k++) {
                cell = cellSubBlob.cells[k];
                colorCell(cellData, cell, color, whiteness);
              }
            }
          }
        }

        //Color up the taxon distribution cells.
        var taxonDistResponses = responses.slice(responses[0] === $scope.spatialCatchData ? 1 : 0);
        for (i = 0; i < taxonDistResponses.length; i++) {
          var typedArray = new Uint32Array(taxonDistResponses[i].data);
          var taxonId = $scope.lastQuery.taxonDistribution[i];
          for (j=0; j < typedArray.length; j++) {
            var packed = typedArray[j];
            cell = packed & 0xfffff;
            var value = packed >>> 24;
            whiteness = (255 - value) / 255;
            color = colorAssignment.colorOf('#' + taxonId);
            colorCell(cellData, cell, color, whiteness);
          }
        }

        if (map.layers.length === 1) {
          map.setData(cellData, {
            gridSize: [720, 360]
          });
          // swap layers to put data underneath land [SAU-1629]
          var tmp = map.layers[0];
          map.layers[0] = map.layers[1];
          map.layers[1] = tmp;
        } else {
          map.layers[map.layers.length - 2].grid.data = cellData;
          map.draw();
        }
      }, 50).then(function () {
        $scope.isRendering = false;
      });
    }

    function colorCell(cellData, cell, color, whiteness) {
      //Don't use a color blend mode for cell's the first color.
      if (cellData[cell*4 + 3] === 0) {
        cellData[cell*4] = lightenChannel(color[0], whiteness);
        cellData[cell*4 + 1] = lightenChannel(color[1], whiteness);
        cellData[cell*4 + 2] = lightenChannel(color[2], whiteness);
        cellData[cell*4 + 3] = 255;
      //Multiply the colors for layered cells.
      } else {
        cellData[cell*4] = multiplyChannel(lightenChannel(color[0], whiteness), cellData[cell*4]);
        cellData[cell*4 + 1] = multiplyChannel(lightenChannel(color[1], whiteness), cellData[cell*4 + 1]);
        cellData[cell*4 + 2] = multiplyChannel(lightenChannel(color[2], whiteness), cellData[cell*4 + 2]);
        cellData[cell*4 + 3] = 255;
      }
    }

    function multiplyChannel(top, bottom) {
      return ~~(top * bottom / 255);
    }

    function lightenChannel(color, pct) {
      return ~~((255 - color) * pct + color);
    }

    function updateComparableTypeList() {
      $scope.comparableTypes = [allComparableTypes[0]];

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
      var i;
      var colorIds = [];
      //Assign colors to the members of the chosen comparable field.
      if ($scope.isQueryComparable($scope.lastQuery)) {
        var comparees = $scope.getComparees($scope.lastQuery);
        if (comparees) {
          for (i = 0; i < comparees.length; i++) {
            colorIds.push(''+comparees[i]);
          }
        }
      }

      //Assign colors to the various taxa in the taxon distribution.
      if ($scope.lastQuery.taxonDistribution) {
        for (i = 0; i < $scope.lastQuery.taxonDistribution.length; i++) {
          //Using a hash to avoid ID conflicts between taxon distribution and spatial catch distribution.
          colorIds.push('#' + $scope.lastQuery.taxonDistribution[i]);
        }
      }

      colorAssignment.setData(colorIds);
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

      //Taxon distribution
      if (search.dist) {
        $scope.query.taxonDistribution = search.dist.split(',');
      }
    }

    function updateUrlFromQuery() {
      //Fishing countries
      if ($scope.query.fishingCountries && $scope.query.fishingCountries.length > 0) {
        $location.search('entities', $scope.query.fishingCountries.join(','));
      } else {
        $location.search('entities', null);
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

      //Taxon distribution
      if ($scope.query.taxonDistribution && $scope.query.taxonDistribution.length > 0) {
        $location.search('dist', $scope.query.taxonDistribution.join(','));
      } else {
        $location.search('dist', null);
      }

      $location.replace();
    }

    function updateTaxaDisplayName() {
      for (var i = 0; i < $scope.taxa.length; i++) {
        $scope.taxa[i].displayName = $scope.useScientificName ? $scope.taxa[i].scientific_name : $scope.taxa[i].common_name;
      }
    }

    function getQuerySentence (query) {
      //[All, Unreported, Reported, All] [fishing, landings, Discards, (F)fishing ] [<blank>, of Abolones, of 2 taxa, of 2 commercial groups] by the fleets of [Angola, 2 countries] in [year]

      if (!$scope.isQueryValid(query)) {
        return '';
      }

      var sentence = [];

      //A query is still valid if there are no fishing countries, if instead there are taxa distribution parameters set.
      //But then our typical sentence structure doesn't make any sense.
      if (!query.fishingCountries || query.fishingCountries.length === 0) {
        sentence.push('Global distribution of ');
        if (query.taxonDistribution.length === 1) {
          var taxonName = $scope.getValueFromObjectArray($scope.taxa, 'taxon_key', query.taxonDistribution[0], 'common_name');
          sentence.push(taxonName);
        } else {
          sentence.push(query.taxonDistribution.length + ' taxa');
        }
      } else {
        //Reporting status
        if (query.reportingStatuses && query.reportingStatuses.length === 1) {
          var reporingStatusName = $scope.getValueFromObjectArray($scope.reportingStatuses, 'id', query.reportingStatuses[0], 'name');
          sentence.push(reporingStatusName);
        } else {
          sentence.push('All');
        }

        //Catch type
        if (query.catchTypes && query.catchTypes.length === 1) {
          var catchTypeName = $scope.getValueFromObjectArray($scope.catchTypes, 'id', query.catchTypes[0], 'name');
          sentence.push(catchTypeName.toLowerCase());
        } else {
          sentence.push('fishing');
        }

        //Catches by
        if (query.catchesBy === 'taxa') {
          if (query.taxa && query.taxa.length === 1) {
            var taxaName = $scope.getValueFromObjectArray($scope.taxa, 'taxon_key', query.taxa[0], 'common_name');
            sentence.push('of ' + taxaName.toLowerCase());
          } else if (query.taxa && query.taxa.length > 1) {
            sentence.push('of ' + query.taxa.length + ' taxa');
          }
        } else if (query.catchesBy === 'commercial groups') {
          if (query.commercialGroups && query.commercialGroups.length === 1) {
            var commercialGroupName = $scope.getValueFromObjectArray($scope.commercialGroups, 'commercial_group_id', query.commercialGroups[0], 'name');
            sentence.push('of ' + commercialGroupName.toLowerCase());
          } else if (query.commercialGroups && query.commercialGroups.length > 1) {
            sentence.push('of ' + query.commercialGroups.length + ' commercial groups');
          }
        } else if (query.catchesBy === 'functional groups') {
          if (query.functionalGroups && query.functionalGroups.length === 1) {
            var functionalGroupName = $scope.getValueFromObjectArray($scope.functionalGroups, 'functional_group_id', query.functionalGroups[0], 'description');
            sentence.push('of ' + functionalGroupName.toLowerCase());
          } else if (query.functionalGroups && query.functionalGroups.length > 1) {
            sentence.push('of ' + query.functionalGroups.length + ' functional groups');
          }
        }

        //Fishing countries
        if (query.fishingCountries.length === 1) {
          var countryName = $scope.getValueFromObjectArray($scope.fishingCountries, 'id', query.fishingCountries[0], 'title');
          sentence.push('by the fleets of ' + countryName);
        } else {
          sentence.push('by the fleets of ' + query.fishingCountries.length + ' countries');
        }

        //Year
        sentence.push('in ' + (query.year || 2010));
      }

      return sentence.join(' ');
    }

    function getCatchGraphLinkText (query) {
      if (!query.fishingCountries || query.fishingCountries.length === 0) {
        return null;
      }

      var text = 'View graph of catches by ' + query.catchesBy + ' by the fleets of ';
      if (query.fishingCountries.length === 1) {
        text += $scope.getValueFromObjectArray($scope.fishingCountries, 'id', query.fishingCountries[0], 'title');
      } else {
        text += 'the selected countries';
      }

      return text + '.';
    }

    function getCatchGraphLink (query) {
      if (!query.fishingCountries || query.fishingCountries.length === 0) {
        return null;
      }

      var graphDimension = 'taxon';
      if (query.catchesBy === 'commercial groups') {
        graphDimension = 'commercialgroup';
      } else if (query.catchesBy === 'functional groups') {
        graphDimension = 'functionalgroup';
      }

      //Update the variables that configure the search query.
      var urlConfig = {
        regionType: 'fishing-entity',
        measure: 'tonnage',
        dimension: graphDimension,
        limit: '10',
        useScientificName: $scope.useScientificName,
        regionIds: query.fishingCountries
      };
      return '#' + createQueryUrl.forRegionCatchChart(urlConfig);
    }

    //Resolved service responses
    $scope.fishingCountries = fishingCountries.data;
    $scope.taxa = taxa.data;
    $scope.commercialGroups = commercialGroups.data;
    $scope.functionalGroups = functionalGroups.data;
    $scope.reportingStatuses = reportingStatuses;
    $scope.catchTypes = catchTypes;
    $scope.defaultColor = colorAssignment.getDefaultColor();
    $scope.useScientificName = false;

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
    $scope.$watch('useScientificName', updateTaxaDisplayName);
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
        entityName: 'displayName',
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
      map = new d3.geo.GridMap('#cell-map', {
        seaColor: 'rgba(181, 224, 249, 1)',
        graticuleColor: 'rgba(255, 255, 255, 0.3)',
        disableMouseZoom: true
      });

      map.setData(countries, {
        fillColor: 'rgba(251, 250, 243, 1)',
        strokeColor: 'rgba(0, 0, 0, 0)'
      });
    });

    updateQueryFromUrl();

    //Boostrap the initial query if there are query params in the URL when the page loads.
    if ($scope.isQueryValid($scope.query)) {
      $scope.submitQuery($scope.query);
    }
  });