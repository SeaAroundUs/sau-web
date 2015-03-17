'use strict';

angular.module('sauWebApp').controller('RegionDetailCtrl',
  function ($scope, $rootScope, $q, $routeParams, $location, $window, sauAPI, region_id, insetMapLegendData) {

    function init() {
      $scope.chartChange('catch-chart');
    }
    
    var chartName;
    $scope.feature = null;
    $scope.chartTitle = null;
    $scope.viewContentLoaded = $q.defer();

    $scope.chartChange = function(templateUrl) {
      chartName = templateUrl;
      $scope.chartTemplateUrl = 'views/region-detail/' + templateUrl + '.html';
    };

    $scope.updateChartTitle = function(title) {
      $scope.chartTitle = title;
    };

    $scope.updateDataDownloadUrl = function(url) {
      $scope.downloadUrl = url;
    }

    $rootScope.modalInstance.opened.then(function() {
      $scope.viewContentLoaded.resolve();
    });

    $scope.viewContentLoaded.promise.then(function() {
      //Build the legend out based on the region type.
      $scope.legendKeys = insetMapLegendData[$scope.region.name];

      if ($scope.region.name === 'global') {
        $scope.tabs = [
          {title: 'Catch Info',   template:'views/region-detail/catch.html'},
          {title: 'Biodiversity', template: 'views/region-detail/biodiversity.html'},
          {title: 'Ecosystems',   template: 'views/region-detail/ecosystems.html'},
          {title: 'Other Topics', template: 'views/region-detail/other-topics.html'}
          // {title: 'Feedback',     template: 'views/region-detail/feedback.html'}
        ];
      } else if ($scope.region.name === 'rfmo') {
        $scope.tabs = [
          {title: 'Catch Info',   template:'views/region-detail/catch.html'},
          {title: 'Governance',   template: 'views/region-detail/governance-rfmo.html'}
          // {title: 'Feedback',     template: 'views/region-detail/feedback.html'}
        ];
      } else {
        $scope.tabs = [
          {title: 'Catch Info',   template:'views/region-detail/catch.html'},
          {title: 'Biodiversity', template: 'views/region-detail/biodiversity.html'},
          {title: 'Ecosystems',   template: 'views/region-detail/ecosystems.html'},
          {title: 'Governance',   template: 'views/region-detail/governance.html'},
          {title: 'Indicators',   template: 'views/region-detail/indicators.html'}
          // {title: 'Feedback',     template: 'views/region-detail/feedback.html'}
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
      {label: 'Commercial Group', value: 'commercialgroup'},
      {label: 'Functional Group', value: 'functionalgroup'},
      {label: 'Country', value: 'country'},
      // {label: 'Gear', value: 'gear'},
      {label: 'Sector', value: 'sector'},
      {label: 'Catch Type', value: 'catchtype'},
    ];

    $scope.measures = {
      'tonnage': {label: 'Tonnage', value: 'tonnage', chartlabel: 'Catch (t x 1000)', titleLabel: 'Landings by'},
      'value': {label: 'Landed Value', value: 'value', chartlabel: 'Real 2000 value (million US$)', titleLabel: 'Real 2000 value (US$) by'}
    };

    $scope.limits = [
      {label: '20', value: '20'},
      {label: '10', value: '10'},
      {label: '5', value: '5'},
      {label: '1', value: '1'},
    ];

    $scope.formModel = {
      dimension: $scope.dimensions[0],
      measure: $scope.measures.tonnage,
      limit : $scope.limits[1],
      region_id: parseInt(region_id)
    };

    $scope.updateRegion = function() {
      $scope.feature = sauAPI.Region.get({region: $scope.region.name, region_id: $scope.formModel.region_id});
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

    $scope.clickFormLink = function(dim, measure) {
      if (chartName !== 'catch-chart') { $scope.chartChange('catch-chart'); }
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

    init();
});