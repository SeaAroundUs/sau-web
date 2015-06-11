/*jshint -W004 */
'use strict';

/**
 * @ngdoc directive
 * @name sauWebApp.directive:sauMultiSelect
 * @description
 * # sauMultiSelect
 */
angular.module('sauWebApp')
  .directive('sauMultiSelect', function () {
    return {
      templateUrl: 'views/sau-multi-select.html',
      restrict: 'E',
      scope: {
        searchPlaceholder: '@',
        labelKey: '@',
        data: '=',
        selected: '=',
        limit: '='
      },
      link: function(scope) {

        /* We limit the number of possible selections that a user can make.
        This should be native functionality of the HTML select multiple control,
        but it's not, so my implementation is below. */
        var selectedOptions = [];
        scope.onSelect = function() {
          /* If the number of selected items is within the valid limit,
          cache the IDs of the selected items. */
          if (scope.selected.length <= scope.limit) {
            selectedOptions = [];
            for (var i = 0; i < scope.selected.length; i++) {
              selectedOptions.push(scope.selected[i].id);
            }
          /* The user has selected too many items.
          Remove the items that weren't already selected.*/
          } else {
            for (var i = scope.selected.length - 1; i >= 0; i--) {
              if (selectedOptions.indexOf(scope.selected[i].id) === -1 && scope.selected.length > scope.limit) {
                scope.selected.splice(i, 1);
              }
            }
          }
        };
      }
    };
  });
