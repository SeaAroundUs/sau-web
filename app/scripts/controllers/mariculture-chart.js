'use strict';

/* global colorbrewer */ /* for jshint */

angular.module('sauWebApp').controller('MaricultureChartCtrl',
  function ($scope, $rootScope, $location, $filter, $q, sauAPI, spinnerState, sauChartUtils) {

    function init() {
      $scope.$watch('selectedProvince', onFormModelChange, true);
      $scope.$watch('formModel', onFormModelChange, true);
    }

    $scope.options = {
      chart: {
        type: 'stackedAreaChart',
        height: 504,
        margin : {
          right: 0,
          bottom: 16
        },
        x: function(d){return d[0];},
        y: function(d){return d[1];},
        transitionDuration: 0,
        useInteractiveGuideline: true,
        xAxis: {
          showMaxMin: false,
          tickValues: [1950,1960,1970,1980,1990,2000,2010,2020],
        },
        yAxis: {
          showMaxMin: false,
          axisLabel: $scope.formModel.measure.chartlabel
        },
        yAxisTickFormat: function(d) {
          //Make values "in thousands" or "in millions" depending on the measure.
          var magnitude = $scope.formModel.measure.value === 'tonnage' ? 3 : '6';
          return $filter('significantDigits')(d, magnitude);
        },
        cData: ['Stacked','Stream','Expanded'],
        legend: {
          updateState: false,
          dispatch: {
            /* When the user clicks on a taxon in the legend, take them to the "Key Information on Taxon" page.*/
            legendClick: function(taxon) {
              if ($scope.formModel.dimension.value === 'taxon' && taxon.key !== 'Others') {
                $location.path('/taxa/' + taxon.entity_id);
                $scope.$apply();
              }
            }
          }
        }
      }
    };

    $scope.colors = colorbrewer;

    $scope.color = $scope.colors.Spectral;

    function onFormModelChange() {
      updateData();
      updateYLabel();
      updateChartTitle();
      updateDataDownloadUrl();
    }

    function updateData() {
      if (!$scope.selectedProvince.feature) {
        return;
      }
      var data_options = {
        entity_id: $scope.selectedProvince.feature.entity_id,
        sub_unit_id: $scope.selectedProvince.feature.region_id,
        dimension: $scope.formModel.dimension.value
      };
      data_options.limit = $scope.formModel.limit.value;
      var data = sauAPI.MaricultureData.get(data_options, function() {
        $scope.data = data.data;
        $scope.showLegendLabelToggle = $scope.formModel.dimension.value === 'taxon';
        spinnerState.loading = false;
        $scope.$parent.$parent.showDownload = true;
        if ($scope.useScientificNames) {
          $scope.toggleTaxonNames();
          $scope.useScientificNames = true;
        }
      }, function() {
        $scope.noData = true;
        spinnerState.loading = false;
      });
      spinnerState.loading = true;
    }

    $scope.toggleTaxonNames = sauChartUtils.toggleTaxonNames($scope);

    function updateYLabel() {
      /* not sure why options is not updating on $scope.formModel change */
      $scope.options.chart.yAxis.axisLabel = $scope.formModel.measure.chartlabel;
      $scope.options.chart.yAxisTickFormat = function(d) {
        //Make values "in thousands" or "in millions" depending on the measure.
        var magnitude = $scope.formModel.measure.value === 'tonnage' ? 3 : '6';
        return $filter('significantDigits')(d, magnitude);
      };
    }

    function updateChartTitle() {
      $q.all([$scope.feature.$promise, $scope.countryFeatures.$promise]).then(function() {
        if($scope.selectedProvince.feature) {
          var countryName = $scope.selectedProvince.feature.country_name;
          var chartTitle = [
            'Mariculture production by',
            $scope.formModel.dimension.label,
            'in',
            countryName,
            ].join(' ');

          if ($scope.selectedProvince.feature &&
            $scope.selectedProvince.feature.title !== 'All') {
            chartTitle += ' - ' + $scope.selectedProvince.feature.title;
          }
          $scope.updateChartTitle(chartTitle);
        }
      });
    }

    function updateDataDownloadUrl() {
      if (!$scope.selectedProvince.feature) {
        return '';
      }
      var url = [
        sauAPI.apiURL,
        'mariculture/',
        $scope.formModel.dimension.value,
        '/',
        $scope.selectedProvince.feature.entity_id,
        '?format=csv&limit=',
        $scope.formModel.limit.value,
      ].join('');

      if ($scope.selectedProvince.feature.region_id) {
        url += '&sub_unit_id=' + $scope.selectedProvince.feature.region_id;
      }
      $scope.updateDataDownloadUrl(url);
    }

    init();

  });
