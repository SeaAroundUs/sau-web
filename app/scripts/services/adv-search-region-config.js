'use strict';

// This is where each section of the Advanced Search page is configured.
// Since each section is largely similar, this config allows us to only specify
// The differences between each region/section within Advanced Search.
angular.module('sauWebApp')
  .factory('advSearchRegionConfig', function (sauAPI) {

    //Most data results conform to similar naming conventions,
    //so the search options formats are all the same, with a few exceptions.
    //We use this function as the default for most regions' getSearchOptions() function,
    //with a few overrides.
    function defaultGetSearchOptions (results) {
      var searchOptions = [];
      for (var i = 0; i < results.data.length; i++) {
        var item = results.data[i];
        searchOptions.push({value: item.id, label: item.title});
      }
      return searchOptions;
    }

    return {
      eez: {
        graphResultsPath: 'eez',
        regionListTitle: 'EEZs',
        selectedListTitle: 'Selected EEZs',
        searchPlaceholder: 'Search EEZs',
        selectionLimit: 10,
        getRegionData: function() {
          return sauAPI.Regions.get({region: 'eez', nospatial: true});
        },
        getSearchOptions: defaultGetSearchOptions
      },
      lme: {
        graphResultsPath: 'lme',
        regionListTitle: 'LMEs',
        selectedListTitle: 'Selected LMEs',
        searchPlaceholder: 'Search LMEs',
        selectionLimit: 10,
        getRegionData: function() {
          return sauAPI.Regions.get({region: 'lme', nospatial: true});
        },
        getSearchOptions: defaultGetSearchOptions
      },
      rfmo: {
        graphResultsPath: 'rfmo',
        regionListTitle: 'RFMOs',
        selectedListTitle: 'Selected RFMOs',
        searchPlaceholder: 'Search RFMOs',
        selectionLimit: 5,
        getRegionData: function() {
          return sauAPI.Regions.get({region: 'rfmo', nospatial: true});
        },
        getSearchOptions: defaultGetSearchOptions
      },
      fao: {
        graphResultsPath: 'fao',
        regionListTitle: 'FAO areas',
        selectedListTitle: 'Selected FAO areas',
        searchPlaceholder: 'Search FAO areas',
        selectionLimit: 5,
        getRegionData: function() {
          return sauAPI.Regions.get({region: 'fao', nospatial: true});
        },
        getSearchOptions: function (results) {
          var searchOptions = [];
          for (var i = 0; i < results.data.length; i++) {
            var fao = results.data[i];
            searchOptions.push({value: fao.id, label: fao.title + ' (' + fao.id + ')'});
          }
          return searchOptions;
        }
      },
      'eez-bordering': {
        graphResultsPath: 'eez-bordering',
        regionListTitle: 'EEZs',
        selectedListTitle: 'Selected EEZs',
        searchPlaceholder: 'Search EEZs',
        selectionLimit: 1,
        getRegionData: function() {
          return sauAPI.Regions.get({region: 'eez', nospatial: true});
        },
        getSearchOptions: defaultGetSearchOptions
      },
      'fishing-entity': {
        graphResultsPath: 'fishing-entity',
        regionListTitle: 'Fishing countries',
        selectedListTitle: 'Selected Fishing countries',
        searchPlaceholder: 'Search fishing countries',
        selectionLimit: 10,
        getRegionData: function() {
          return sauAPI.FishingEntities.get({ nospatial: true });
        },
        getSearchOptions: defaultGetSearchOptions
      },
      country: {
        graphResultsPath: 'need-graph-results-path',
        regionListTitle: 'Countries',
        selectedListTitle: 'Selected countries',
        searchPlaceholder: 'Search countries',
        selectionLimit: 1,
        getRegionData: function() {
          return sauAPI.GeoList.get({ nospatial: true });
        },
        getSearchOptions: defaultGetSearchOptions
      },
      taxa: {
        graphResultsPath: 'taxon',
        regionListTitle: 'Taxa',
        selectedListTitle: 'Selected taxa',
        searchPlaceholder: 'Search taxa',
        selectionLimit: 10,
        getRegionData: function() {
          return sauAPI.Taxa.get();
        },
        getSearchOptions: function (results) {
          var searchOptions = [];
          for (var i = 0; i < results.data.length; i++) {
            var taxon = results.data[i];
            searchOptions.push({value: taxon.taxon_key, label: taxon.scientific_name + ' (' + taxon.common_name + ')'});
          }
          return searchOptions;
        }
      }
    };
  });
