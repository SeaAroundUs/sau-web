;(function() {

'use strict';

angular.module('sauWebApp')
  .value('mapConfig',
    {
    selectedStyle: {
      fillColor: '#fff',
      fillOpacity: 0.6
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
      minZoom: 2,
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
        url: '/images/clear-pixel.png',
        bounds: [[-540, -960], [540, 960]],
        layerParams: {
          noWrap: true,
          attribution: ''
        }
      }
    }
  });


})();