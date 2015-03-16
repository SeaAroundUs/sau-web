'use strict';

angular.module('sauWebApp').controller('RegionDetailCtrl',
  function ($scope, $rootScope, $q, $routeParams, $location, $window, sauAPI, region_id, insetMapLegendData) {

    var tabs = {
      catchInfo: {title: 'Catch Info', template:'views/region-detail/catch.html'},
      biodiversity: {title: 'Biodiversity', template: 'views/region-detail/biodiversity.html'},
      ecosystems: {title: 'Ecosystems', template: 'views/region-detail/ecosystems.html'},
      ecosystemsLME: {title: 'Ecosystems', template: 'views/region-detail/ecosystems-lme.html'},
      governance: {title: 'Governance', template: 'views/region-detail/governance.html'},
      indicators: {title: 'Indicators', template: 'views/region-detail/indicators.html'},
      otherTopics: {title: 'Other Topics', template: 'views/region-detail/other-topics.html'},
      feedback: {title: 'Feedback', template: 'views/region-detail/feedback.html'}
    };

    $scope.feature = null;

    $scope.viewContentLoaded = $q.defer();

    $scope.chartTemplate = 'views/region-detail/catch-chart.html';

    $scope.chartChange = function(type) {
      $scope.chartTemplate = 'views/region-detail/' + type + '.html';
    };

    $rootScope.modalInstance.opened.then(function() {
      $scope.viewContentLoaded.resolve();
    });

    $scope.viewContentLoaded.promise.then(function() {
      //Build the legend out based on the region type.
      $scope.legendKeys = insetMapLegendData[$scope.region.name];

      if ($scope.region.name === 'global') {
        $scope.tabs = [
          tabs.catchInfo,
          tabs.biodiversity,
          tabs.ecosystems,
          tabs.otherTopics
          // tabs.feedback
        ];
      } else if ($scope.region.name === 'rfmo') {
        $scope.tabs = [
          tabs.catchInfo,
          tabs.governance
          // tabs.feedback
        ];
      } else if ($scope.region.name === 'lme') {
        $scope.tabs = [
          tabs.catchInfo,
          tabs.biodiversity,
          tabs.ecosystemsLME,
          tabs.indicators
          // tabs.feedback
        ];
      } else {
        $scope.tabs = [
          tabs.catchInfo,
          tabs.biodiversity,
          tabs.ecosystems,
          tabs.governance,
          tabs.indicators
          // tabs.feedback
        ];
      }

      for (var i=0; i<$scope.tabs.length; i++) {
        $scope.tabs[i].active = false;
      }
      if ($routeParams.tab) {
        // allow ?tab=N to select the Nth tab on load. Until we can
        // fully support tabs changing this query parameter,
        // just immediately drop the parameter from the search
        // args to avoid confusion with the URL.  --jls
        $scope.tabs[$routeParams.tab].active = true;
        $location.search('tab', null);
      } else {
        $scope.tabs[0].active = true;
      }
    });

    $scope.dimensions = [
      {label: 'Taxon', value: 'taxon'},
      {label: 'Commercial Groups', value: 'commercialgroup'},
      {label: 'Functional Groups', value: 'functionalgroup'},
      {label: 'Fishing Country', value: 'country'},
      // {label: 'Gear', value: 'gear'},
      {label: 'Fishing Sector', value: 'sector'},
      {label: 'Catch Type', value: 'catchtype'},
      {label: 'Reporting Status', value: 'reporting-status'}
    ];

    $scope.measures = {
      'tonnage': {label: 'Tonnage', value: 'tonnage', chartlabel: 'Catch (t x 1000)', titleLabel: 'Landings by'},
      'value': {label: 'Landed Value', value: 'value', chartlabel: 'Real 2000 value (million US$)', titleLabel: 'Real 2000 value (US$)'}
    };

    $scope.limits = [
      {label: '5', value: '5'},
      {label: '10', value: '10'},
      {label: '15', value: '15'},
      {label: '20', value: '20'}
    ];

    $scope.formModel = {
      dimension: $scope.dimensions[0],
      measure: $scope.measures.tonnage,
      limit : $scope.limits[1],
      region_id: parseInt(region_id)
    };

    $scope.updateRegion = function() {
      $scope.feature = sauAPI.Region.get({region: $scope.region.name, region_id: $scope.formModel.region_id});

      if ($scope.region.name === 'eez') {
        $scope.feature.$promise.then(function() {
          $scope.faos = $scope.feature.data.intersecting_fao_area_id;
        });
      }

      $scope.selectedFAO = 0;
      $scope.selectFAO = function(fao) {
        $scope.selectedFAO = fao;
      };



      $scope.estuariesData = sauAPI.EstuariesData.get({region: $scope.region.name, region_id: $scope.formModel.region_id});
      if ($scope.region.name === 'global') {
        $location.path('/' + $scope.region.name, false);
      } else {
        $location.path('/' + $scope.region.name + '/' + $scope.formModel.region_id, false);
      }
    };

    $scope.hoverRegion = $scope.feature;

    $scope.close = function () {
      $rootScope.modalInstance.close();
    };

    $scope.download = function() {
      // FIXME: constructing url manually, I don't know how to get it out of the $resource
      // This should probably be in a service or something too.
      var url = ['',
        sauAPI.apiURL,
        $scope.region.name,
        '/',
        $scope.formModel.measure.value,
        '/',
        $scope.formModel.dimension.value,
        '/?format=csv&limit=',
        $scope.formModel.limit.value,
        '&region_id=',
        $scope.formModel.region_id,
      ].join('');
      $window.open(url, '_blank');
    };

    $scope.clickFormLink = function(dim, measure) {
      $scope.formModel.dimension = dim;
      $scope.formModel.measure = $scope.measures[measure];
    };

    $scope.$watch('formModel.region_id', $scope.updateRegion);

    $scope.ecopathURL = null;
    $scope.$watch('feature', function() {
      if($scope.feature.data) {
        if ($scope.region.name === 'eez') {
          $scope.ecopathURL = 'http://www.ecopath.org/models/?m_terms=&m_EEZ=' +
            $scope.feature.data.fishbase_id +
            '&m_LME=&m_FAO=0&m_fYearPub=&m_tYearPub=&m_N=&m_S=&m_E=&m_W=&m_Or=&page=1&orderby=&m_asc=';
        } else if ($scope.region.name === 'lme') {
          $scope.ecopathURL = 'http://www.ecopath.org/models/?m_terms=&m_EEZ=&m_LME='+
            $scope.formModel.region_id +
            '&m_FAO=0&m_fYearPub=&m_tYearPub=&m_N=&m_S=&m_E=&m_W=&m_Or=&page=1&orderby=&m_asc=';
        } else if ($scope.region.name === 'highseas') {
          $scope.ecopathURL = 'http://www.ecopath.org/index.php?name=Models&sub=Models&m_FAO='+
            $scope.formModel.region_id;
        }
      }
    }, true);


});