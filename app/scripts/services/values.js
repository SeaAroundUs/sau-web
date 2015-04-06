'use strict';

angular.module('sauWebApp')
  .value('mapConfig',
    {
    selectedStyle: {
      fillColor: '#fff',
      fillOpacity: 0.6
    },
    ifaStyle: {
      color: '#f00',
      fillColor: '#d00',
      fillOpacity: 0.4,
      weight: 1.0
    },
    countryStyle: {
      color: '#000',
      fillColor: '#000',
      fillOpacity: 0.1,
      weight: 1.0
    },
    faoStyle: {
      fill: false,
      color: '#00f',
      opacity: 1.0,
      weight: 1.0
    },
    selectedFaoStyle: {
      fill: false,
      color: '#00f',
      opacity: 1.0,
      weight: 4.0,
    },
    hatchStyle: {
      patternTransform: 'rotate(45)',
      weight: 1,
      spaceWeight: 9,
      color: '#ff0819',
      opacity: 1.0,
      spaceOpacity: 0.0
    },
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
      minZoom: 1,
      tileLayerOptions: {
        noWrap: true,
        detectRetina: true,
        reuseTiles: true
      }
    },
    baseLayers: {
      clear: {
        name: 'clear',
        type: 'imageOverlay',
        url: 'images/clear-pixel.png',
        bounds: [[-540, -960], [540, 960]],
        layerParams: {
          noWrap: true,
          attribution: ''
        }
      }
    }
  })
  .value('externalURLs',
    {
      manual: '/reference.html',
      sspMethods: '/wp-content/uploads/2015/04/SSP_methods-April-2011-final.pdf'
    });
