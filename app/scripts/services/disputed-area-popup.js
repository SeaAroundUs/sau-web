'use strict';

/* global L */

/**
 * @ngdoc service
 * @name sauWebApp.disputedAreaPopup
 * @description
 * # disputedAreaPopup
 * Defines the popup that appears when the user clicks on a disputed area.
 */
angular.module('sauWebApp')
  .factory('createDisputedAreaPopup', function(createQueryUrl) {

    function createOverlappingAreaPopup(regionType, featureLayers, prefix) {
      var content = prefix;
      content += featureLayers.map(function(l) {return createRegionDetailLink(regionType, l.feature.properties.region_id, l.feature.properties.title);}).join(', ');
      return new L.Rrose({ offset: new L.Point(0,-10), closeButton: false, autoPan: false, xEdge: 175, yEdge: 195 }).setContent(content);
    }

    function createRegionDetailLink(regionType, regionId, regionName) {

      var url = '#' + createQueryUrl.forRegionCatchChart({
        regionType: regionType,
        regionIds: [regionId]
      });
      return '<a href="' + url + '">' + regionName + '</a>';
    }

    return function(regionType, featureLayers) {
      switch (regionType) {
        case 'rfmo':
          return createOverlappingAreaPopup(regionType, featureLayers, 'This area contains multiple regions. Select one:<br />');
        default:
          return createOverlappingAreaPopup(regionType, featureLayers, 'Area disputed by ');
      }
    };
  });
