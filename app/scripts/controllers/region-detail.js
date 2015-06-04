'use strict';

angular.module('sauWebApp').controller('RegionDetailCtrl',
  function ($scope, $rootScope, $q, $routeParams, mapConfig, $location, $window, $timeout,
            sauAPI, insetMapLegendData, externalURLs, $modal, region, regionDimensions) {

    $scope.region = {name: region};
    $scope.showDownload = false;

    $scope.downloadModalGA = {
      category: 'DownloadModal',
      action: 'Open'
    };

    var region_id = $scope.region.name === 'global' ? 1: $routeParams.id;

    $scope.selectedProvince = {feature: null};

    $scope.onProvinceSelect = function(f) {
      $scope.selectedProvince.feature = f;
      $scope.$apply();
    };

    function init() {
      if ($scope.region.name === 'mariculture') {
        $scope.$watch('formModel.region_id', $scope.getFeatures);
      } else {
        $scope.getFeatures();
      }

      var rmLocationChangeEvent = $rootScope.$on('$locationChangeSuccess', setChartFromURLParams);

      $scope.$on('$destroy', function() {
        rmLocationChangeEvent();
      });

      if ($location.search().chart) {
        setChartFromURLParams();
      } else {
        $location.search({chart: getChartIdFromURL()}).replace();
      }
    }

    $scope.getFeatures = function() {
      if (region === 'mariculture') {

        $scope.countryFeatures = sauAPI.Regions.get({region: 'mariculture'});
        $scope.features = sauAPI.Mariculture.get({region_id: $scope.formModel.region_id});

        $scope.features.$promise.then(function() {
          var allProvinces = {
            title: 'All',
            entity_id: $scope.features.data[0].entity_id,
            country_name: $scope.features.data[0].country_name
          };

          if ($scope.noData === true) {
            $timeout(function() { $scope.api.update(); });
          }
          $scope.noData = false;

          $scope.features.data.unshift(allProvinces);
          $scope.selectedProvince.feature = $scope.features.data[0];
        }, function() {
          $scope.noData = true;
        });

      } else {
        $scope.features = sauAPI.Regions.get({region:$scope.region.name});
        $scope.features.$promise.then(function(data) {
            angular.extend($scope, {
              geojson: {
                data: data.data,
                style: mapConfig.defaultStyle,
              }
            });
          });
      }
    };

    $scope.center = {
      lat: 0,
      lng: 0,
      zoom: 3
    };

    var tabs = {
      catchInfo: {title: 'Catch Info', template:'views/region-detail/catch.html'},
      biodiversity: {title: 'Biodiversity', template: 'views/region-detail/biodiversity.html'},
      biodiversityLME: {title: 'Biodiversity', template: 'views/region-detail/biodiversity-lme.html'},
      biodiversityGlobal: {title: 'Biodiversity', template: 'views/region-detail/biodiversity-global.html'},
      ecosystems: {title: 'Ecosystems', template: 'views/region-detail/ecosystems.html'},
      ecosystemsLME: {title: 'Ecosystems', template: 'views/region-detail/ecosystems-lme.html'},
      ecosystemsHighSeas: {title: 'Ecosystems', template: 'views/region-detail/ecosystems-highseas.html'},
      ecosystemsGlobal: {title: 'Ecosystems', template: 'views/region-detail/ecosystems-global.html'},
      governance: {title: 'Governance', template: 'views/region-detail/governance.html'},
      indicators: {title: 'Indicators', template: 'views/region-detail/indicators.html'},
      indicatorsLME: {title: 'Indicators', template: 'views/region-detail/indicators-lme.html'},
      indicatorsHighSeas: {title: 'Indicators', template: 'views/region-detail/indicators-highseas.html'},
      indicatorsGlobal: {title: 'Indicators', template: 'views/region-detail/indicators-global.html'},
      productionInfo: {title: 'Production Info', template: 'views/region-detail/production-info.html'},
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
      selectedFAO: undefined,
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
        tabs.biodiversityGlobal,
        tabs.ecosystemsGlobal,
        tabs.indicatorsGlobal,
        tabs.otherTopics
      ];
    } else if ($scope.region.name === 'rfmo') {
      $scope.tabs = [
        tabs.catchInfo,
        tabs.governance
      ];
    } else if ($scope.region.name === 'lme') {
      $scope.tabs = [
        tabs.catchInfo,
        tabs.biodiversityLME,
        tabs.ecosystemsLME,
        tabs.indicatorsLME
      ];
    } else if ($scope.region.name === 'highseas') {
      $scope.tabs = [
        tabs.catchInfo,
        tabs.ecosystemsHighSeas,
        tabs.indicatorsHighSeas
      ];
    } else if ($scope.region.name === 'mariculture') {
      $scope.tabs = [
        tabs.productionInfo
      ];
    } else {
      $scope.tabs = [
        tabs.catchInfo,
        tabs.biodiversity,
        tabs.ecosystems,
        tabs.governance,
        tabs.indicators
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

    $scope.dimensions = regionDimensions[$scope.region.name];

    $scope.measures = {
      'tonnage': {label: 'Tonnage', value: 'tonnage', chartlabel: 'Catch (t x 1000)', titleLabel: 'Catches by'},
      'value': {label: 'Landed value', value: 'value', chartlabel: 'Real 2005 value (million US$)', titleLabel: 'Real 2005 value (US$) by'}
    };

    $scope.limits = [
      {label: '5', value: '5'},
      {label: '10', value: '10'},
      {label: '15', value: '15'},
      {label: '20', value: '20'}
    ];

    //TODO Get rid of formModel, as it is catch chart specific, and any non-generic code should go into the chart controller.
    $scope.formModel = {
      dimension: getDimensionObjectByValue(getDimensionFromURL()),
      measure: getMeasureObjectByValue(getMeasureFromURL()),
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

      if ($scope.region.name === 'mariculture') {
        $scope.feature = sauAPI.Region.get({region: 'mariculture', region_id: $scope.formModel.region_id});
      } else {
        $scope.feature = sauAPI.Region.get({region: $scope.region.name, region_id: $scope.formModel.region_id, fao_id: $scope.mapLayers.selectedFAO});
        $scope.feature.$promise.then(function() {
          if($scope.region.name === 'lme') {
            // fishbase id is same as our id, fake it
            $scope.feature.data.fishbase_id = $scope.feature.data.id;
          }
        });
      }

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

          $scope.fishParametersURL = 'http://www.fishbase.org/report/KeyFactsMatrixList.php?c_code=' +
            $scope.feature.data.c_code + '&sb=1&disabled=1&fsb=0&custom=1';
        });
      } else if ($scope.region.name === 'global') {
        //TODO get geojson
        $scope.faos.data = [
          { id: 1, name: 'EEZs of the world' },
          { id: 2, name: 'High Seas of the world' }
        ];
        $scope.faos.resolve();
      }

      if ($scope.region.name === 'global') {
        if ($location.path() !== '/global') {
          $location.path('/global', false);
        }
      } else {
        var newPath = '/' + $scope.region.name + '/' + $scope.formModel.region_id;
        if (newPath !== $location.path()) {
          $location.path(newPath, false);
        }
      }
    };

    $scope.hoverRegion = $scope.feature;

    $scope.$watch('formModel.region_id', $scope.updateRegion);

    $scope.$watch('mapLayers.selectedFAO', $scope.updateRegion);

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

    $scope.setURLParams = function(searchArgs) {
      $location.search(searchArgs);
    };

    function getChartIdFromURL() {
      var fallbackChart = $scope.region.name === 'mariculture' ? 'mariculture-chart' : 'catch-chart';
      return $location.search().chart || fallbackChart;
    }

    function getDimensionFromURL() {
      var dimensionObj = getDimensionObjectByValue($location.search().dimension);
      if (dimensionObj) {
        return dimensionObj.value;
      } else {
        return $scope.dimensions[0].value;
      }
    }

    function getMeasureFromURL() {
      var measureObj = getMeasureObjectByValue($location.search().measure);
      if (measureObj) {
        return measureObj.value;
      } else {
        return $scope.measures.tonnage.value;
      }
    }

    //Swaps out a new chart on the page based on what's in the URL Params.
    function setChartFromURLParams() {
      var currChart = getChartIdFromURL();
      $scope.chartTemplateUrl = 'views/region-detail/' + currChart + '.html';
      if (currChart === 'catch-chart') {
        $scope.formModel.dimension = getDimensionObjectByValue(getDimensionFromURL());
        $scope.formModel.measure = getMeasureObjectByValue(getMeasureFromURL());
      }
    }

    function getDimensionObjectByValue(value) {
      var dimension = null;
      angular.forEach($scope.dimensions, function(i) {
        if (i.value === value) { dimension = i; }
      });
      return dimension;
    }

    function getMeasureObjectByValue(value) {
      var measure = null;
      angular.forEach($scope.measures, function(i) {
        if (i.value === value) { measure = i; }
      });
      return measure;
    }

    init();
  });
