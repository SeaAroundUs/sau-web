'use strict';

angular.module('sauWebApp')
  .service('sauService', function() {
    var removePathId = function(path) {
      var to = path.lastIndexOf('/');
      to = to === -1 ? path.length : to + 1;
      return path.substring(0, to);
    };

    return {
      removePathId: removePathId
    };
  });