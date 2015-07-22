'use strict';

/* global colorbrewer */

angular.module('sauWebApp')
  .factory('regionDataCatchChartColors', function() {
    var colors = colorbrewer;

    colors.Bold = {
      11: ['#f00','#0f0', '#00f', '#ff0', '#f0f', '#0ff', '#000',
        '#08f', '#0f8', '#f80', '#8f0', '#80f', '#f08',
        '#666', '#f88', '#88f', '#8f8', '#800', '#080', '#008'
      ]
    };

    colors.Spectral['11'].push(
      '#666', '#f88', '#88f', '#8f8', '#800', '#080', '#008',
      '#888', '#333'
    );

    return colors;
  });
