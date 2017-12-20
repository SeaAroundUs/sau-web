'use strict';

angular.module('sauWebApp')
  .factory('mainMapRegionConfig', function (sauAPI, mapConfig) {

    var eezConfig = {
      path: '/eez',
      requestData: function() {
        return sauAPI.Regions.get({region: 'eez'});
      },
      getGeoJsonData: function (apiResponse) {
        return apiResponse.data;
      },
      geoJsonStyle: mapConfig.defaultStyle,
      getSearchOptions: geoJsonResponseToSearchOptions
    };

    var lmeConfig = {
      path: '/lme',
      requestData: function() {
        return sauAPI.Regions.get({region: 'lme'});
      },
      getGeoJsonData: function (apiResponse) {
        return apiResponse.data;
      },
      geoJsonStyle: mapConfig.defaultStyle,
      getSearchOptions: geoJsonResponseToSearchOptions
    };

    var meowConfig = {
      path: '/meow',
      requestData: function() {
        return sauAPI.Regions.get({region: 'meow'});
      },
      getGeoJsonData: function (apiResponse) {
        return apiResponse.data;
      },
      geoJsonStyle: mapConfig.defaultStyle,
      getSearchOptions: geoJsonResponseToSearchOptions
    };

    var highseasConfig = {
      path: '/highseas',
      requestData: function() {
        return sauAPI.Regions.get({region: 'highseas'});
      },
      getGeoJsonData: function (apiResponse) {
        return apiResponse.data;
      },
      geoJsonStyle: mapConfig.defaultStyle,
      getSearchOptions: geoJsonResponseToSearchOptions
    };

    var rfmoConfig = {
      path: '/rfmo',
      requestData: function() {
        return sauAPI.Regions.get({region: 'rfmo'});
      },
      getGeoJsonData: function (apiResponse) {
        return apiResponse.data;
      },
      geoJsonStyle: mapConfig.defaultStyle,
      getSearchOptions: function (apiResponse) {
        var searchOptions = [];

        for (var i = 0; i < apiResponse.data.features.length; i++) {
          var feature = apiResponse.data.features[i];
          searchOptions.push({value: ''+feature.properties.region_id, label: feature.properties.long_title + ' (' + feature.properties.title + ')'});
        }

        return searchOptions;
      }
    };

    var maricultureConfig = {
      path: '/mariculture',
      requestData: function () {
        return sauAPI.Regions.get({region: 'mariculture'});
      },
      getGeoJsonData: function () {
        return null;
      },
      geoJsonStyle: null,
      getSearchOptions: geoJsonResponseToSearchOptions
    };

    var faoConfig = {
      path: '/fao',
      requestData: function() {
        return sauAPI.Regions.get({region: 'fao'});
      },
      getGeoJsonData: function (apiResponse) {
        return apiResponse.data;
      },
      geoJsonStyle: mapConfig.defaultStyle,
      getSearchOptions: function (apiResponse) {
        var searchOptions = [];

        for (var i = 0;i < apiResponse.data.features.length; i++) {
          var fao = apiResponse.data.features[i];
          searchOptions.push({value: ''+fao.properties.region_id, label: fao.properties.title + ' (' + fao.properties.region_id + ')'});
        }

        return searchOptions;
      }
    };

    var fishingCountryConfig = {
      path: '/fishing-entity',
      requestData: function() {
        return sauAPI.Regions.get({region: 'fishing-entity'});
      },
      getGeoJsonData: function () {
        return null;
      },
      geoJsonStyle: null,
      getSearchOptions: function (apiResponse) {
        var searchOptions = [];

        for (var i = 0; i < apiResponse.data.length; i++) {
          var country = apiResponse.data[i];
          searchOptions.push({value: ''+country.id, label: country.title});
        }

        return searchOptions;
      }
    };

    function geoJsonResponseToSearchOptions (apiResponse) {
      var searchOptions = [];

      for (var i = 0; i < apiResponse.data.features.length; i++) {
        var feature = apiResponse.data.features[i];
        searchOptions.push({value: ''+feature.properties.region_id, label: feature.properties.title});
      }

      return searchOptions;
    }

    return {
      getConfig: function(regionTypeId) {
        return this[regionTypeId];
      },
      'eez': eezConfig,
      'lme': lmeConfig,
      'meow': meowConfig,
      'highseas': highseasConfig,
      'rfmo': rfmoConfig,
      'mariculture': maricultureConfig,
      'fao': faoConfig,
      'fishing-entity': fishingCountryConfig
    };
  });
