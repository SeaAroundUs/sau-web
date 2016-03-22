'use strict';

angular.module('sauWebApp')
.factory('sauChartUtils', function () {

  var methods = {
    toggleTaxonNames: function(scope) {
      //Swapping each datum's key between scientific name and common name.
      for (var i = 0; i < scope.data.length; i++) {
        var temp = scope.data[i].key;

        // if there is no scientific name, don't toggle it
        if (!scope.data[i].scientific_name) {
          continue;
        }

        scope.data[i].key = scope.data[i].scientific_name;
        scope.data[i].scientific_name = temp;
      }
    },

    //Returns the sum of the year values across the keys (e.g. Sum of all catch data in 1950),
    //then returns the largest of those values (e.g. Finds 1967 to be the largest sum).
    //This is useful for determining the yRange of a stacked area chart.
    getMaxDataSum: function(scope) {
      var valuesByYear = [];

      for (var i = 0; i < scope.data.length; i++) {
        for (var j = 0; j < scope.data[i].values.length; j++) {
          if (!valuesByYear[j]) {
            valuesByYear[j] = 0;
          }
          if (scope.data[i].values[j][1]) {
            valuesByYear[j] += scope.data[i].values[j][1];
          }
        }
      }

      return Math.max.apply(null, valuesByYear);
    },

    //Adjusts the domain of the Y axis of the chart.
    //"otherChartValues" is an array of other values besides the chart data that should be considered in the ceiling calculation (useful for maximum fraction)
    //"additionalCeilingScale" scales the ceiling even higher above the maximum value. The value 0 scales it up 0%. The value 1 scales it up 100%.
    calculateYAxisCeiling: function(scope, otherChartValues, additionalCeilingScale) {
      //Create a safe base-case for otherChartValues.
      if (!otherChartValues || otherChartValues.length === 0) {
        otherChartValues = [0];
      }

      var ceiling = Math.max.apply(null, otherChartValues);
      ceiling = Math.max(ceiling, this.getMaxDataSum(scope)) * (1 + additionalCeilingScale);

      //TODO fix the race condition that necessitates this conditional
      if (!scope.api) {
        return;
      }

      scope.api.getScope().options.chart.yDomain = [0, ceiling];
      scope.api.refresh();
    },

    //This delivers the hard-coded message to be displayed when there is no data for a region id.
    //Provide the region type and ID, and it will return you there proper message.
    getNoDataMessage: function(regionName, regionId) {
      if ((regionName === 'lme' && regionId === 64) || (regionName === 'highseas' && regionId === 18)) {
        return 'Currently no catches due to ice cover.';
      } else {
        return 'No data is available for this selection';
      }
    }
  };

  return methods;
});
