'use strict';

angular.module('sauWebApp')
  .directive('regionDataMore', function($sce, $timeout, $interpolate, $compile, regionDataMoreLinks, sauAPI) {
    return {
      link: function(scope, ele) {
        var params;

        scope.trustAsHtml = $sce.trustAsHtml;

        scope.$watch('region', updateScope);

        $timeout(function() {
          var popup = angular.element('<div class="important-note-popup">' +
            '<div class="blue-bar"><span class="x"><i class="fa fa-times"></i></span></div>' +
            '<i class="fa fa-exclamation-triangle"></i> ' +
            regionDataMoreLinks.getImportantNote(scope.region) +
            '</div>'
          );

          ele.find('#important-note').append(popup);

          popup.find('.x').on('click', function () {
            popup.addClass('hidden');
          });

          ele.find('#important-link').on('click', function () {
            popup.toggleClass('hidden');
          });
        });

        function updateScope() {
          scope.moreData = angular.copy(regionDataMoreLinks.getLinks(scope.region));

          // handle url interpolation with region data
          if (scope.region.id) {
            params = { region: scope.region.name, region_id: scope.region.id };
            sauAPI.Region.get(params, function(res) {
              scope.moreData = scope.moreData.map(function(section) {
                if (section.links && section.links.length) {
                  section.links.forEach(function(link) {
                    if (link.ngUrl) {
                      link.url = $interpolate(link.ngUrl, false, null, true)(res.data);
                    }
                  });

                } else if (section.eachOf) {
                  section.links = res.data[section.eachOf].reduce(function(links, item) {
                    links.push({
                      text: $interpolate(section.text, false, null, true)(item),
                      url: $interpolate(section.url, false, null, true)(item)
                    });
                    return links;
                  }, []);
                }

                return section;
              });

              // open external links and PDFs in another tab
              $timeout(function() {
                ele.find('a').each(function(i, link) {
                  if (link.href && ((link.href.indexOf(link.baseURI) !== 0) || link.href.match(/\.pdf$/))) {
                    link.target = '_blank';
                  }
                });
              });
            });
          }
        }
      },
      replace: true,
      restrict: 'E',
      scope: { region: '=' },
      templateUrl: 'views/region-data/more.html'
    };
  });
