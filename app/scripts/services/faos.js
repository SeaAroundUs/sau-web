'use strict';

angular.module('sauWebApp')
  .factory('faos', function() {
    var methods = {
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
      },

      getFAOName: function(region, id, faoId) {
        var idx;
        var faos = methods.getFAOsByRegion(region, id);

        for (idx in faos) {
          if (faos[idx].id === faoId) {
            return faos[idx].name;
          }
        }

        return null;
      }
    };

    return methods;
  });
