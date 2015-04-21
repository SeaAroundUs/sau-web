'use strict';

angular.module('sauWebApp')
.factory('sauChartUtils', function () {

  var methods = {
    toggleTaxonNames: function(scope) {
      return function (){
        //Swapping each datum's key between scientific name and common name.
        for (var i = 0; i < scope.data.length; i++) {
          var temp = scope.data[i].key;

          // if there is no scientific name, don't toggle it
          if (!scope.data[i].scientific_name) {
            continue;
          }

          scope.data[i].key = scope.data[i].scientific_name;
          scope.data[i].scientific_name = temp;
        }
        scope.useScientificNames = !scope.useScientificNames;
      };
    }
  };

  return methods;
});
