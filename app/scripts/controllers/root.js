;(function() {

  'use strict';

  angular.module('sauWebApp')
    .controller('RootCtrl', function ($scope, $location, toggles) {

      $scope.$on('$routeChangeSuccess', function(evt, location) {
        $scope.routeError = false;
        $scope.showCBDLogo = location.$$route &&
          (location.$$route.controller === 'MarineTrophicIndexCtrl' ||
           location.$$route.controller === 'MarineTrophicIndexSearchCtrl');

        $scope.templates[0].class = 'selected';
        $scope.templates[3].class = '';

        if (location.$$route) {
          clearSubtemplateSelection();
          switch (location.$$route.controller) {
            case 'MapCtrl':
              if (location.locals && location.locals.region === 'mariculture') {
                $scope.subtemplates[5].class = 'selected';
              } else {
                $scope.subtemplates[0].class = 'selected';
              }
              break;
            case 'AdvancedSearchCtrl':
              $scope.subtemplates[1].class = 'selected';
              break;
            case 'SpatialCatchMapCtrl':
              $scope.subtemplates[2].class = 'selected';
              break;
            case 'FERUCtrl':
              $scope.subtemplates[3].class = 'selected';
              break;
            case 'TopicBiodiversityCtrl':
              $scope.subtemplates[4].class = 'selected';
              break;
            case 'MarineTrophicIndexSearchCtrl':
              $scope.subtemplates[6].class = 'selected';
              break;
          }
        }

        function clearSubtemplateSelection() {
          $scope.subtemplates = $scope.subtemplates.map(function(st) {
            st.class = '';
            return st;
          });
        }
      });

      $scope.$on('$routeChangeError', function() {
        $scope.routeError = true;
      });

      var hiddenData = {
        eez: null,
        lme: null
      };

      $scope.$watch(function() { return $location.url(); }, function(url) {
        var splitURL = url.split('/');
        var region = splitURL[1];
        var regionId = splitURL[2];
        var subView = splitURL[3];
        $scope.hideView = hiddenData[region] &&
          hiddenData[region].indexOf(parseInt(regionId)) > -1 &&
          subView !== 'exploited-organisms';
      });

      $scope.templates = [
        {'name': 'View data', 'url': '/data/#/eez', 'class': 'selected'},
        {'name': 'Publications', 'url': '/articles/'},
        {'name': 'News & About', 'url': '/about/'},
        {'name': 'Topics', 'url': '/information-by-topic/'},
        {'name': 'Partners & sub-projects', 'url': '/collaborations/'},
        {'name': 'Contact Us', 'url': '/contact/'},
        {'name': 'Help', 'url': '/faq/'}
      ];
      $scope.template = $scope.templates[0];

      $scope.subtemplates = [
        {'name': 'By map', 'url': '#/eez'},
        {'name': 'Advanced Search', 'url': '#/search/'},
        {'name': 'Spatial Distribution Map', 'url': '#/spatial-catch'},
        {'name': 'Global Fisheries Economics', 'url': '#/feru'},
        {'name': 'Biodiversity', 'url': '#/topic/biodiversity'},
        {'name': 'Mariculture Production', 'url': '#/mariculture'},
        {'name': 'Marine Trophic Index', 'url': '#/marine-trophic-index'}
      ];
      $scope.subtemplate = $scope.subtemplates[0];

      if (!toggles.isEnabled('spatial')) {
        $scope.subtemplates.splice(2,1);
      }

      $scope.go = function(url) {
        window.location = url;
      };
    });
})();
