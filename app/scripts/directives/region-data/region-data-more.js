'use strict';

angular.module('sauWebApp')
  .directive('regionDataMore', function($sce, $timeout, $interpolate, $compile, $q,
                                        regionDataMoreLinks, sauAPI, underReviewList) {
    return {
      link: function(scope, ele) {

        scope.trustAsHtml = $sce.trustAsHtml;

        scope.$watch('region', updateScope, true);

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
          var anyUnderReview;

          scope.moreData = angular.copy(regionDataMoreLinks.getLinks(scope.region));

          // handle url interpolation with single region data
          if (scope.region.id) {
            sauAPI.Region.get({ region: scope.region.name, region_id: scope.region.id }, function(res) {
              var fishBaseId;

              scope.data = res.data; // expose data to scope for template

              if (scope.region.name === 'eez') {
                fishBaseId = res.data.fishbase_id;

                scope.fishbaseLinks = [
                  { label: 'Marine fishes', url: 'http://www.fishbase.org/Country/CountryChecklist.php?c_code='+ fishBaseId +'&vhabitat=saltwater&csub_code=' },
                  { label: 'Fresh water fishes', url: 'http://www.fishbase.org/Country/CountryChecklist.php?c_code='+ fishBaseId +'&vhabitat=fresh&csub_code=' },
                  { label: 'Pelagic fishes', url: 'http://www.fishbase.org/Country/CountryChecklist.php?c_code='+ fishBaseId +'&vhabitat=pelagic&csub_code=' },
                  { label: 'Reef fishes', url: 'http://www.fishbase.org/Country/CountryChecklist.php?c_code='+ fishBaseId +'&vhabitat=reef&csub_code=' },
                  { label: 'Deep water fishes', url: 'http://www.fishbase.org/Country/CountryChecklist.php?c_code='+ fishBaseId +'&vhabitat=deepwater&csub_code=' },
                  { label: 'Threatened fishes', url: 'http://www.fishbase.org/Country/CountryChecklist.php?c_code='+ fishBaseId +'&vhabitat=threatened&csub_code=' }
                ];

                scope.sealifebaseLinks = [
                  { label: 'Non-fish marine vertebrates', url: 'http://www.sealifebase.org/speciesgroup/index.php?group=nonfishvertebrates&c_code='+ fishBaseId +'&action=list' },
                  { label: 'Crustaceans', url: 'http://www.sealifebase.org/speciesgroup/index.php?group=crustaceans&c_code='+ fishBaseId +'&action=list' },
                  { label: 'Mollusks', url: 'http://www.sealifebase.org/speciesgroup/index.php?group=mollusks&c_code='+ fishBaseId +'&action=list' },
                  { label: 'Echinoderms', url: 'http://www.sealifebase.org/speciesgroup/index.php?group=echinoderms&c_code='+ fishBaseId +'&action=list' },
                  { label: 'Coelenterates', url: 'http://www.sealifebase.org/speciesgroup/index.php?group=coelenterates&c_code='+ fishBaseId +'&action=list' },
                  { label: 'Threatened non-fish organisms', url: 'http://www.sealifebase.org/Country/CountryChecklist.php?c_code='+ fishBaseId +'&vhabitat=threatened&csub_code=' }
                ];

                scope.data.fao_rfb = scope.data.fao_rfb.reduce(function(html, rfb) {
                  return html + '<div class="fao-rfb"><a href="' + rfb.url + '" target="_blank">' + rfb.name + '</a></div>'
                }, '');

              } else if (scope.region.name === 'lme') {
                scope.data.sealifebaseLink = scope.data.fishbase_link.replace('fishbase.org', 'sealifebase.org');
              }

              scope.moreData = scope.moreData.map(function(section) {
                if (section.links && section.links.length) {
                  section.links.forEach(function(link) {
                    if (link.ngText) {
                      link.text = $interpolate(link.ngText, false, null, true)(res.data);
                    }

                    if (link.ngUrl) {
                      link.url = $interpolate(link.ngUrl, false, null, true)(res.data);
                    }

                    if (link.subRegion && scope.region.faoId) {
                      link.url += (link.url.indexOf('?') === -1 ? '?' : '&') + 'subRegion=' + scope.region.faoId;
                    }
                  });

                } else if (section.eachOf) {
                  anyUnderReview = false;

                  section.links = res.data[section.eachOf].reduce(function(links, item) {
                    var underReview = false;
                    var regionName = ['eez', 'eez-bordering', 'country-eezs'].indexOf(scope.region.name) ?
                      'eez' :
                      scope.region.name;

                    if (underReviewList.isUnderReview({ name: regionName, ids: [item.id] })) {
                      underReview = true;
                      anyUnderReview = true;
                    }

                    links.push({
                      text: $interpolate(section.text, false, null, true)(item),
                      url: $interpolate(section.url, false, null, true)(item),
                      underReview: underReview
                    });

                    return links;
                  }, []);
                  section.underReview = anyUnderReview;
                }

                return section;
              });

              // remove sections with all empty links
              scope.moreData = scope.moreData.reduce(function(sections, section) {
                if (!section.links || !section.links.every(function(link) { return !link.url; })) {
                  sections.push(section);
                }
                return sections;
              }, []);

              // open external links and PDFs in another tab TODO is this working right?
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
            case 'eez':
            case 'eez-bordering':
              sectionTitle += 'EEZs';
              break;
            case 'lme':
              sectionTitle += 'LMEs';
              break;
          }

          $q.all(scope.region.ids.map(function(id) {
            return sauAPI.Region.get({ region: scope.region.name, region_id: id }).$promise;
          })).then(function(res) {
            var anyUnderReview = false;
            var links = res.map(function(region) {
              var link;

              // push taxa to scope for template
              if (scope.region.name === 'taxa') {
                scope.taxa = scope.taxa || [];
                scope.taxa.push(region.data);
              }

              link = scope.region.name === 'taxa' ?
                { text: region.data.common_name, url: '#/taxon/' + region.data.taxon_key } :
                { text: region.data.title, url: '#/' + scope.region.name + '/' + region.data.id };

              if (underReviewList.isUnderReview({ name: scope.region.name, ids: [region.data.id] })) {
                link.underReview = true;
                anyUnderReview = true;
              }

              return link;
            });

            scope.moreData.unshift({
              section: sectionTitle,
              class: 'vertical',
              links: links,
              underReview: anyUnderReview
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
