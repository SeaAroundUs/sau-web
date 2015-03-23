'use strict';

angular.module('sauWebApp').controller('RegionDetailCtrl',
  function ($scope, $rootScope, $q, $routeParams, mapConfig, $location, $window, sauAPI, insetMapLegendData, externalURLs, $modal) {

  var region_id = $routeParams.id;

	function init() {
      $scope.chartChange('catch-chart');
    }

    $scope.getFeatures = function() {

      $scope.features = sauAPI.Regions.get({region:$scope.region.name});
      $scope.features.$promise.then(function(data) {
          angular.extend($scope, {
            geojson: {
              data: data.data,
              style: mapConfig.defaultStyle,
            }
          });
        });
    };

    $scope.getFeatures();

    $scope.center = {
      lat: 0,
      lng: 0,
      zoom: 3
    };

	var chartName;

    var tabs = {
      catchInfo: {title: 'Catch Info', template:'views/region-detail/catch.html'},
      biodiversity: {title: 'Biodiversity', template: 'views/region-detail/biodiversity.html'},
      ecosystems: {title: 'Ecosystems', template: 'views/region-detail/ecosystems.html'},
      ecosystemsLME: {title: 'Ecosystems', template: 'views/region-detail/ecosystems-lme.html'},
      ecosystemsHighSeas: {title: 'Ecosystems', template: 'views/region-detail/ecosystems-highseas.html'},
      governance: {title: 'Governance', template: 'views/region-detail/governance.html'},
      indicators: {title: 'Indicators', template: 'views/region-detail/indicators.html'},
      indicatorsHighSeas: {title: 'Indicators', template: 'views/region-detail/indicators-highseas.html'},
      otherTopics: {title: 'Other Topics', template: 'views/region-detail/other-topics.html'},
      feedback: {title: 'Feedback', template: 'views/region-detail/feedback.html'}
    };

    $scope.metricLinks = {
      'EEZ area': 'http://www.seaaroundus.org/doc/saup_manual.htm#15',
      'Shelf Area': 'http://www.seaaroundus.org/doc/saup_manual.htm#15',
      'Inshore Fishing Area (IFA)': 'http://www.seaaroundus.org/doc/ifa.htm',
      'Coral Reefs': 'http://www.seaaroundus.org/doc/saup_manual.htm#2',
      'Seamounts': 'http://www.seaaroundus.org/doc/saup_manual.htm#22',
      'Primary production': 'http://www.seaaroundus.org/doc/saup_manual.htm#3'
    };

    $scope.mapLayers = {
      selectedFAO: 0,
    };

    $scope.selectFAO = function(fao) {
      $scope.mapLayers.selectedFAO = fao;
    };

    $scope.eezManualURL = externalURLs.docs + 'saup_manual.htm#15';
    $scope.apiOrigin = (function() {
      var pathArray = sauAPI.apiURL.split('/');
      return pathArray[0] + '//' + pathArray[2];
    })();
    $scope.feature = null;
    $scope.chartTitle = null;

    $scope.chartChange = function(templateUrl) {
      chartName = templateUrl;
      $scope.chartTemplateUrl = 'views/region-detail/' + templateUrl + '.html';
    };

    $scope.updateChartTitle = function(title) {
      $scope.chartTitle = title;
    };

    $scope.updateDataDownloadUrl = function(url) {
      $scope.downloadUrl = url;
    };

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
    } else if ($scope.region.name === 'highseas') {
      $scope.tabs = [
        tabs.catchInfo,
        tabs.ecosystemsHighSeas,
        tabs.indicatorsHighSeas
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

    $scope.dimensions = [
      {label: 'Taxon', value: 'taxon'},
      {label: 'Commercial Groups', value: 'commercialgroup'},
      {label: 'Functional Groups', value: 'functionalgroup'},
      {label: 'Fishing Country', value: 'country'},
      // {label: 'Gear', value: 'gear'},
      {label: 'Fishing Sector', value: 'sector'},
      {label: 'Catch Type', value: 'catchtype', overrideLabel: 'Type'},
      {label: 'Reporting Status', value: 'reporting-status'}
    ];

    $scope.measures = {
      'tonnage': {label: 'Tonnage', value: 'tonnage', chartlabel: 'Catch (t x 1000)', titleLabel: 'Catches by'},
      'value': {label: 'Landed Value', value: 'value', chartlabel: 'Real 2000 value (million US$)', titleLabel: 'Real 2000 value (US$) by'}
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

      $scope.estuariesData = sauAPI.EstuariesData.get({region: $scope.region.name, region_id: $scope.formModel.region_id});
      if ($scope.region.name === 'global') {
        $location.path('/' + $scope.region.name, false);
      } else {
        var newPath = '/' + $scope.region.name + '/' + $scope.formModel.region_id;
        if (newPath !== $location.path()) {
          $location.path(newPath, false);
        }
      }
    };

    $scope.hoverRegion = $scope.feature;

    $scope.clickFormLink = function(dim, measure) {
      if (chartName !== 'catch-chart') { $scope.chartChange('catch-chart'); }
      $scope.formModel.dimension = dim;
      $scope.formModel.measure = $scope.measures[measure];
    };

    $scope.$watch('formModel.region_id', $scope.updateRegion);

    $scope.ecopathURL = null;
    $scope.$watch('formModel', function() {
        if ($scope.region.name === 'eez') {
          $scope.feature.$promise.then(function() {
            $scope.ecopathURL = 'http://www.ecopath.org/models/?m_terms=&m_EEZ=' +
              $scope.feature.data.fishbase_id +
              '&m_LME=&m_FAO=0&m_fYearPub=&m_tYearPub=&m_N=&m_S=&m_E=&m_W=&m_Or=&page=1&orderby=&m_asc=';
          });
        } else if ($scope.region.name === 'lme') {
          $scope.ecopathURL = 'http://www.ecopath.org/models/?m_terms=&m_EEZ=&m_LME='+
            $scope.formModel.region_id +
            '&m_FAO=0&m_fYearPub=&m_tYearPub=&m_N=&m_S=&m_E=&m_W=&m_Or=&page=1&orderby=&m_asc=';
        } else if ($scope.region.name === 'highseas') {
          $scope.ecopathURL = 'http://www.ecopath.org/index.php?name=Models&sub=Models&m_FAO='+
            $scope.formModel.region_id;
        }
    }, true);

    $scope.openDownloadDataModal = function() {
      $modal.open({
        templateUrl: 'views/download-data-modal.html',
        controller: 'DownloadDataModalCtrl',
        resolve: {
          dataUrl: function() {
            return $scope.downloadUrl;
          }
        }
      });
    };

    init();
});