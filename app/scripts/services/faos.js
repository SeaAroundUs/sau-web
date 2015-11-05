'use strict';

angular.module('sauWebApp')
  .factory('faos', function($q, sauAPI) {
    return {
      getFAOsByRegion: function(region, ids) {
        var promise = $q.defer();

        if (ids.length > 1) {
          promise.resolve([]);

        } else if (region === 'global') {
          promise.resolve([
            { id: 1, title: 'EEZs of the world' },
            { id: 2, title: 'High Seas of the world' }
          ]);

        } else if (region === 'eez') {
          $q.all([
            sauAPI.Region.get({ region: 'eez', region_id: ids[0] }).$promise,
            sauAPI.Regions.get({ region: 'fao', nospatial: true }).$promise
          ]).then(function(res) {
            var eez = res[0].data;
            var faos = res[1].data;
            var inter = [];

            if (eez.intersecting_fao_area_id) {
              inter = faos.reduce(function(inter, fao) {
                if (eez.intersecting_fao_area_id.indexOf(fao.id) !== -1) {
                  inter.push(fao);
                }
                return inter;
              }, []);
            }

            promise.resolve(inter);
          });

        } else {
          promise.resolve([]);
        }

        return promise.promise;
      }
    };
  });
