'use strict';

angular.module('sauWebApp')
  .directive('regionDataMore', function($sce, $timeout, regionDataMoreLinks) {
    return {
      link: function(scope, ele) {
        scope.moreData = regionDataMoreLinks.getLinks(scope.region);
        scope.trustAsHtml = $sce.trustAsHtml;

        $timeout(function() {
          var popup = angular.element('<div class="important-note-popup">' +
            '<div class="blue-bar"><span class="x"><i class="fa fa-times"></i></span></div>' +
            '<i class="fa fa-exclamation-triangle"></i> ' +
            regionDataMoreLinks.getImportantNote(scope.region) +
            '</div>'
          );

          ele.find('#important-note').append(popup);

          popup.find('.x').on('click', function() {
            popup.addClass('hidden');
          });

          ele.find('#important-link').on('click', function() {
            popup.toggleClass('hidden');
          });
        });
      },
      replace: true,
      restrict: 'E',
      scope: { region: '=' },
      templateUrl: 'views/region-data/more.html'
    };
  });
