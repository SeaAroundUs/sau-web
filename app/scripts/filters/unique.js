(function(angular) {
  'use strict';

  angular.module('sauWebApp').filter('unique', function() {
    return function(coll, key) {
      // not applicable
      if (coll === undefined || !coll.length || coll.length === 0) {
        return;
      }

      // short circuit (single list is always unique)
      if (coll.length === 1) {
        return coll;
      }

      // return unique item (with or without keys)
      return coll.reduce(function(uniq, item) {
        if (key !== undefined) {
          var keys = uniq.map(function(u) { return u[key]; });
          if (keys.indexOf(item[key]) === -1) {
            uniq.push(item);
          }

        } else if (uniq.indexOf(item) === -1) {
          uniq.push(item);
        }

        return uniq;
      }, []);
    };
  });
})(angular);
