'use strict';

angular.module('sauWebApp')
  .factory('spatialCatchThemes', function() {
    var allThemes = [
      {
        name: 'Nightly News',
        ocean: 'rgba(51, 125, 211, 1)',
        graticule: 'rgba(255, 255, 255, 0.3)',
        landStroke: 'rgba(255, 255, 255, 1)',
        landFill: 'rgba(251, 250, 243, 1)',
        eezStroke: 'rgba(255, 255, 255, .3)',
        eezFill: 'rgba(255, 255, 255, .15)',
        scale: ['#2ad9eb', '#74f9ae', '#d4f32a', '#fef500', '#fcab07', '#fc6a1b', '#fb2921']
      },
      {
        name: 'Whispy Fields',
        ocean: 'rgba(181, 224, 249, 1)',
        graticule: 'rgba(255, 255, 255, 0.3)',
        landStroke: 'rgba(255, 255, 255, 1)',
        landFill: 'rgba(251, 250, 243, 1)',
        eezStroke: 'rgba(255, 155, 155, 1)',
        eezFill: 'rgba(255, 255, 255, .15)',
        scale: ['#77b2ba', '#93d787', '#f0ff4c', '#fadf56', '#ffbd4b', '#fc8a52', '#db1f1a']
      },
      {
        name: 'Red October',
        ocean: 'rgba(0, 0, 0, 1)',
        graticule: 'rgba(0, 0, 0, 0)',
        landStroke: 'rgba(255, 255, 255, 0)',
        landFill: 'rgba(231, 0, 0, 1)',
        eezStroke: 'rgba(231, 0, 0, .3)',
        eezFill: 'rgba(231, 0, 0, .15)',
        scale: ['#000000', '#262626', '#585858', '#8d8d8d', '#bababa', '#e1e1e1', '#ffffff']
      }
    ];
    var currentTheme = allThemes[0];

    allThemes.current = function (val) {
      if (angular.isUndefined(val)) {
        return currentTheme;
      }
      if (typeof(val) === 'number') {
        val = allThemes[val];
      }
      currentTheme = val;
    };

    return allThemes;
  });
