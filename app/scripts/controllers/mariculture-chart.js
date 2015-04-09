'use strict';

/* global colorbrewer */ /* for jshint */

angular.module('sauWebApp').controller('MaricultureChartCtrl',
  function ($scope, $rootScope, $filter, sauAPI, spinnerState) {

    function init() {
      $scope.$watch('formModel', onFormModelChange, true);
      updateDataDownloadUrl();
    }

    $scope.options = {
      chart: {
        type: 'stackedAreaChart',
        height: 304,
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
              if ($scope.formModel.dimension.value === 'taxon') {
                //Route user to "key information on taxon page" via the modal close event.
                $rootScope.modalInstance.close({location: '/taxa/' + taxon.entity_id});
              }
            }
          }
        }
      }
    };

    $scope.colors = colorbrewer;

    $scope.color = $scope.colors.Spectral;

    $scope.toggleTaxonNames = function() {
      //Swapping each datum's key between scientific name and common name.
      for (var i = 0; i < $scope.data.length; i++) {
        var temp = $scope.data[i].key;
        $scope.data[i].key = $scope.data[i].scientific_name;
        $scope.data[i].scientific_name = temp;
      }
      $scope.useScientificNames = !$scope.useScientificNames;
    };

    function onFormModelChange() {
      updateData();
      updateYLabel();
      updateChartTitle();
      updateDataDownloadUrl();
    }

    function updateData() {
      var data_options = {region_id: 4};
      data_options.limit = $scope.formModel.limit.value;
      var data = sauAPI.MaricultureData.get(data_options, function() {
        $scope.data = data.data;
        $scope.showLegendLabelToggle = $scope.formModel.dimension.value === 'taxon';
        spinnerState.loading = false;
      });
      spinnerState.loading = true;
    }

    $scope.toggleTaxonNames = function() {
      //Swapping each datum's key between scientific name and common name.
      for (var i = 0; i < $scope.data.length; i++) {
        var temp = $scope.data[i].key;

        // if there is no scientific name, don't toggle it
        if ($scope.data[i].scientific_name === undefined) {
          continue;
        }

        $scope.data[i].key = $scope.data[i].scientific_name;
        $scope.data[i].scientific_name = temp;
      }
      $scope.useScientificNames = !$scope.useScientificNames;
    };

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
      $scope.feature.$promise.then(function() {
        var chartTitle = $scope.formModel.measure.titleLabel + ' ' + $scope.formModel.dimension.label + ' in the ';
        chartTitle += 'waters of ' + $scope.feature.data.title;
        $scope.updateChartTitle(chartTitle);
      });
    }

    function updateDataDownloadUrl() {
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

      $scope.updateDataDownloadUrl(url);
    }

    init();

  });
