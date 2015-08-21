'use strict';

angular.module('sauWebApp').controller('RegionDetailCtrl',
  function ($scope, $rootScope, $q, $routeParams, mapConfig, $location, $window, $timeout,
            sauAPI, insetMapLegendData, $modal, region, regionDimensions, regionMeasures,
            regionDimensionLimits, regionTabs, metricLinks, regionToggles, externalURLs) {

    $scope.toggles = regionToggles.getToggles(region);

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

      } else if ($scope.region.name === 'multi') {
        $location.search({
          chart: getDefaultChartId(),
          region: $location.search().region,
          id: $location.search().id,
          dimension: $location.search().dimension,
          measure: $location.search().measure,
          limit: $location.search().limit,
          sciname: $location.search().sciname
        }).replace();

      } else {
        $location.search({chart: getDefaultChartId()}).replace();
      }
    }

    $scope.getFeatures = function() {
      if ($scope.region.name === 'mariculture') {

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

      } else if ($scope.region.name === 'multi') {
        angular.noop(); //TODO ?

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

    $scope.metricLinks = metricLinks;

    $scope.mapLayers = {
      selectedFAO: undefined,
    };

    $scope.selectFAO = function(fao) {
      $scope.mapLayers.selectedFAO = fao.id;
    };

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

    $scope.tabs = regionTabs.getRegionTabs($scope.region.name);

    if ($scope.tabs.length) {
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
    }

    //TODO Move this data into chart controllers, as not all region-detail views are applicable to this data.
    $scope.dimensions = regionDimensions[$scope.region.name];
    $scope.measures = regionMeasures[$scope.region.name];
    $scope.limits = regionDimensionLimits[$scope.region.name];

    //TODO Get rid of formModel, as it is catch chart specific, and any non-generic code should go into the chart controller.
    $scope.formModel = {
      dimension: getDimensionObjectByValue(getDimensionFromURL()),
      measure: getMeasureObjectByValue(getMeasureFromURL()),
      limit : getLimitObjectByValue(getLimitFromURL()),
      region_id: parseInt(region_id),
      useScientificName: getUseScientificNameFromURL()
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

      } else if ($scope.region.name === 'multi') {
        //TODO ?

      } else {
        $scope.feature = sauAPI.Region.get({
          region: $scope.region.name,
          region_id: $scope.formModel.region_id,
          fao_id: $scope.mapLayers.selectedFAO
        });
        $scope.feature.$promise.then(function() {
          if($scope.region.name === 'lme') {
            // fishbase id is same as our id, fake it
            $scope.feature.data.fishbase_id = $scope.feature.data.id;
          }
          if ($scope.region.name === 'rfmo') {
            $scope.feature.data.metrics = $scope.feature.data.metrics.filter(function(metric) {
              return metric.title !== 'Inshore Fishing Area (IFA)';
            });

            $scope.rfmoLinks = {
              reportURL: externalURLs.s3Root +
                'legacy.seaaroundus/rfmo/FCWorkingPaper_RFMOs_CullisSuzukiPauly_2009.pdf',
              publicationURL: externalURLs.s3Root +
                'legacy.seaaroundus/rfmo/Cullis-Suzuki%26Pauly-2010-RFMO.pdf'
            };
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

      } else if ($scope.region.name === 'multi') {
        var regionType = $location.search().region;
        var regionIds = $location.search().id.split(',');
        var regionDetailPromises = regionIds.reduce(function(promises, regionId) {
          promises.push(sauAPI.Region.get({region: regionType, region_id: regionId }).$promise);
          return promises;
        }, []);

        $scope.selectedRegions = {
          type: regionType,
          ids: regionIds.map(function(id) { return parseInt(id); }),
          details: [],
          references: []
        };

        $q.all(regionDetailPromises).then(function(result) {
          $scope.selectedRegions.details = result.map(function(detail) {
            return { id: detail.data.id, name: detail.data.title, url: '#/' + regionType + '/' + detail.data.id };
          });

          $scope.selectedRegions.references = result.reduce(function(reference, detail) {
            reference = reference.concat(detail.data.reconstruction_documents);
            return reference;
          }, []);
        });

      } else {
        var newPath = '/' + $scope.region.name + '/' + $scope.formModel.region_id;
        if (newPath !== $location.path()) {
          $location.path(newPath, false);
        }
      }
    };

    $scope.hoverRegion = $scope.feature;

    $scope.$watch('formModel.region_id', $scope.updateRegion);

    $scope.$watch('feature.data.country_id', getCountryProfile, true);

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
      $location.search(angular.extend({}, $location.search(), searchArgs));
    };

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
        return $scope.measures[0].value;
      }
    }

    function getLimitFromURL() {
      var limitObj = getLimitObjectByValue($location.search().limit);
      if (limitObj) {
        return limitObj.value;
      } else {
        return $scope.limits[1].value;
      }
    }

    function getUseScientificNameFromURL() {
      //Reads the URL param value of "sciname" and determines its truthiness, converting it to a boolean.
      var sciNameUrlValue = $location.search().sciname;
      return sciNameUrlValue && sciNameUrlValue !== 'false' && Number(sciNameUrlValue) !== 0;
    }

    //Swaps out a new chart on the page based on what's in the URL Params.
    function setChartFromURLParams() {
      var currChart = $location.search().chart || getDefaultChartId();
      $scope.chartTemplateUrl = 'views/region-detail/' + currChart + '.html';
      if (currChart === 'catch-chart' || currChart === 'multi-chart') {
        $scope.formModel.dimension = getDimensionObjectByValue(getDimensionFromURL());
        $scope.formModel.measure = getMeasureObjectByValue(getMeasureFromURL());
        $scope.formModel.limit = getLimitObjectByValue(getLimitFromURL());
        $scope.formModel.useScientificName = getUseScientificNameFromURL();
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

    function getLimitObjectByValue(value) {
      var limit = null;
      angular.forEach($scope.limits, function(i) {
        if (i.value === value) { limit = i; }
      });
      return limit;
    }

    function getDefaultChartId() {
      var chartId;

      switch ($scope.region.name) {
        case 'mariculture':
          chartId = 'mariculture-chart';
          break;
        case 'multi':
          chartId = 'multi-chart';
          break;
        default:
          chartId = 'catch-chart';
      }

      return chartId;
    }

    function getCountryProfile() {
      if ($scope.region.name === 'eez' && $scope.feature.data && $scope.feature.data.country_id) {
        sauAPI.CountryProfile.get({region_id: $scope.feature.data.country_id}, function(data) {
          $scope.profile = data.data;
        });
      }
    }

    init();
  });
