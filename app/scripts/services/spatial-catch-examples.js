'use strict';

angular.module('sauWebApp')
  .factory('spatialCatchExamples', function () {
    return [
      {
        sentence: 'See all fishing by the fleets of China in 1963',
        query: {
          fishingCountries: [
            31
          ],
          catchesBy: 'taxa',
          taxa: [],
          year: 1963
        }
      }, {
        sentence: 'See fishing of anchovies by the fleets of Spain in 2010',
        query: {
          fishingCountries: [
            165
          ],
          catchesBy: 'commercial groups',
          commercialGroups: [
            1
          ],
          year: 2010
        }
      }, {
        sentence: 'See global fishing of yellowfin, skipjack, and bigeye tuna in 1998',
        query: {
          fishingCountries: [],
          catchesBy: 'taxa',
          taxa: [
            600143,
            600107,
            600146
          ],
          year: 1998
        }
      }
    ];
  });