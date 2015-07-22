'use strict';

angular.module('sauWebApp')
  .factory('faos', function() {
    return {
      getFAOsByRegion: function(region, id) {
        if (region === 'global') {
          return [
            { id: 1, name: 'EEZs of the world' },
            { id: 2, name: 'High Seas of the world' }
          ];

        } else if (region === 'eez') {
          console.log(id);
          return []; //TODO

        } else {
          return [];
        }
      }
    };
  });
