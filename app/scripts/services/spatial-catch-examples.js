'use strict';

angular.module('sauWebApp')
  .factory('spatialCatchExamples', function () {
    return [
      {
        sentence: 'See all fishing by the fleets of Ghana in 2008',
        query: {
          fishingCountries: [
            67
          ],
          catchesBy: 'taxa',
          taxa: [],
          year: 2008,
          taxonDistribution: null
        }
      }, {
        sentence: 'See global fishing of Atlantic soury in 2010',
        query: {
          fishingCountries: [],
          catchesBy: 'taxa',
          taxa: [
            601084
          ],
          year: 2010,
          taxonDistribution: null
        }
      }, {
        sentence: 'See Atlantic cod fishing by the fleets of Germany in 1976',
        query: {
          fishingCountries: [
            66
          ],
          catchesBy: 'taxa',
          taxa: [
            600069
          ],
          year: 1976,
          taxonDistribution: null
        }
      }, {
        sentence: 'See global Atlantic cod distribution',
        query: {
          fishingCountries: [],
          catchesBy: 'taxa',
          taxa: [],
          taxonDistribution: [
            600069
          ]
        }
      }
    ];
  });