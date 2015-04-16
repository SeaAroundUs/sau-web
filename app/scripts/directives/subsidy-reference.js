'use strict';
(function(angular){
  angular.module('sauWebApp').directive('subsidyReference', function(sauAPI) {
    return {
      link: function(scope) {
        if (!scope.url && scope.ref) {
          sauAPI.SubsidyReference.get({id: scope.ref}, function(resp) {
            var refData = resp.data;
            scope.refPopover = '<table class="popover-table">' +
              '<tr><td>Title:</td><td>' + refData.title + '</td></tr>' +
              '<tr><td>Author(s):</td><td>' + refData.author + '</td></tr>' +
              '<tr><td>Year:</td><td>' + refData.year + '</td></tr>' +
              '<tr><td>Source:</td><td>' + refData.source + '</td></tr>' +
              '</table>';
          });
        }
      },
      restrict: 'E',
      scope: {
        link: '=',
        ref: '=',
        url: '='
      },
      templateUrl: 'views/subsidy-reference.html'
    };
  });
})(angular);
