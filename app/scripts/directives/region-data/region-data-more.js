'use strict';

angular.module('sauWebApp')
  .directive('regionDataMore', function($sce, $timeout, $interpolate, $compile, $q, regionDataMoreLinks, sauAPI) {
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

          popup.find('.x').on('click', function() {
            popup.addClass('hidden');
          });

          ele.find('#important-link').on('click', function() {
            popup.toggleClass('hidden');
          });
        });

        function updateScope() {
          scope.moreData = angular.copy(regionDataMoreLinks.getLinks(scope.region));

          // handle url interpolation with single region data
          if (scope.region.id) {
            params = { region: scope.region.name, region_id: scope.region.id };
            sauAPI.Region.get(params, function(res) {
              scope.data = res.data; // expose data to scope for template

              scope.moreData = scope.moreData.map(function(section) {
                if (section.links && section.links.length) {
                  section.links.forEach(function(link) {
                    if (link.ngText) {
                      link.text = $interpolate(link.ngText, false, null, true)(res.data);
                    }

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

              // remove sections with all empty links
              scope.moreData = scope.moreData.reduce(function(sections, section) {
                if (!section.links || section.links.every(function(link) { return link.url; })) {
                  sections.push(section);
                }
                return sections;
              }, []);

              // open external links and PDFs in another tab
              $timeout(function() {
                ele.find('a').each(function(i, link) {
                  if (link.href && ((link.href.indexOf(link.baseURI) !== 0) || link.href.match(/\.pdf$/))) {
                    link.target = '_blank';
                  }
                });
              });
            });

          // handle multiple regions
          } else {
            // remove sections with all empty links
            scope.moreData = scope.moreData.reduce(function(sections, section) {
              if (section.eachOf) {
                return sections;
              }

              if (!section.links || section.links.every(function(link) { return link.url; })) {
                sections.push(section);
              }
              return sections;
            }, []);

            // add section for multiple regions
            addMultipleRegionsSection();
          }
        }

        function addMultipleRegionsSection() {
          var sectionTitle = 'Selected ';

          switch(scope.region.name) {
            case 'rfmo':
                  sectionTitle += 'RFMOs';
                  break;
            case 'fishing-entity':
              sectionTitle += 'fishing entities';
              break;
            case 'country-eezs':
              sectionTitle += 'country EEZs';
              break;
            case 'taxa':
              sectionTitle = 'View taxon page';
              break;
            case 'fao':
              sectionTitle += 'FAOs';
              break;
            case 'eez-bordering':
              sectionTitle += 'EEZs';
              break;
          }

          $q.all(scope.region.ids.map(function(id) {
            return sauAPI.Region.get({ region: scope.region.name, region_id: id }).$promise;
          })).then(function(res) {
            var links = res.map(function(region) {
              // push taxa to scope for template
              if (scope.region.name === 'taxa') {
                scope.taxa = scope.taxa || [];
                scope.taxa.push(region.data);
              }

              return scope.region.name === 'taxa' ?
                { text: region.data.common_name, url: '#/taxon/' + region.data.taxon_key } :
                { text: region.data.title, url: '#/' + scope.region.name + '/' + region.data.id };
            });

            scope.moreData.unshift({
              section: sectionTitle,
              class: 'vertical',
              links: links
            });
          });
        }
      },
      replace: true,
      restrict: 'E',
      scope: { region: '=' },
      templateUrl: 'views/region-data/more.html'
    };
  });
