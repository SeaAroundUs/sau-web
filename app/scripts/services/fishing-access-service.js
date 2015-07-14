'use strict';

angular.module('sauWebApp')
  .value('agreementAccessTypes',
    {
      '1': 'assumed unilateral',
      '2': 'assumed reciprocal',
      '3': 'unilateral',
      '4': 'reciprocal'
    })
  .value('agreementFishingAccessTypes',
    {
      'AA': 'actual',
      'OA': 'observed agreement',
      'OF': 'observed fishing',
      'IF': 'illegal fishing'
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
        var a = [];
        for (var i = 0; i < agreements.length; i++) {
          if (a.indexOf(agreements[i].fishing_name) === -1) {
            a.push(agreements[i].fishing_name);
          }
        }
        return a.sort();
      }
    };
  });
