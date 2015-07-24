'use strict';

angular.module('sauWebApp')
  .directive('advSearchDimensionParam', function (regionDimensions) {
    return {
      templateUrl: 'views/advanced-search/adv-search-dimension-param.html',
      restrict: 'E',
      scope: {
        regionId: '=',
        selectedDimension: '=',
        useScientificName: '=',
        modelChanged: '&'
      },
      link: function(scope) {
        scope.dimensions = regionDimensions[scope.regionId];
        scope.selectedDimension = scope.dimensions[0];
      }
    };
  }
  )
  .directive('advSearchMeasureParam', function(regionMeasures) {
    return {
      templateUrl: 'views/advanced-search/adv-search-measure-param.html',
      restrict: 'E',
      scope: {
        regionId: '=',
        selectedMeasure: '=',
        modelChanged: '&'
      },
      link: function(scope) {
        scope.measures = regionMeasures[scope.regionId];
        scope.selectedMeasure = scope.measures[0];
      }
    };
  })
  .directive('advSearchDimensionLimitParam', function(regionDimensionLimits) {
    return {
      templateUrl: 'views/advanced-search/adv-search-dimension-limit-param.html',
      restrict: 'E',
      scope: {
        regionId: '=',
        selectedLimit: '=',
        modelChanged: '&'
      },
      link: function(scope) {
        scope.limits = regionDimensionLimits[scope.regionId];
        scope.selectedLimit = scope.limits[0];
      }
    };
  })
  .directive('advSearchSectionTitle', function() {
    return {
      templateUrl: 'views/advanced-search/adv-search-section-title.html',
      restrict: 'E',
      transclude: true
    };
  });