;(function() {

  'use strict';

  // jshint expr:true

  angular.module('sauWebApp')
    .controller('RootCtrl', function ($scope, $location, toggles, mainMapRegionConfig) {
      $scope.$on('$routeChangeSuccess', function(evt, location) {
        $scope.showMobileMenu = false;
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
                $scope.subtemplates[toggles.isEnabled('spatial') ? 5 : 4].class = 'selected';
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
              $scope.subtemplates[toggles.isEnabled('spatial') ? 3 : 2].class = 'selected';
              break;
            case 'TopicBiodiversityCtrl':
              $scope.subtemplates[toggles.isEnabled('spatial') ? 4 : 3].class = 'selected';
              break;
            case 'MarineTrophicIndexSearchCtrl':
              $scope.subtemplates[toggles.isEnabled('spatial') ? 6 : 5].class = 'selected';
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
        {name: 'Tools & Data', url: '/data/#/eez', 'class': 'selected'},
        {name: 'Getting started', url: '/tools-guide/'},
        {name: 'Publications', url: '/articles/'},
        {name: 'News', url: '/about/'},
        {name: 'Projects', url: '/information-by-topic/'},
        {name: 'Partners', url: '/collaborations/'},
        {name: 'Help', url: '/faq/'}
      ];
      $scope.template = $scope.templates[0];

      $scope.subtemplates = [
        {
          name: 'Basic search',
          dropdown: [
            {name: 'EEZ', url: '#' + mainMapRegionConfig.getConfig('eez').path},
            {name: 'LME', url: '#' + mainMapRegionConfig.getConfig('lme').path},
            {name: 'RFMO', url: '#' + mainMapRegionConfig.getConfig('rfmo').path},
            {name: 'High seas', url: '#' + mainMapRegionConfig.getConfig('highseas').path},
            {name: 'Global', url: '#/global'},
            {name: 'FAO area', url: '#' + mainMapRegionConfig.getConfig('fao').path},
            {name: 'Fishing country', url: '#' + mainMapRegionConfig.getConfig('fishing-entity').path}
          ]
        },
        {name: 'Advanced Search', url: '#/search/'},
        {name: 'Mapped Catch', url: '#/spatial-catch'},
        {name: 'Fisheries Economics', url: '#/feru'},
        {name: 'Biodiversity', url: '#/topic/biodiversity'},
        {name: 'Mariculture', url: '#/mariculture'},
        {name: 'Marine Trophic Index', url: '#/marine-trophic-index'}
      ];
      $scope.subtemplate = $scope.subtemplates[0];

      if (!toggles.isEnabled('spatial')) {
        $scope.subtemplates.splice(2,1);
      }

      if (!toggles.isEnabled('highseas')) {
        $scope.subtemplates[0].dropdown.splice(3, 1);
      }

      if (!toggles.isEnabled('global')) {
        $scope.subtemplates[0].dropdown.splice(4, 1);
      }

      if (!toggles.isEnabled(''))

      $scope.go = function(url) {
        window.location = url;
      };

      $scope.showMobileMenu = false;
      $scope.toggleMobileMenu = function () {
        $scope.showMobileMenu = !$scope.showMobileMenu;
      };
    });
})();
