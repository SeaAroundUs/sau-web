'use strict';

angular.module('sauWebApp')
  .factory('regionDataMoreLinks', function() {
    var importantNotes = {
      global: 'Much confusion surrounds the notion of ecosystem indicators. Some believe ecosystem ' +
      'indicators are whatever one can measure that impacts ecosystems, i.e. sea surface temperatures. ' +
      'However, to be of use, indicators must summarize in a single number a variety of complex ' +
      'processes that are otherwise hard to apprehend. Moreover, besides description, indicators ' +
      'must allow for communication, and, ideally, for intervention. We present a small number of ' +
      'indicators based on the only data available globally on fisheries (i.e., catch data) that we ' +
      'think are useable. Select an indicator to view analysis based on Sea Around Us and other data.'
    };

    importantNotes['country-eezs'] = importantNotes.global;
    importantNotes.rfmo = importantNotes.global;

    var links = {
      // Global links
      global: [
        {
          section: 'Ecosystems',
          links: [
            { text: 'Large seamounts', url: '/large-seamount-areas/' },
            { text: 'Marine protected areas', url: 'doc/PageContent/GlobalMpaWorldMap/mpaglobal_worldmap.pdf' }
          ]
        },
        {
          section: 'Other topics',
          links: [
            { text: 'Fuel Consumption', url: '/fuel-consumption-by-marine-fisheries-in-2000/' },
            { text: 'Exploited organisms', url: '#/exploited-organisms' }
          ]
        },
        {
          section: 'Indicators (<span id="important-note"><a id="important-link">IMPORTANT NOTE</a></span>)',
          links: [
            { text: 'Stock status plots', url: '#/global/stock-status' },
            { text: 'Multinational footprint', url: '#/global?chart=multinational-footprint' },
            { text: 'Marine trophic index', url: '#/global/marine-trophic-index' }
          ]
        }
      ],

      // Fishing entity links
      'fishing-entity': [
        {
          section: 'Governance',
          links: [
            { text: 'Country profile', ngUrl: '#/country/{{ country_id }}' },
            { text: 'Fisheries subsidies', ngUrl: '#/subsidy/{{ geo_entity_id }}' },
            {
              text: 'Treaties & conventions',
              ngUrl: 'http://www.fishbase.de/Country/CountryTreatyList.php?' +
                'Country={{ country_id | fishbaseCountryId }}'
            },
            { text: 'External Fishing Access Agreements', ngUrl: '#/fishing-entity/{{ id }}/external-fishing-access/' }
          ]
        }
      ],

      // Country EEZ links
      'country-eezs': [
        {
          section: 'EEZs in this country',
          eachOf: 'eezs',
          url: '#/eez/{{ eez_id }}',
          text: '{{ eez_name }}'
        },
        {
          section: 'Biodiversity',
          template: 'views/region-data/biodiversity.html'
        }
      ],

      // RFMO links
      'rfmo': [
        {
          section: 'Governance',
          links: [
            { text: 'Website', ngUrl: '{{ profile_url }}' },
            { text: 'Procedures & Outcomes', ngUrl: '#/rfmo/{{ id }}/procedures-and-outcomes' }
          ]
        },
        {
          section: 'Indicators (<span id="important-note"><a id="important-link">IMPORTANT NOTE</a></span>)',
          links: [
            { text: 'Stock status plots', ngUrl: '#/rfmo/{{ id }}/stock-status' },
            { text: 'Multinational footprint', ngUrl: '#/rfmo/{{ id }}?chart=multinational-footprint' },
            { text: 'Marine trophic index', ngUrl: '#/rfmo/{{ id }}/marine-trophic-index' }
          ]
        }
      ]
    };

    return {
      getLinks: function(region) {
        return links[region.name] || [];
      },
      getImportantNote: function(region) {
        return importantNotes[region.name] || '';
      }
    };
  });