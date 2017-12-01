'use strict';

angular.module('sauWebApp')
  .factory('regionDataMoreLinks', function() {
    var importantNotes = {
      global: 'Much confusion surrounds the notion of ecosystem indicators. Some believe ecosystem ' +
      'indicators are whatever one can measure that impacts ecosystems, i.e., sea surface temperatures. ' +
      'However, to be of use, indicators must summarize in a single number a variety of complex processes ' +
      'that are otherwise hard to apprehend. Moreover, besides description, indicators must allow for ' +
      'communication, and, ideally, for intervention. We present a small number of indicators that are ' +
      'either available globally, or could be derived, on a global basis, from the Sea Around Us ' +
      'reconstructed catches. Contact us for suggestion of other indicators, either from third parties, ' +
      'or which could be derived from catch data.'
    };

    importantNotes['country-eezs'] = importantNotes.global;
    importantNotes.rfmo = importantNotes.global;
    importantNotes.fao = importantNotes.global;
    importantNotes.lme = importantNotes.global;
    importantNotes.meow = importantNotes.global;
    importantNotes.eez = importantNotes.global;
    importantNotes.highseas = importantNotes.global;

    var links = {
      // Global links
      global: [
        {
          section: 'Ecosystems',
          links: [
            { text: 'Large seamounts', url: '/large-seamount-areas/' },
            {
              text: 'Marine protected areas',
              url: '/doc/PageContent/GlobalMpaWorldMap/mpaglobal_worldmap.pdf'
            }
          ]
        },
        {
          section: 'Other global datasets',
          links: [
            { text: 'Fuel consumption', url: '/fuel-consumption-by-marine-fisheries-in-2000/' },
            { text: 'Mesopelagic biomass', url: '/mesopelagic-biomass/' },
            { text: 'Zooplankton Map', url: '/zooplankton-map/' },
            { text: 'Phytoplankton Map', url: '/phytoplankton-map/' }
          ]
        },
        {
          section: 'Governance',
          links: [
            { text: 'FAO Fisheries & Aquaculture Dept.', url: 'http://www.fao.org/fishery/en' },
            { text: 'FAO FIRMS', url: 'http://firms.fao.org/firms/en' }
          ]
        },
        {
          section: 'Indicators (<span id="important-note"><a id="important-link">IMPORTANT NOTE</a></span>)',
          links: [
            { text: 'Stock status plots', url: '#/global/stock-status', subRegion: true },
            { text: 'Multinational footprint', url: '#/global?chart=multinational-footprint', subRegion: true },
            { text: 'Marine trophic index', url: '#/global/marine-trophic-index', subRegion: true }
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
              ngUrl: 'http://www.fishbase.org/Country/CountryTreatyList.php?' +
                'Country={{ country_id | fishbaseCountryId }}'
            },
            { text: 'FAO Fisheries & Aquaculture Dept.', url: 'http://www.fao.org/fishery/en' },
            { text: 'FAO FIRMS', url: 'http://firms.fao.org/firms/en' },
            { text: 'External Fishing Access Agreements', ngUrl: '#/fishing-entity/{{ id }}/external-fishing-access/' }
          ]
        }, {
          section: 'Other topics',
          links: [
            { ngText: 'View catch allocations on a map for the fleets of {{title}}', ngUrl: '#/spatial-catch?entities={{id}}'}
          ]
        }
      ],

      // Country EEZ links
      'country-eezs': [
        {
          section: 'EEZs in this country',
          class: 'vertical',
          eachOf: 'eezs',
          url: '#/eez/{{ eez_id }}',
          text: '{{ eez_name }}',
          checkUnderReview: true
        },
        /*
        {
          section: 'Biodiversity',
          template: 'views/region-data/biodiversity.html'
        }
        */
      ],

      // RFMO links
      'rfmo': [
        {
          section: '',
          template: 'views/region-data/citations.html'
        },
        {
          section: 'More info',
          template: 'views/region-data/rfmo-info.html'
        },
        {
          section: 'Governance',
          template: 'views/region-data/rfmo-governance.html'
        },
        {
          section: 'Indicators (<span id="important-note"><a id="important-link">IMPORTANT NOTE</a></span>)',
          links: [
            { text: 'Stock status plots', ngUrl: '#/rfmo/{{ id }}/stock-status' },
            { text: 'Multinational footprint', ngUrl: '#/rfmo/{{ id }}?chart=multinational-footprint' },
            { text: 'Marine trophic index', ngUrl: '#/rfmo/{{ id }}/marine-trophic-index' }
          ]
        }
      ],

      // High seas links
      highseas: [
        {
          section: 'Indicators (<span id="important-note"><a id="important-link">IMPORTANT NOTE</a></span>)',
          links: [
            { text: 'Stock status plots', ngUrl: '#/highseas/{{ id }}/stock-status' },
            { text: 'Multinational footprint', ngUrl: '#/highseas/{{ id }}?chart=multinational-footprint' },
            { text: 'Marine trophic index', ngUrl: '#/highseas/{{ id }}/marine-trophic-index' }
          ]
        }
      ],

      // Taxa links
      taxa: [
        {
          section: 'Biodiversity',
          template: 'views/region-data/taxon-biodiversity.html'
        }
      ],

      // FAO links
      fao: [
        /*
        {
          section: 'Biodiversity',
          links: [
            { text: 'Exploited organisms', ngUrl: '#/fao/{{ id }}/exploited-organisms' }
          ]
        },
        */
        {
          section: 'Governance',
          links: [
            { text: 'FAO area information', ngUrl: 'http://www.fao.org/fishery/area/Area{{ id }}/en' },
            { text: 'FAO Fisheries & Aquaculture Dept.', url: 'http://www.fao.org/fishery/en' },
            { text: 'FAO FIRMS', ngUrl: 'http://firms.fao.org/firms/search/area/{{ id }}/en' }
          ]
        },
        {
          section: 'Indicators (<span id="important-note"><a id="important-link">IMPORTANT NOTE</a></span>)',
          links: [
            { text: 'Stock status plots', ngUrl: '#/fao/{{ id }}/stock-status' },
            { text: 'Multinational footprint', ngUrl: '#/fao/{{ id }}?chart=multinational-footprint' },
            { text: 'Marine trophic index', ngUrl: '#/fao/{{ id }}/marine-trophic-index' }
          ]
        }
      ],

      // EEZ Bordering
      'eez-bordering': [
        {
          section: 'EEZs in this group',
          class: 'vertical',
          eachOf: 'eezs',
          url: '#/eez/{{ id }}',
          text: '{{ title }}',
          checkUnderReview: true
        },
        {
          section: 'Biodiversity',
          template: 'views/region-data/biodiversity-multi.html'
        }
      ],

      // EEZ
      eez: [
        {
          section: 'Biodiversity',
          template: 'views/region-data/biodiversity.html'
        },
        {
          section: 'Biodiversity',
          multiTemplate: 'views/region-data/biodiversity-multi.html'
        },
        {
          section: 'Ecosystems',
          links: [
            { text: 'Marine protected areas', url: '/doc/PageContent/GlobalMpaWorldMap/mpaglobal_worldmap.pdf' },
            {
              text: 'EcoBase',
              ngUrl: 'http://ecobase.ecopath.org/index.php?action=base&m_EEZ={{ id }}'
            },
            { text: 'Estuaries', ngUrl: '#/eez/{{ id }}/estuaries' },
            {
              text: 'Fish parameters',
              ngUrl: 'http://www.fishbase.org/report/KeyFactsMatrixList.php?c_code={{ c_code }}' +
                '&sb=1&disabled=1&fsb=0&custom=1'
            }
          ]
        },
        {
          section: 'Governance',
          template: 'views/region-data/eez-governance.html'
        },
        {
          section: 'Indicators (<span id="important-note"><a id="important-link">IMPORTANT NOTE</a></span>)',
          links: [
            { text: 'Global Slavery Index', ngUrl: '{{ gsi_link }}' },
            { text: 'Stock status plots', ngUrl: '#/eez/{{ id }}/stock-status', subRegion: true },
            { text: 'Multinational footprint', ngUrl: '#/eez/{{ id }}?chart=multinational-footprint', subRegion: true },
            { text: 'Marine trophic index', ngUrl: '#/eez/{{ id }}/marine-trophic-index', subRegion: true },
            { text: 'Ocean Health Index website', ngUrl: '{{ ohi_link }}' }
          ]
        }
      ],

      // MEOW
      meow: [
        {
          section: 'Reference',
          links: [
            {
              text: 'ME profile (WWF)',
              ngUrl: '{{ profile_url }}'
            }
          ]
        },
        {
          section: 'Biodiversity',
          template: 'views/region-data/biodiversity-meow.html'
        },
        {
          section: 'Biodiversity',
          multiTemplate: 'views/region-data/biodiversity-multi.html'
        },
        {
          section: 'Ecosystems',
          links: [
            {
              text: 'EcoBase',
              ngUrl: ''
            }
          ]
        },
        {
          section: 'Indicators (<span id="important-note"><a id="important-link">IMPORTANT NOTE</a></span>)',
          links: [
            { text: 'Stock status plots', ngUrl: '#/meow/{{ id }}/stock-status' },
            { text: 'Multinational footprint', ngUrl: '#/meow/{{ id }}?chart=multinational-footprint' },
            { text: 'Marine trophic index', ngUrl: '#/meow/{{ id }}/marine-trophic-index' }
          ]
        }
      ],

      // LME
      lme: [
        {
          section: 'Reference',
          links: [
            {
              text: 'LME profile (NOAA)',
              ngUrl: '{{ profile_url }}'
            }
          ]
        },
        {
          section: 'Biodiversity',
          template: 'views/region-data/biodiversity-lme.html'
        },
        {
          section: 'Biodiversity',
          multiTemplate: 'views/region-data/biodiversity-multi.html'
        },
        {
          section: 'Ecosystems',
          links: [
            {
              text: 'EcoBase',
              ngUrl: 'http://ecobase.ecopath.org/index.php?action=base&m_LME={{ id }}'
            }
          ]
        },
        {
          section: 'Indicators (<span id="important-note"><a id="important-link">IMPORTANT NOTE</a></span>)',
          links: [
            { text: 'Stock status plots', ngUrl: '#/lme/{{ id }}/stock-status' },
            { text: 'Multinational footprint', ngUrl: '#/lme/{{ id }}?chart=multinational-footprint' },
            { text: 'Marine trophic index', ngUrl: '#/lme/{{ id }}/marine-trophic-index' }
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
