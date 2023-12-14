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
      {label: 'Value', value: 'value', chartlabel: 'Real 2019 value (million US$)', titleLabel: 'Real 2019 value (US$) by'},
      {label: 'Calcium', value: 'calcium', chartlabel: 'Calcium concentration of the catch (mg; 10^3)', titleLabel: 'Calcium concentration by'},
      {label: 'Iron', value: 'iron', chartlabel: 'Iron concentration of the catch (mg; 10^7)', titleLabel: 'Iron concentration by'},
      {label: 'Selenium', value: 'selenium', chartlabel: 'Selenium concentration of the catch (μg; 10^7)', titleLabel: 'Selenium concentration by'},
      {label: 'Zinc', value: 'zinc', chartlabel: 'Zinc concentration of the catch (mg; 10^7)', titleLabel: 'Zinc concentration by'},
      {label: 'Vitamin A', value: 'vita', chartlabel: 'Vitamin A concentration of the catch (μg; 10^7)', titleLabel: 'Vitamin A concentration by'},
      {label: 'Omega-3', value: 'omega', chartlabel: 'Omega-3 concentration of the catch (g)', titleLabel: 'Omega-3 concentration by'},
      {label: 'Protein', value: 'protein', chartlabel: 'Protein concentration of the catch (g; 10^7)', titleLabel: 'Protein concentration by'}
    ];

    var fishingeffortMeasures = [
      {label: 'Fishing effort (kW)', value: 'effort', chartlabel: 'Fishing effort (kW x 1000)', titleLabel: 'Fishing effort (kW) by'},
      {label: 'Number of boats', value: 'boats', chartlabel: 'Number of boats', titleLabel: 'Number of boats by'},
      {label: 'Carbon dioxide emissions', value: 'co2', useHTML: true, chartlabel: 'Carbon dioxide emissions (tonnes X 1000)', titleLabel: 'Carbon dioxide emissions by'}
    ];

    var taxonMeasures = [
      {label: 'Tonnage', value: 'tonnage', chartlabel: 'Catch (t x 1000)', titleLabel: 'Global catches of'},
      {label: 'Value', value: 'value', chartlabel: 'Real 2019 value (million US$)', titleLabel: 'Real 2019 value (US$) of global catches of'}
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
