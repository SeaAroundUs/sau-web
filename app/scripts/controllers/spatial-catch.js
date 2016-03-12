'use strict';

/* global d3 */
/* global gju */

angular.module('sauWebApp').controller('SpatialCatchMapCtrl',
  function ($scope, fishingCountries, taxa, commercialGroups, functionalGroups, sauAPI, $timeout, $location, $filter, $q, createQueryUrl, eezSpatialData, SAU_CONFIG, ga, spatialCatchExamples, reportingStatuses, catchTypes, toggles, spatialCatchThemes, makeCatchMapScale, Keychain, $route, $sce) {
    //SAU_CONFIG.env = 'stage'; //Used to fake the staging environment.

    //////////////////////////////////////////////////////
    //SCOPE METHODS
    //////////////////////////////////////////////////////
    $scope.submitQuery = function (query, visibleYear) {
      if ($scope.visibleForm === 0) {
        clearDistributionParams(query);
      } else if ($scope.visibleForm === 1) {
        clearAllocationQueryParams(query);
      }
      clearGrid();
      $scope.queryFailed = false;
      $scope.loadingProgress = 0;
      numQueriesMade++;
      $scope.lastQuery = angular.copy(query);
      $scope.currentYear = visibleYear || null;
      updateUrlFromQuery();
      $scope.queryResponseErrorMessage = null;
      $scope.lastQuerySentence = $sce.trustAsHtml(getQuerySentence(query, visibleYear));
      $scope.catchGraphLinkText = getCatchGraphLinkText(query);
      $scope.catchGraphLink = getCatchGraphLink(query);
      $scope.oceanLegendLabel = getOceanLegendLabel(query);
      $scope.loadingText = 'Downloading cells';
      $scope.queryResolved = false;

      var gaAction = ['query'];

      if ($scope.visibleForm === 0) {
        //Form the query...
        var queryParams = {format: 'binary', buckets: 7};

        //...Fishing countries
        if (query.isFilteredBy('fishingCountries')) {
          queryParams.entities = query.fishingCountries.join(',');
          //Form GA event action
          if (query.fishingCountries.length > 1) {
            gaAction.push(['multi-entity']);
          } else {
            gaAction.push(['single-entity']);
          }
        } else {
          gaAction.push(['global-entity']);
        }

        switch (query.catchesBy) {
          //...Taxa
          case 'taxa':
            if (query.isFilteredBy('taxa')) {
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
            if (query.isFilteredBy('commercialGroups')) {
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
            if (query.isFilteredBy('functionalGroups')) {
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

        if ($scope.isAllocationQueryValid($scope.lastQuery)) {
          //Request data about the grid scale, relative to all years.
          queryParams.stats = true;
          var scaleQuery = sauAPI.SpatialCatchData.get(queryParams);
          scaleQuery.then(makeCancellableCallback(numQueriesMade, function requestMapScale(response) {
            $scope.boundaries = response.data.data.quantiles;
            $scope.minCatch = $scope.boundaries[0];
            $scope.maxCatch = $scope.boundaries[$scope.boundaries.length - 1];
            $scope.totalCatch.setAllYears(response.data.data.total_catch);
            $scope.lastQuerySentence = getQuerySentence(query, visibleYear);
            map.colorScale = makeCatchMapScale($scope.boundaries, $scope.themes.current().scale.slice()); //Maps cell values to their colors on a rainbow color range.

            //Request the current year so that the user can look at it while the other years are loading.
            queryParams.year = visibleYear;
            delete queryParams.stats;
            return sauAPI.SpatialCatchData.get(queryParams);
          }))
          //Process visible year response
          .then(makeCancellableCallback(numQueriesMade, function processCurrYear(currYearResponse) {

            $scope.queryResolved = true;
            $scope.loadingProgress = 1;

            //Rendering the visible year is main-thread-blocking, so we delay it a bit to make sure that the
            //mega array request gets fired first.
            $timeout(function makeFirstYearLayer() {
              var layerData = transformCatchResponse(currYearResponse.data);
              makeGridLayer(layerData, visibleYear);
            }, 100);

            //Request all years.
            delete queryParams.year;
            return sauAPI.SpatialCatchData.get(queryParams);
          }))
          //Process all years
          .then(makeCancellableCallback(numQueriesMade, function processAllYears(allYearsResponse) {
            var superGridData = transformCatchResponse(allYearsResponse.data);

            //Creates a histogram of the cells in the buckets, used for debugging.
            /*var buckets = [0, 0, 0, 0, 0, 0, 0];
            for (var i = 0; i < superGridData.length; i++) {
              if (isNaN(superGridData[i])) {
                continue;
              }
              buckets[map.colorScale.getQuantile(superGridData[i])]++;
            }
            debugger;*/

            //Makes a grid layer for each year. NOTE: VERY SLOW
            forEachYear(function makeAllGrids(currYear, yearIndex) {
              if (currYear === visibleYear) {
                return;
              }
              var bufferOffsetForYear = yearIndex * numCellsInGrid * Float32Array.BYTES_PER_ELEMENT;
              var gridDataForYear = new Float32Array(superGridData.buffer, bufferOffsetForYear, numCellsInGrid);
              makeGridLayer(gridDataForYear, currYear);
            });
          }))
          .catch(makeCancellableCallback(numQueriesMade, function notifyFailedQuery() {
            $scope.queryFailed = true;
            console.log('query failed.');
          }));

        }

        //Google Analytics Event
        ga.sendEvent({
          category: 'Mapped Catch',
          action: gaAction.join(' '),
          label: $location.url()
        });
      //MAKE DISTRIBUTION QUERY
      } else if ($scope.visibleForm === 1) {

        var taxonDistQuery = sauAPI.TaxonDistribution.get({id: query.taxonDistribution[0]});
        taxonDistQuery.then(makeCancellableCallback(numQueriesMade, function processDistributionResponse(response) {
          $scope.queryResolved = true;
          $scope.loadingProgress = 1;

          //Make sure the data is valid.
          if (!response.data || response.data.byteLength === 0) {
            throw 'Distribution query data is bad or empty.';
          } else {
            //$scope.boundaries = [0, 1, 2, 3, 4, 5, 6, 7];
            $scope.minCatch = 'Thin';
            $scope.maxCatch = 'Dense';
            //$scope.totalCatch.setAllYears(response.data.data.total_catch);
            map.colorScale = makeCatchMapScale([0, 1/7*255, 2/7*255, 3/7*255, 4/7*255, 5/7*255, 6/7*255, 255], $scope.themes.current().scale.slice()); //Maps cell values to their colors on a rainbow color range.
            response = transformCatchResponse(response.data);
            //Creates a histogram of the cells in the buckets, used for debugging.
            /*var buckets = [0, 0, 0, 0, 0, 0, 0];
            for (var i = 0; i < response.length; i++) {
              if (isNaN(response[i])) {
                continue;
              }
              buckets[map.colorScale.getQuantile(response[i])]++;
            }
            debugger;*/
            makeGridLayer(response);
          }
        }))
        .catch(makeCancellableCallback(numQueriesMade, function notifyFailedQuery() {
          $scope.queryFailed = true;
          console.log('distribution query failed.');
        }));
      }
    };

    //Return true if any data except the year is different.
    //Returns false if all data is the same, or just the year is different.
    $scope.isQueryEqual = function(q1, q2) {
      return angular.equals(q1, q2);
    };

    $scope.isAllocationQueryValid = function(query) {
      if (toggles.isEnabled('global')) {
        return true;
      }

      var hasFishingCountryInput = query && query.isFilteredBy('fishingCountries');

      var hasCatchesByInput = false;
      switch ($scope.query.catchesBy) {
        case 'taxa':
          if (query.isFilteredBy('taxa')) {
            hasCatchesByInput = true;
          }
          break;
        case 'commercial groups':
          if (query.isFilteredBy('commercialGroups')) {
            hasCatchesByInput = true;
          }
          break;
        case 'functional groups':
          if (query.isFilteredBy('functionalGroups')) {
            hasCatchesByInput = true;
          }
          break;
      }

      return hasFishingCountryInput || hasCatchesByInput;
    };

    $scope.isDistributionQueryValid = function(query) {
      return query.taxonDistribution && query.taxonDistribution.length > 0 ? true : false;
    };

    $scope.isQueryValid = function (query) {
      return ($scope.visibleForm === 0 && $scope.isAllocationQueryValid(query)) ||
      ($scope.visibleForm && $scope.isDistributionQueryValid(query));
    };

    $scope.zoomMapIn = function() {
      //Google Analytics Event
      ga.sendEvent({
        category: 'Mapped Catch',
        action: 'zoom',
        label: 'in'
      });

      $scope.loadingText = 'Rendering...';
      $scope.isRendering = true;
      $timeout(map.zoomIn, 100);
    };

    $scope.zoomMapOut = function() {
      //Google Analytics Event
      ga.sendEvent({
        category: 'Mapped Catch',
        action: 'zoom',
        label: 'out'
      });

      $scope.loadingText = 'Rendering...';
      $scope.isRendering = true;
      $timeout(map.zoomOut, 100);
    };

    $scope.updateQueryWithExample = function (example) {
      $scope.query = angular.extend($scope.query, example);

      $scope.visibleForm = $scope.isDistributionQueryValid($scope.query) ? 1 : 0;

      //Submit the query
      if ($scope.isQueryValid($scope.query)) {
        $scope.submitQuery($scope.query, example.year);
      }
    };

    $scope.onTimelineRelease = function () {
      /*if ($scope.isQueryValid($scope.query)) {
        $scope.submitQuery($scope.query);
      }*/
    };

    $scope.currentYearHasGrid = function () {
      if (map && map.layers.length < 10) {
        return true;
      }
      return gridLayers.forYear($scope.currentYear) ? true : false;
    };

    /**
    Toggles the visibility of the allocation/distribution forms
    so that only one shows at a time.
    **/
    $scope.toggleFormVisibility = function () {
      $scope.visibleForm = ($scope.visibleForm === 0) ? 1 : 0;
      //Tell form children to refresh their views because they're going from shown to hidden or vice versa.
      $scope.$broadcast('toggleFormVis', $scope.visibleForm);
    };

    //////////////////////////////////////////////////////
    //PRIVATE METHODS
    //////////////////////////////////////////////////////
    function transformCatchResponse(response) {
      try {
        return new Float32Array(response);
      } catch (error) {
        console.log('Spatial catch response not parseable into Float32Array.');
        return new Float32Array();
      }
    }

    function makeGridLayer(data, year) {
      var isYearDefined = (typeof year !== 'undefined');
      //First delete any previous layer in that year slot.
      if (isYearDefined) {
        var oldLayer = gridLayers.forYear(year);
        if (oldLayer) {
          map.removeLayer(oldLayer);
        }
      }

      var showLayer = isYearDefined ? $scope.currentYear === year : true;
      var zIndex = isYearDefined ? year - firstYearOfData : singleYearGridLayerIndex;

      //Then make the layer
      var newLayer = map.addLayer(data, {
        gridSize: [720, 360],
        renderOnAnimate: false,
        zIndex: zIndex,
        renderOnAdd: showLayer
      });

      //Workaround for this bug: https://github.com/VulcanTechnologies/d3-grid-map/issues/12
      if (!showLayer) {
        newLayer.hide();
      }

      //Add it to the cache
      if (isYearDefined) {
        gridLayers.forYear(year, newLayer);
      } else {
        gridLayers.yearlessLayer = newLayer;
      }
    }

    function deleteGridLayerForYear(year) {
      //Remove layer from the gridmap
      var deadLayerWalking = gridLayers.forYear(year);
      if (deadLayerWalking) {
        map.removeLayer(deadLayerWalking);
      }

      //Clear the cache reference
      gridLayers.forYear(year, null);
    }

    function clearGrid() {
      forEachYear(deleteGridLayerForYear);

      if (gridLayers.yearlessLayer) {
        map.removeLayer(gridLayers.yearlessLayer);
        delete gridLayers.yearlessLayer;
      }
    }

    //Ensures that outdated query responses don't fire after newer ones.
    function makeCancellableCallback(callIndex, cb) {
      if (callIndex < numQueriesMade) {
        return angular.noop;
      }
      return cb;
    }

    function updateQueryFromUrl() {
      var search = $location.search();

      //Taxon distribution
      if (search.dist) {
        $scope.query.taxonDistribution = search.dist.split(',');
      }

      //Allocation
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

      //Year
      $scope.currentYear = Math.min(Math.max(+search.year || lastYearOfData, firstYearOfData), lastYearOfData); //Clamp(year, 1950, 2013). Why does JS not have a clamp function?
    }

    function updateUrlFromQuery() {
      //Fishing countries
      if ($scope.query.isFilteredBy('fishingCountries')) {
        $location.search('entities', $scope.query.fishingCountries.join(','));
      } else {
        $location.search('entities', null);
      }

      var searchValue;
      //Taxa, commercial groups, functional groups
      switch ($scope.query.catchesBy) {
        case 'taxa':
          searchValue = ($scope.query.isFilteredBy('taxa')) ? $scope.query.taxa.join(',') : null;
          $location.search('taxa', searchValue);
          $location.search('commgroups', null);
          $location.search('funcgroups', null);
          break;
        case 'commercial groups':
          searchValue = ($scope.query.isFilteredBy('commercialGroups')) ? $scope.query.commercialGroups.join(',') : null;
          $location.search('taxa', null);
          $location.search('commgroups', searchValue);
          $location.search('funcgroups', null);
          break;
        case 'functional groups':
          searchValue = ($scope.query.isFilteredBy('functionalGroups')) ? $scope.query.functionalGroups.join(',') : null;
          $location.search('taxa', null);
          $location.search('commgroups', null);
          $location.search('funcgroups', searchValue);
          break;
      }

      //Year
      var queryYear = $scope.currentYear || lastYearOfData;
      if (queryYear !== lastYearOfData) {
        $location.search('year', queryYear);
      } else {
        $location.search('year', null);
      }

      //Taxon distribution
      if ($scope.isDistributionQueryValid($scope.query)) {
        $location.search('dist', $scope.query.taxonDistribution.join(','));
      } else {
        $location.search('dist', null);
      }

      $location.replace();
    }

    function getQuerySentence (query, year) {
      //[All, Unreported, Reported, All] [fishing, landings, Discards, (F)fishing ] [<blank>, of Abolones, of 2 taxa, of 2 commercial groups] by the fleets of [Angola, 2 countries] in [year]
      if (!$scope.isQueryValid(query)) {
        return '';
      }

      var sentence = [];

      if ($scope.isDistributionQueryValid(query)) {
        sentence.push('Global distribution of ');
        if (query.taxonDistribution.length === 1) {
          var taxonName = $scope.taxa.find('common_name', query.taxonDistribution[0]);
          taxonName += ' (<em>' + $scope.taxa.find('scientific_name', query.taxonDistribution[0]) + '</em>)';
          sentence.push(taxonName);
        } else {
          sentence.push(query.taxonDistribution.length + ' taxa');
        }
      } else {
        if (!query.isFilteredBy('fishingCountries')) {
          sentence.push('Global fishing');
        } else {
          sentence.push('All fishing');
        }

        //Catches by
        if (query.catchesBy === 'taxa' && query.isFilteredBy('taxa')) {
          if (query.taxa && query.taxa.length === 1) {
            var taxaName = $scope.taxa.find('common_name', query.taxa[0]);
            sentence.push('of ' + taxaName.toLowerCase());
          } else if (query.taxa && query.taxa.length > 1) {
            sentence.push('of ' + query.taxa.length + ' taxa');
          }
        } else if (query.catchesBy === 'commercial groups' && query.isFilteredBy('commercialGroups')) {
          if (query.commercialGroups && query.commercialGroups.length === 1) {
            var commercialGroupName = $scope.commercialGroups.find('name', query.commercialGroups[0]);
            sentence.push('of ' + commercialGroupName.toLowerCase());
          } else if (query.commercialGroups && query.commercialGroups.length > 1) {
            sentence.push('of ' + query.commercialGroups.length + ' commercial groups');
          }
        } else if (query.catchesBy === 'functional groups' && query.isFilteredBy('functionalGroups')) {
          if (query.functionalGroups && query.functionalGroups.length === 1) {
            var functionalGroupName = $scope.functionalGroups.find('description', query.functionalGroups[0]);
            sentence.push('of ' + functionalGroupName.toLowerCase());
          } else if (query.functionalGroups && query.functionalGroups.length > 1) {
            sentence.push('of ' + query.functionalGroups.length + ' functional groups');
          }
        }

        //Fishing countries
        if (query.isFilteredBy('fishingCountries')) {
          if (query.fishingCountries.length === 1) {
            var countryName = $scope.fishingCountries.find('title', query.fishingCountries[0]);
            sentence.push('by the fleets of ' + countryName);
          } else {
            sentence.push('by the fleets of ' + query.fishingCountries.length + ' countries');
          }
        }

        //Year
        sentence.push('in ' + (year || lastYearOfData));

        var totalCatch = $scope.totalCatch.forYear(year);
        if (totalCatch) {
          sentence.push('(Total: ' + $filter('totalCatchUnits')(totalCatch).toString() + ')');
        }
      }
      return sentence.join(' ');
    }

    function getCatchGraphLinkText (query) {
      if (!query.isFilteredBy('fishingCountries')) {
        return 'View graph of global catches.';
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
      if (!query.isFilteredBy('fishingCountries')) {
        return '#/global';
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

    function getOceanLegendLabel (query) {
      if ($scope.isDistributionQueryValid(query)) {
        var taxonName = $scope.taxa.find('common_name', query.taxonDistribution[0]);
        return 'No ' + taxonName;
      } else {
        return 'No catch';
      }
    }

    function forEachYear(cb) {
      for (var currYear = firstYearOfData; currYear <= lastYearOfData; currYear++) {
        cb(currYear, currYear - firstYearOfData);
      }
    }

    function updateYearLayerVisibility() {
      //Hide the old grid layers so that only one is showing at a time.
      forEachYear(function hideAllLayers(year) {
        var layer = gridLayers.forYear(year);
        if (layer) {
          layer.hide();
        }
      });

      //Show the new grid layer.
      var currentYearLayer = gridLayers.forYear($scope.currentYear);
      if (currentYearLayer) {
        currentYearLayer.show();
        currentYearLayer.draw(); //This call shouldn't need to be done by the application, it should be done in the library.
        $scope.lastQuerySentence = getQuerySentence($scope.query, $scope.currentYear);
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

    function clearAllocationQueryParams(query) {
      //Remove allocation params
      if (query.fishingCountries) {
        query.fishingCountries.length = 0;
      }
      if (query.taxa) {
        query.taxa.length = 0;
      }
      if (query.commercialGroups) {
        query.commercialGroups.length = 0;
      }
      if (query.functionalGroups) {
        query.functionalGroups.length = 0;
      }
    }

    function clearDistributionParams(query) {
      //Remove distribution params
      if (query.taxonDistribution) {
        query.taxonDistribution.length = 0;
      }
    }

    //////////////////////////////////////////////////////
    //LOCAL VARS
    //////////////////////////////////////////////////////
    var map;
    var firstYearOfData = 1950; //Dynamic later.
    var lastYearOfData = 2010; //Dynamic later.
    var numCellsInGrid = 720 * 360;
    var singleYearGridLayerIndex = 98;
    var eezMapLayerIndex = 99; //Ensure this layer is far above all of the grid layers. There could be one-per-year.
    var countriesMapLayerIndex = 100; //Ensure this layer is far above all of the grid layers. There could be one-per-year.

    //var lastCatchQueryResponse;
    var numQueriesMade = 0; //Used to tell a query response if it's old and outdated.
    var gridLayers = [];
    gridLayers.forYear = function (year, layer) {
      if (arguments.length === 1) {
        return this[year - firstYearOfData];
      } else {
        this[year - firstYearOfData] = layer;
      }
    };
    //////////////////////////////////////////////////////
    //SCOPE VARS
    //////////////////////////////////////////////////////
    $scope.fishingCountries = fishingCountries.data;
    $scope.fishingCountries.find = makeArrayQueryable('id');
    //"All countries" pseudo-item
    if (toggles.isEnabled('global')) {
      $scope.fishingCountries.unshift({id: 0, title: '-- All fishing countries --'});
    }

    $scope.taxa = taxa.data;
    $scope.taxa.find = makeArrayQueryable('taxon_key');
    for (var i = 0; i < $scope.taxa.length; i++) {
      $scope.taxa[i].displayName = $scope.taxa[i].common_name + ' (' + $scope.taxa[i].scientific_name + ')';
    }

    //"All taxa" pseudo-item
    if (toggles.isEnabled('global')) {
      $scope.taxa.unshift({taxon_key: 0, common_name: '-- All taxa --', displayName: '-- All taxa --'});
    }

    $scope.commercialGroups = commercialGroups.data;
    $scope.commercialGroups.find = makeArrayQueryable('commercial_group_id');
    //"All commercial groups" pseudo-item
    if (toggles.isEnabled('global')) {
      $scope.commercialGroups.unshift({commercial_group_id: '0', name: '-- All commercial groups --'});
    }

    $scope.functionalGroups = functionalGroups.data;
    $scope.functionalGroups.find = makeArrayQueryable('functional_group_id');
    //"All commercial groups" pseudo-item
    if (toggles.isEnabled('global')) {
      $scope.functionalGroups.unshift({functional_group_id: '-1', description: '-- All functional groups --'});
    }

    $scope.mappedCatchExamples = spatialCatchExamples;

    $scope.inProd = SAU_CONFIG.env === 'stage' || SAU_CONFIG.env === 'prod';
    $scope.currentYear = lastYearOfData;
    $scope.loadingProgress = 1;
    $scope.themes = spatialCatchThemes;

    //////////////////////////////////////////////////////
    //WATCHERS
    //////////////////////////////////////////////////////
    $scope.$watch('currentYear', updateYearLayerVisibility);
    //The four watchers below are a patch to keep <selectize> using an Array as the model rather
    //than switching to an integer when the maxItems is 1.
    $scope.$watch('queryCommercialGroup', function syncCommercialGroup() {
      $scope.query.commercialGroups = [$scope.queryCommercialGroup];
    });
    $scope.$watch('query.commercialGroups', function syncCommercialGroups() {
      $scope.queryCommercialGroup = $scope.query.commercialGroups[0];
    });
    $scope.$watch('queryFunctionalGroup', function syncFunctionalGroup() {
      $scope.query.functionalGroups = [$scope.queryFunctionalGroup];
    });
    $scope.$watch('query.functionalGroups', function syncFunctionalGroups() {
      $scope.queryFunctionalGroup = $scope.query.functionalGroups[0];
    });
    $scope.$on('$destroy', $scope.$on('$locationChangeSuccess', updateQueryFromUrl));
    $scope.query = {
      //A quick function to find out if a particular query property is filtering the query.
      isFilteredBy: function isFilteredBy (queryProperty) {
        var globalIndex = queryProperty === 'functionalGroups' ? '-1': '0';
        return this[queryProperty] && this[queryProperty].length > 0 && this[queryProperty].indexOf(globalIndex) === -1;
      },
      isFiltered: function isFiltered () {
        return this.isFilteredBy('fishingCountries') ||
          this.isFilteredBy('taxa') ||
          this.isFilteredBy('commercialGroups') ||
          this.isFilteredBy('functionalGroups');
      }
    };
    $scope.totalCatch = [];
    $scope.totalCatch.setAllYears = function (allYears) {
      for (var i = 0; i < allYears.length; i++) {
        this[i] = allYears[i];
      }
    };
    $scope.totalCatch.forYear = function (year) {
      return this[year - firstYearOfData];
    };

    //////////////////////////////////////////////////////
    //KICKING THINGS OFF
    //////////////////////////////////////////////////////
    d3.json('countries.topojson', function(error, countries) {
      map = new d3.geo.GridMap('#cell-map', {
        seaColor: $scope.themes.current().ocean,
        graticuleColor: $scope.themes.current().graticule,
        disableMouseZoom: true,
        graticuleWidth: 0.5,
        onCellHover: function (cell) {
          $scope.cellValue = cell;
          $scope.$apply();
        },
        onMouseMove: function (coords) {
          //Determine which EEZ the user is hovering their mouse over,
          //And assign that EEZ to a scoped var to use in the UI.
          if (!coords) {
            return;
          }
          var point = {
            type: 'Point',
            coordinates: coords
          };
          var oldHoverEEZ = $scope.hoverEEZ;
          $scope.hoverEEZ = null;
          for (var i = 0; i < eezSpatialData.data.features.length; i++) {
            var feature = eezSpatialData.data.features[i];
            if (gju.pointInMultiPolygon(point, feature.geometry)) {
              $scope.hoverEEZ = feature.properties;
              break;
            }
          }

          if (oldHoverEEZ !== $scope.hoverEEZ) {
            $scope.$apply();
          }
        }
      });

      map.dispatch.on('drawEnd', function () {
        $scope.loadingText = '';
        $scope.isRendering = false;
        $scope.$apply();
      });

      map.addLayer(eezSpatialData.data, {
        fillColor: $scope.themes.current().eezFill,
        strokeColor: $scope.themes.current().eezStroke,
        strokeWidth: 1.5,
        renderOnAnimate: false,
        zIndex: eezMapLayerIndex
      });

      map.addLayer(countries, {
        fillColor: $scope.themes.current().landFill,
        strokeColor: $scope.themes.current().landStroke,
        zIndex: countriesMapLayerIndex
      });

      updateQueryFromUrl();

      //Boostrap the initial query if there are query params in the URL when the page loads.
      if ($scope.isQueryValid($scope.query)) {
        //Switch the UI to show the distribution tab if the URL is a distribution URL.
        if ($scope.isDistributionQueryValid($scope.query)) {
          $scope.visibleForm = 1;
        }
        $scope.submitQuery($scope.query, $scope.currentYear);
      }
    });

    var keychain = new Keychain('wwssadadba', function () {
      var indexOfCurrent = $scope.themes.indexOf($scope.themes.current());
      indexOfCurrent++;
      if (indexOfCurrent === $scope.themes.length) {
        indexOfCurrent = 0;
      }
      $scope.themes.current(indexOfCurrent);
      $route.reload();
    });
    $scope.$on('$destroy', keychain.destruct);
  })

  /*
  *
  *
  *
  *
  */
  .factory('makeCatchMapScale', function () {
    return function (thresholds, colors) {
      //Convert the provided colors to a single integer value for faster processing by the D3 grid map.
      for (var i = 0; i < colors.length; i++) {
        var d3Color = d3.rgb(colors[i]);
        var intColor = (255 << 24) | (d3Color.b << 16) | (d3Color.g << 8) | d3Color.r;
        colors[i] = intColor;
      }

      var getY = function (x) {
        for (var i = 1; i < thresholds.length; i++) {
          if (x <= thresholds[i]) {
            return colors[i-1];
          }
        }
        return colors[colors.length - 1];
      };

      getY.getQuantile = function (x) {
        for (var i = 1; i < thresholds.length; i++) {
          if (x <= thresholds[i]) {
            return i-1;
          }
        }
        return thresholds.length - 1;
      };

      return getY;
    };
  });
