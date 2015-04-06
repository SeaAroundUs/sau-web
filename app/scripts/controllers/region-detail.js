'use strict';

angular.module('sauWebApp').controller('RegionDetailCtrl',
  function ($scope, $rootScope, $q, $routeParams, mapConfig, $location, $window, sauAPI, insetMapLegendData, externalURLs, $modal, region) {

    $scope.region = {name: region};

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
      indicatorsLME: {title: 'Indicators', template: 'views/region-detail/indicators-lme.html'},
      indicatorsHighSeas: {title: 'Indicators', template: 'views/region-detail/indicators-highseas.html'},
      otherTopics: {title: 'Other Topics', template: 'views/region-detail/other-topics.html'},
      feedback: {title: 'Feedback', template: 'views/region-detail/feedback.html'}
    };

    $scope.metricLinks = {
      'EEZ area': externalURLs.manual + '#15',
      'Shelf Area': externalURLs.manual + '#15',
      'Inshore Fishing Area (IFA)': externalURLs.manual,
      'Coral Reefs': externalURLs.manual + '#2',
      'Seamounts': externalURLs.manual + '#22',
      'Primary production': externalURLs.manual + '#3'
    };

    $scope.mapLayers = {
      selectedFAO: 0,
    };

    $scope.selectFAO = function(fao) {
      $scope.mapLayers.selectedFAO = fao.id;
    };

    $scope.eezManualURL = externalURLs.manual + '#15';
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
        tabs.indicatorsLME
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
      {label: 'Commercial groups', value: 'commercialgroup'},
      {label: 'Functional groups', value: 'functionalgroup'},
      {label: 'Fishing country', value: 'country'},
      // {label: 'Gear', value: 'gear'},
      {label: 'Fishing sector', value: 'sector'},
      {label: 'Catch type', value: 'catchtype', overrideLabel: 'Type'},
      {label: 'Reporting status', value: 'reporting-status'}
    ];

    $scope.measures = {
      'tonnage': {label: 'Tonnage', value: 'tonnage', chartlabel: 'Catch (t x 1000)', titleLabel: 'Catches by'},
      'value': {label: 'Landed value', value: 'value', chartlabel: 'Real 2000 value (million US$)', titleLabel: 'Real 2000 value (US$) by'}
    };

    $scope.limits = [
      {label: '5', value: '5'},
      {label: '10', value: '10'},
      {label: '15', value: '15'},
      {label: '20', value: '20'}
    ];

    var dimension = $scope.dimensions[0];
    angular.forEach($scope.dimensions, function(dim) {
      if (dim.value === $routeParams.dimension) {
        dimension = dim;
      }
    });

    $scope.formModel = {
      dimension: dimension,
      measure: $scope.measures.tonnage,
      limit : $scope.limits[1],
      region_id: parseInt(region_id)
    };

    $scope.faos = $q.defer();

    if ($scope.region.name === 'eez') {
      $scope.faoData = sauAPI.Regions.get({region: 'fao'});
    }

    $scope.updateRegion = function() {

      $scope.estuariesURL = '#/'+$scope.region.name+'/'+$scope.formModel.region_id+'/estuaries';

      function getFAOName(faoId) {
        var allFAOData = $scope.faoData.data.features;
        for (var i = 0; i < allFAOData.length; i++) {
          if (allFAOData[i].properties.region_id === faoId) {
            return allFAOData[i].properties.long_title;
          }
        }
      }

      $scope.feature = sauAPI.Region.get({region: $scope.region.name, region_id: $scope.formModel.region_id}, function() {
        if($scope.region.name === 'lme') {
          // fishbase id is same as our id, fake it
          $scope.feature.data.fishbase_id = $scope.feature.data.id;
        }
      });

      if ($scope.region.name === 'eez') {

        $q.all([$scope.feature.$promise, $scope.faoData.$promise]).then(function() {
          var faosInThisRegion = [];
          if ($scope.feature.data.intersecting_fao_area_id !== null) {
            for (var i = 0; i < $scope.feature.data.intersecting_fao_area_id.length; i++) {
              var faoId = $scope.feature.data.intersecting_fao_area_id[i];
              faosInThisRegion[i] = {id: faoId, name: getFAOName(faoId)};
            }
          }
          $scope.faos.data = faosInThisRegion;
          $scope.faos.resolve();
        });
      }

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