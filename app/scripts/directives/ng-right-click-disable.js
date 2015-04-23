'use strict';

angular.module('sauWebApp').directive('ngRightClickDisable', function() {
  return function(scope, element) {
    element.bind('contextmenu', function(event) {
      scope.$apply(function() {
        event.preventDefault();
      });
    });
  };
});
