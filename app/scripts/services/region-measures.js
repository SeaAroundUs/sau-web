'use strict';

/**
 * @ngdoc service
 * @name sauWebApp.regionDimensions
 * @description
 * # regionDimensions
 * Service in the sauWebApp.
 */
angular.module('sauWebApp')
  .factory('regionMeasures', function () {

    var defaultMeasures = [
      {label: 'Tonnage', value: 'tonnage', chartlabel: 'Catch (t x 1000)', titleLabel: 'Catches by'},
      {label: 'Value', value: 'value', chartlabel: 'Real 2010 value (million US$)', titleLabel: 'Real 2010 value (US$) by'},
      {label: 'Calcium', value: 'calcium', chartlabel: 'Calcium concentration (mg/100g)', titleLabel: 'Calcium concentration by'},
      {label: 'Omega-3', value: 'omega', chartlabel: 'Omega-3 concentration (g/100g)', titleLabel: 'Omega-3 concentration by'}
    ];
    /*{label: 'Iron', value: 'iron', chartlabel: 'Iron (mg/100g)', titleLabel: 'Iron concentration (t * 1000) by'},
    {label: 'Selenium', value: 'selenium', chartlabel: 'Selenium (μg/100g)', titleLabel: 'Selenium concentration (t * 1000) by'},
    {label: 'Zinc', value: 'zinc', chartlabel: 'Zinc (mg/100g)', titleLabel: 'Zinc concentration (t * 1000) by'},
    {label: 'Vitamin A', value: 'vitamina', chartlabel: 'Vitamin A (μg/100g)', titleLabel: 'Vitamin A concentration (t * 1000) by'},
    {label: 'Protein', value: 'protein', chartlabel: 'Protein (g/100g)', titleLabel: 'Protein concentration (t * 1000) by'}*/

    var fishingeffortMeasures = [
      {label: 'Fishing effort (kW)', value: 'effort', chartlabel: 'Fishing effort (kW x 1000)', titleLabel: 'Fishing effort (kW) by'},
      {label: 'Number of boats', value: 'boats', chartlabel: 'Number of boats', titleLabel: 'Number of boats by'},
      {label: 'Carbon dioxide emissions', value: 'co2', useHTML: true, chartlabel: 'Carbon dioxide emissions (tonnes X 1000)', titleLabel: 'Carbon dioxide emissions by'}
    ];

    var taxonMeasures = [
      {label: 'Tonnage', value: 'tonnage', chartlabel: 'Catch (t x 1000)', titleLabel: 'Global catches of'},
      {label: 'Value', value: 'value', chartlabel: 'Real 2010 value (million US$)', titleLabel: 'Real 2010 value (US$) of global catches of'}
    ];

    return {
      eez: defaultMeasures,
      lme: defaultMeasures,
      meow: defaultMeasures,
      highseas: defaultMeasures,
      mariculture: defaultMeasures,
      global: defaultMeasures,
      rfmo: defaultMeasures,
      fishingCountry: defaultMeasures,
      'fishing-entity': defaultMeasures,
      'fishing-entity-effort': fishingeffortMeasures,
      'country-eezs': defaultMeasures,
      taxa: taxonMeasures,
      fao: defaultMeasures,
      'eez-bordering': defaultMeasures,
      multi: defaultMeasures
    };
  });
