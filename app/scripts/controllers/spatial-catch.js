'use strict';

/* global d3 */

angular.module('sauWebApp').controller('SpatialCatchMapCtrl',
  function ($scope, fishingCountries, taxa, commercialGroups, functionalGroups, sauAPI, colorAssignment, $timeout, $location, $filter, $q, createQueryUrl, eezSpatialData, SAU_CONFIG, ga, spatialCatchExamples, reportingStatuses, catchTypes, spatialCatchCache) {

    //////////////////////////////////////////////////////
    //SCOPE METHODS
    //////////////////////////////////////////////////////
    $scope.submitQuery = function (query) {
      cache.invalidate();
      numQueriesMade++;
      $scope.lastQuery = angular.copy(query);
      updateUrlFromQuery();
      $scope.queryResponseErrorMessage = null;
      $scope.lastQuerySentence = getQuerySentence(query);
      $scope.catchGraphLinkText = getCatchGraphLinkText(query);
      $scope.catchGraphLink = getCatchGraphLink(query);

      $scope.loadingText = 'Downloading cells';
      $scope.queryResolved = false;

      //Form the query...
      var queryParams = {format: 'binary'};
      var gaAction = ['query'];

      //...Fishing countries
      if (query.fishingCountries && query.fishingCountries.length > 0) {
        queryParams.entities = query.fishingCountries.join(',');

        //Form GA event action
        if (query.fishingCountries.length > 1) {
          gaAction.push(['multi-entity']);
        } else {
          gaAction.push(['single-entity']);
        }
      }

      switch (query.catchesBy) {
        //...Taxa
        case 'taxa':
          if (query.taxa) {
            queryParams.taxa = query.taxa.join(',');

            //Form GA event action
            if (query.taxa.length > 1) {
              gaAction.push(['multi-taxa']);
            } else {
              gaAction.push(['single-taxa']);
            }
          }
          break;
        //...Commercial groups
        case 'commercial groups':
          if (query.commercialGroups) {
            queryParams.commgroups = query.commercialGroups.join(',');

            //Form GA event action
            if (query.commercialGroups.length > 1) {
              gaAction.push(['multi-commgroup']);
            } else {
              gaAction.push(['single-commgroup']);
            }
          }
          break;
        //...Functional groups
        case 'functional groups':
          if (query.functionalGroups) {
            queryParams.funcgroups = query.functionalGroups.join(',');

            //Form GA event action
            if (query.functionalGroups.length > 1) {
              gaAction.push(['multi-funcgroup']);
            } else {
              gaAction.push(['single-funcgroup']);
            }
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

      var promises = [];

      //Make the spatial catch call for each year.
      if ($scope.isAllocationQueryValid($scope.lastQuery)) {

        var visibleYear = query.year;
        queryParams.year = visibleYear;
        var catchResponseCallback = processCatchResponse(visibleYear, numQueriesMade);
        var catchResponse = sauAPI.SpatialCatchData.get(queryParams).then(catchResponseCallback);
        promises.push(catchResponse);

        for (var currYear = firstYearOfData; currYear <= lastYearOfData; currYear++) {
          if (currYear === visibleYear) {
            continue;
          }
          catchResponseCallback = processCatchResponse(currYear, numQueriesMade);
          queryParams.year = currYear;
          catchResponse = sauAPI.SpatialCatchData.get(queryParams).then(catchResponseCallback);
          promises.push(catchResponse);
        }
      }

      //...Taxon distribution call
      /*if ($scope.isDistributionQueryValid($scope.lastQuery)) {
        for (var i = 0; i < query.taxonDistribution.length; i++) {
          var taxonId = query.taxonDistribution[i];
          var taxonDistributionPromise = sauAPI.TaxonDistribution.get({id: taxonId});
          promises.push(taxonDistributionPromise);
        }
      }*/

      lastAllQueryPromise = $q.all(promises);
      lastAllQueryPromise.then(processAllCatchResponses(numQueriesMade));

      //Google Analytics Event
      ga.sendEvent({
        category: 'Mapped Catch',
        action: gaAction.join(' '),
        label: $location.url()
      });
    };

    //Return true if any data except the year is different.
    //Returns false if all data is the same, or just the year is different.
    $scope.isQueryEqual = function(q1, q2) {
      return angular.equals(q1, q2);
    };

    /*$scope.getAssignedColor = function (id) {
      return colorAssignment.colorOf(id);
    };*/

    $scope.isAllocationQueryValid = function(query) {
      var hasFishingCountryInput = query && query.fishingCountries && query.fishingCountries.length > 0;

      var hasCatchesByInput = false;
      switch ($scope.query.catchesBy) {
        case 'taxa':
          if (query.taxa && query.taxa.length > 0) {
            hasCatchesByInput = true;
          }
          break;
        case 'commercial groups':
          if (query.commercialGroups && query.commercialGroups.length > 0) {
            hasCatchesByInput = true;
          }
          break;
        case 'functional groups':
          if (query.functionalGroups && query.functionalGroups.length > 0) {
            hasCatchesByInput = true;
          }
          break;
      }

      return hasFishingCountryInput || hasCatchesByInput;
    };

    /*$scope.isDistributionQueryValid = function(query) {
      return query.taxonDistribution && query.taxonDistribution.length > 0;
    };*/

    $scope.isQueryValid = function (query) {
      //return $scope.isAllocationQueryValid(query) || $scope.isDistributionQueryValid(query);
      return $scope.isAllocationQueryValid(query);
    };

    $scope.minCatch = function() {
      var val = 0;
      var units = 't/km²';
      return val + ' ' + units;
    };

    $scope.maxCatch = function () {
      var val = 0;
      var units = 't/km²';
      return val + ' ' + units;
    };

    $scope.totalCatch = function () {
      var val = 0;
      var units = 'x 10³ t';
      return val + ' ' + units;
    };

    //MIGHT GET TO DELETE THIS
    $scope.boundaryLabels = function () {
      return '';
    };

    $scope.zoomMapIn = function() {
      //Google Analytics Event
      ga.sendEvent({
        category: 'Mapped Catch',
        action: 'zoom',
        label: 'in'
      });

      map.zoomIn();
    };

    $scope.zoomMapOut = function() {
      //Google Analytics Event
      ga.sendEvent({
        category: 'Mapped Catch',
        action: 'zoom',
        label: 'out'
      });

      map.zoomOut();
    };

    $scope.updateQueryWithExample = function (example) {
      $scope.query = angular.extend($scope.query, example);

      //Submit the query
      if ($scope.isQueryValid($scope.query)) {
        $scope.submitQuery($scope.query);
      }
    };

    $scope.onTimelineRelease = function () {
      /*if ($scope.isQueryValid($scope.query)) {
        $scope.submitQuery($scope.query);
      }*/
    };

    //////////////////////////////////////////////////////
    //PRIVATE METHODS
    //////////////////////////////////////////////////////
    function processCatchResponse (year, queryIndex) {
      return function (response) {
        if (queryIndex < numQueriesMade) {
          return;
        }
        var layerData = transformCatchResponse(response.data);

        var layer = cache.getLayer(year);
        if (layer) {
          layer.grid.data = layerData;
        } else {
          layer = map.addLayer(layerData, {
            gridSize: [720, 360],
            renderOnAnimate: false,
            zIndex: year - firstYearOfData,
            renderOnAdd: false
          });
        }

        if (cache.currentYear() !== year) {
          layer.hide();
        } else {
          layer.show();
          layer.draw();
        }

        cache.put(year, layer);
      };
    }

    function transformCatchResponse(response) {
      return new Float32Array(response);
    }

    function processAllCatchResponses(queryIndex) {
      return function(response) {
        if (queryIndex < numQueriesMade) {
          return;
        }
        $scope.queryResolved = true;
      };
    }

    /*function processAllCatchResponses(responses) {
      //This checks to see if an older query resolved after a newer query,
      //in which case we should just throw it out.
      if (responses !== lastAllQueryPromise.$$state.value) {
        return;
      }
      lastAllQueryPromise = null;

      $scope.queryResolved = true;
      $scope.isRendering = true;
      $scope.loadingText = 'Rendering';
      var i, j, cell, color, whiteness, errorMessage;
      //The rendering process locks the CPU for a while, so the $timeout gives us a chance to
      //put up a loading screen.
      $timeout(function() {
        var cellData = new Uint8ClampedArray(1036800); //Number of bytes: columns * rows * 4 (r,g,b,a)
        var catchResponse = lastCatchQueryResponse ? responses[0] : null;
        //var distResponses = responses.slice(catchResponse ? 1 : 0);
        var isValidCatchResponse = catchResponse && catchResponse.data && catchResponse.data.rollup;
        var legendDataCache = {};
        //PROCESS THE CATCH RESPONSE

        //Error message for no data
        if (catchResponse && !isValidCatchResponse) {
          $scope.queryResponseErrorMessage = 'No map catch allocation data currently exists for your query. ';
        }

        //Process the catch response.
        if (isValidCatchResponse) {
          //Parse the data into a cell array.
          var groups = catchResponse.data.rollup;
          for (i = 0; i < groups.length; i++) {
            var cellBlob = groups[i]; //Grouped cells
            legendDataCache[cellBlob.rollup_key] = {
              minCatch: catchResponse.data.min_catch,
              maxCatch: catchResponse.data.max_catch,
              totalCatch: cellBlob.total_catch,
              bucketBoundaryLabels: createBucketBoundaryLabels(catchResponse.data.bucket_boundaries)
            };
            color = colorAssignment.getDefaultColor();
            for (j = 0; j < cellBlob.data.length; j++) {
              var cellSubBlob = cellBlob.data[j]; //Subgroups by threshold
              whiteness = ($scope.lastQuery.bucketCount - cellSubBlob.threshold) / $scope.lastQuery.bucketCount;
              for (var k = 0; k < cellSubBlob.cells.length; k++) {
                cell = cellSubBlob.cells[k];
                colorCell(cellData, cell, color, whiteness);
              }
            }
          }

          var cacheIndex = getTimelineCacheIndex($scope.lastQuery.year);
          if (timelineCache[cacheIndex]) {
            timelineCache[cacheIndex].layer.grid.data = cellData;
          } else {
            timelineCache[cacheIndex] = {};
            timelineCache[cacheIndex].layer = map.addLayer(cellData, {
              gridSize: [720, 360],
              renderOnAnimate: false,
              zIndex: cacheIndex
            });

            if (currTimelineCacheIndex !== cacheIndex) {
              timelineCache[cacheIndex].layer.hide();
            }
          }
          timelineCache[cacheIndex].isValid = true;
          timelineCache[cacheIndex].layer.draw();

          //Cache the data that drives the legend so we can re-render it while dragging the timeline.
          timelineCache[cacheIndex].catchLegend = legendDataCache;
        }

        //PROCESS THE DISTRIBUTION RESPONSE

        if (distResponses.length === 0) {
          var datalessTaxaNames = [];
          for (i = 0; i < distResponses.length; i++) {
            //Taxa distribution responses that have no data are noted in this array so that we can throw an error message to the user.
            var taxonId = $scope.lastQuery.taxonDistribution[i];
            var isValidDistResponse = distResponses[i].data && distResponses[i].data.byteLength !== 0
            if (!isValidDistResponse) {
              datalessTaxaNames.push($scope.taxa.find('common_name', taxonId));
              continue;
            }


            var typedArray = new Uint32Array(distResponses[i].data);
            for (j=0; j < typedArray.length; j++) {
              var packed = typedArray[j];
              cell = packed & 0xfffff;
              var value = packed >>> 24;
              whiteness = (255 - value) / 255 * 0.8;
              color = colorAssignment.colorOf('#' + taxonId);
              colorCell(cellData, cell, color, whiteness);
            }
          }

          //Update an error message to the user.
          if (datalessTaxaNames.length > 0) {
            errorMessage = ($scope.queryResponseErrorMessage ? $scope.queryResponseErrorMessage + '<br />' : '') +
              'No distribution data currently exists for some taxa in your query ' +
              '(' + datalessTaxaNames.join(', ') + ').';
            $scope.queryResponseErrorMessage = errorMessage;
          }
        }

        $scope.isRendering = false;
      }, 120);
    }*/

    /*function colorCell(cellData, cell, color, whiteness) {
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
    }*/

    /*function multiplyChannel(top, bottom) {
      return ~~(top * bottom / 255);
    }*/

    /*function lightenChannel(color, pct) {
      return ~~((255 - color) * pct + color);
    }*/

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
      $scope.query.year = Math.min(Math.max(+search.year || lastYearOfData, firstYearOfData), lastYearOfData); //Clamp(year, 1950, 2010). Why does JS not have a clamp function?

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

      //Reporting Statuses
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
      var queryYear = $scope.query.year || lastYearOfData;
      if (queryYear !== lastYearOfData) {
        $location.search('year', queryYear);
      } else {
        $location.search('year', null);
      }

      //Taxon distribution
      if ($scope.query.taxonDistribution && $scope.query.taxonDistribution.length > 0) {
        $location.search('dist', $scope.query.taxonDistribution.join(','));
      } else {
        $location.search('dist', null);
      }

      $location.replace();
    }

    function getQuerySentence (query) {
      //[All, Unreported, Reported, All] [fishing, landings, Discards, (F)fishing ] [<blank>, of Abolones, of 2 taxa, of 2 commercial groups] by the fleets of [Angola, 2 countries] in [year]

      if (!$scope.isQueryValid(query)) {
        return '';
      }

      var sentence = [];

      //A query is still valid if there are no fishing countries or taxa selected, if instead there are taxa distribution parameters set.
      //But then our typical sentence structure doesn't make any sense.
      if ($scope.isAllocationQueryValid(query) === false && $scope.isDistributionQueryValid(query)) {
        sentence.push('Global distribution of ');
        if (query.taxonDistribution.length === 1) {
          var taxonName = $scope.taxa.find('common_name', query.taxonDistribution[0]);
          sentence.push(taxonName);
        } else {
          sentence.push(query.taxonDistribution.length + ' taxa');
        }
      } else {
        //Reporting status
        if (query.reportingStatuses && query.reportingStatuses.length === 1) {
          var reportingStatusName = $scope.reportingStatuses.find('name', query.reportingStatuses[0]);
          sentence.push(reportingStatusName);
        } else {
          sentence.push('All');
        }

        //Catch type
        if (query.catchTypes && query.catchTypes.length === 1) {
          var catchTypeName = $scope.catchTypes.find('name', query.catchTypes[0]);
          sentence.push(catchTypeName.toLowerCase());
        } else {
          sentence.push('fishing');
        }

        //Catches by
        if (query.catchesBy === 'taxa') {
          if (query.taxa && query.taxa.length === 1) {
            var taxaName = $scope.taxa.find('common_name', query.taxa[0]);
            sentence.push('of ' + taxaName.toLowerCase());
          } else if (query.taxa && query.taxa.length > 1) {
            sentence.push('of ' + query.taxa.length + ' taxa');
          }
        } else if (query.catchesBy === 'commercial groups') {
          if (query.commercialGroups && query.commercialGroups.length === 1) {
            var commercialGroupName = $scope.commercialGroups.find('name', query.commercialGroups[0]);
            sentence.push('of ' + commercialGroupName.toLowerCase());
          } else if (query.commercialGroups && query.commercialGroups.length > 1) {
            sentence.push('of ' + query.commercialGroups.length + ' commercial groups');
          }
        } else if (query.catchesBy === 'functional groups') {
          if (query.functionalGroups && query.functionalGroups.length === 1) {
            var functionalGroupName = $scope.functionalGroups.find('description', query.functionalGroups[0]);
            sentence.push('of ' + functionalGroupName.toLowerCase());
          } else if (query.functionalGroups && query.functionalGroups.length > 1) {
            sentence.push('of ' + query.functionalGroups.length + ' functional groups');
          }
        }

        //Fishing countries
        if (query.fishingCountries && query.fishingCountries.length > 0) {
          if (query.fishingCountries.length === 1) {
            var countryName = $scope.fishingCountries.find('title', query.fishingCountries[0]);
            sentence.push('by the fleets of ' + countryName);
          } else {
            sentence.push('by the fleets of ' + query.fishingCountries.length + ' countries');
          }
        }

        //Year
        sentence.push('in ' + (query.year || lastYearOfData));
      }

      return sentence.join(' ');
    }

    function getCatchGraphLinkText (query) {
      if (!query.fishingCountries || query.fishingCountries.length === 0) {
        return null;
      }

      var text = 'View graph of catches by ' + query.catchesBy + ' by the fleets of ';
      if (query.fishingCountries.length === 1) {
        text += $scope.fishingCountries.find('title', query.fishingCountries[0]);
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
        regionIds: query.fishingCountries
      };
      return '#' + createQueryUrl.forRegionCatchChart(urlConfig);
    }

    /*function getBucketsOfCell(cellId) {
      if (!$scope.spatialCatchData || !$scope.spatialCatchData.data || !$scope.spatialCatchData.data.rollup) {
        return {};
      }
      var buckets = {}; //array of buckets by compareeId: buckets[compareeId] = 4;
      var groups = $scope.spatialCatchData.data.rollup;

      for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        var groupId = group.rollup_key || 'default';
        buckets[groupId] = [];
        for (var j = 0; j < group.data.length; j++) {
          var threshold = group.data[j];
          for (var k = 0; k < threshold.cells.length; k++) {
            var cell = threshold.cells[k];
            if (cell === cellId) {
              buckets[groupId] = threshold.threshold - 1;
            }
          }
        }
      }

      return buckets;
    }*/

    /*function createBucketBoundaryLabels (boundaries) {
      var boundaryLabels = new Array(boundaries.length - 1);

      for (var i = 0; i < boundaries.length - 1; i++) {
        //Each boundary label looks something like this: "8.3e-11 to 2.6e-3 t/km²"
        boundaryLabels[i] = boundaries[i].toExponential(1) + ' to ' + boundaries[i + 1].toExponential(1) + ' t/km²';
      }

      return boundaryLabels;
    }*/

    function updateYearLayerVisibility() {
      //Hide the old grid layer so that only one is showing at a time.
      if (cache.getLayer()) {
        cache.getLayer().hide();
      }

      cache.currentYear($scope.query.year);

      //Show the new grid layer.
      if (cache.isCurrentYearValid()) {
        cache.getLayer().show();
        cache.getLayer().draw(); //This call shouldn't need to be done by the application, it should be done in the library.
        $scope.lastQuerySentence = getQuerySentence($scope.query);
      }
    }

    //Assign the return value of this function to a function on an array of objects.
    //Pass it the 'key' of the objects, then you can use your new function to query for a value by ID.
    //
    // var people = [person1, person2];
    // people.find = makeArrayQueryable('ssn');
    // people.find('name', '111-11-1111');
    function makeArrayQueryable(key) {
      return function (select, value) {
        for (var i = 0; i < this.length; i++) {
          if (''+this[i][key] === ''+value) {
            return this[i][select];
          }
        }
        return null;
      };
    }

    //////////////////////////////////////////////////////
    //SCOPE VARS
    //////////////////////////////////////////////////////
    $scope.fishingCountries = fishingCountries.data;
    $scope.fishingCountries.find = makeArrayQueryable('id');

    $scope.taxa = taxa.data;
    $scope.taxa.find = makeArrayQueryable('taxon_key');
    for (var i = 0; i < $scope.taxa.length; i++) {
      $scope.taxa[i].displayName = $scope.taxa[i].common_name + ' (' + $scope.taxa[i].scientific_name + ')';
    }

    $scope.commercialGroups = commercialGroups.data;
    $scope.commercialGroups.find = makeArrayQueryable('commercial_group_id');

    $scope.functionalGroups = functionalGroups.data;
    $scope.functionalGroups.find = makeArrayQueryable('functional_group_id');

    $scope.reportingStatuses = reportingStatuses;
    $scope.reportingStatuses.find = makeArrayQueryable('id');

    $scope.catchTypes = catchTypes;
    $scope.catchTypes.find = makeArrayQueryable('id');

    $scope.mappedCatchExamples = spatialCatchExamples;

    $scope.defaultColor = colorAssignment.getDefaultColor();
    //SAU_CONFIG.env = 'stage'; //Used to fake the staging environment.
    $scope.inProd = SAU_CONFIG.env === 'stage' || SAU_CONFIG.env === 'prod';
    $scope.query = {};

    //////////////////////////////////////////////////////
    //WATCHERS
    //////////////////////////////////////////////////////
    $scope.$watch('query.year', updateYearLayerVisibility);
    $scope.$on('$destroy', $scope.$on('$locationChangeSuccess', updateQueryFromUrl));

    //////////////////////////////////////////////////////
    //LOCAL VARS
    //////////////////////////////////////////////////////
    var map;
    var firstYearOfData = 1950; //Dynamic later.
    var lastYearOfData = 2010; //Dynamic later.
    var cache = spatialCatchCache.init(firstYearOfData, lastYearOfData);
    var lastAllQueryPromise;
    //var lastCatchQueryResponse;
    var numQueriesMade = 0; //Used to tell a query response if it's old and outdated.

    //////////////////////////////////////////////////////
    //KICKING THINGS OFF
    //////////////////////////////////////////////////////
    colorAssignment.setData([0]);
    d3.json('countries.topojson', function(error, countries) {
      map = new d3.geo.GridMap('#cell-map', {
        seaColor: 'rgba(181, 224, 249, 1)',
        graticuleColor: 'rgba(255, 255, 255, 0.3)',
        disableMouseZoom: true,
        onCellHover: function (cell, cellId) {
          $scope.cellValue = cell.toExponential(1);
        }
      });

      map.addLayer(eezSpatialData.data, {
        fillColor: 'rgba(0, 117, 187, 0)',
        strokeColor: 'rgba(0, 117, 187, 1)',
        renderOnAnimate: false,
        zIndex: 99 //Ensure this layer is far above all of the grid layers. There could be one-per-year.
      });

      map.addLayer(countries, {
        fillColor: 'rgba(251, 250, 243, 1)',
        strokeColor: 'rgba(0, 0, 0, 0)',
        zIndex: 100 ////Ensure this layer is far above all of the grid layers. There could be one-per-year.
      });
    });

    updateQueryFromUrl();

    //Boostrap the initial query if there are query params in the URL when the page loads.
    if ($scope.isQueryValid($scope.query)) {
      $scope.submitQuery($scope.query);
    }
  })

  /*
  *
  *
  *
  *
  */
  .factory('spatialCatchCache', function() {

    var cache = [];
    cache.init = function (firstYear, lastYear) {
      this._firstYear = firstYear;
      this._currentYear = this._lastYear = lastYear;
      return this;
    };

    cache.currentYear = function (year) {
      if (typeof year === 'undefined') {
        return this._currentYear;
      } else {
        this._currentYear = year;
      }
    };

    cache.getLayer = function(year) {
      if (typeof year === 'undefined') {
        year = this.currentYear();
      }
      var index = year - this._firstYear;
      return this[index] ? this[index].layer : null;
    };

    cache.isCurrentYearValid = function () {
      var index = this.currentYear() - this._firstYear;
      return this[index] && this[index].isValid;
    };

    cache.put = function (year, layer) {
      var index = year - this._firstYear; //Convert the year to an index.
      if (!this[index]) {
        this[index] = {};
      }
      this[index].layer = layer;
      this[index].isValid = true;
    };

    cache.invalidate = function() {
      for (var i = 0; i < this.length; i++) {
        this[i].isValid = false;
      }
    };

    return cache;
  });
