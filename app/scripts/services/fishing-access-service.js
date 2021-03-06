'use strict';

angular.module('sauWebApp')
  .value('agreementAccessTypes',
    {
      '1': 'assumed unilateral',
      '2': 'assumed reciprocal',
      '3': 'unilateral',
      '4': 'reciprocal'
    })
  .value('agreementTypes',
  {
    '1': 'bilateral',
    '2': 'multilateral',
    '3': 'private',
    '4': 'licensing',
    '5': 'exploratory'
  })
  .factory('fishingAccess', function() {
    return {
      getFishingCountries: function(agreements) {

        //Go through all the agreements and create a sorted array of countries.
        var a = [];
        for (var i = 0; i < agreements.length; i++) {
          if (a.indexOf(agreements[i].fishing_name) === -1) {
            a.push(agreements[i].fishing_name);
          }
        }
        a.sort();

        //Give our list of countries a visibility flag for filtering the fishing access tables.
        var b = [];
        for (i = 0; i < a.length; i++) {
          b.push({
            name: a[i],
            visible: true
          });
        }

        return b;
      },

      getEEZs: function(agreements) {
        return agreements.reduce(function(eezs, agreement) {
          if (eezs.indexOf(agreement.eez_name) === -1) {
            eezs.push(agreement.eez_name);
          }
          return eezs;
        }, []).map(function(agreement) {
          return { name: agreement, visible: true };
        });
      }
    };
  });
