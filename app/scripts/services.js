'use strict';

angular.module('sauWebApp')
  .service('sauService', function($resource, SAU_CONFIG) {

    var Region = $resource(SAU_CONFIG.api_url + ':region/:region_id', {}, {get: {method: 'GET'}});

    var Regions = $resource(SAU_CONFIG.api_url + ':region/', {}, {get: {method: 'GET'}});

    var Data = $resource(SAU_CONFIG.api_url + ':region/:measure/:dimension/', {}, {get: {method: 'GET'}});

    var CSVData = $resource(SAU_CONFIG.api_url + ':region/:measure/:dimension/?format=csv');

    var mapConfig = {
      highlightStyle: {
        fillColor: '#00f',
      },
      defaultStyle : {
        color: 'black',
        stroke: true,
        weight: 1,
        opacity: 1.0,
        fillColor: 'black',
        fillOpacity: 0.3,
        lineCap: 'round'
      },
      defaults: {
        tileLayer: 'http://{s}.tiles.mapbox.com/v3/examples.map-i87786ca/{z}/{x}/{y}.png',
        tileLayerOptions: {
          // noWrap: true,
          // detectRetina: true, // no idea what this does
          // reuseTiles: true // nor this
        }
      }
    };

    return {
      Region: Region,
      Regions: Regions,
      Data: Data,
      CSVData: CSVData,
      api_url: SAU_CONFIG.api_url,
      mapConfig: mapConfig
    };
  });