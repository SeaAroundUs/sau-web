'use strict';

angular.module('sauWebApp')
  .factory('underReviewList', function(sauAPI) {
    var underReviewList;
    sauAPI.UnderReview.get(function(res) { underReviewList = res.data; });

    return {
      isUnderReview: function(region) {
        return region.name === 'eez' &&
          region.ids.some(function(regionId) {
            return underReviewList.indexOf(regionId) !== -1;
          });
      }
    };
  });
