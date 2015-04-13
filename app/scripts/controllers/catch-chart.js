'use strict';

/* global colorbrewer */
/* global d3 */

angular.module('sauWebApp').controller('CatchChartCtrl',
  function ($scope, $rootScope, $filter, $location, $timeout, sauAPI, spinnerState) {

    function init() {
      $scope.declarationYear = {enabled: true};
      if ($scope.region.name === 'eez') {
        $scope.declarationYear.show = true;
      }

      $scope.$watch('formModel', onFormModelChange, true);
      $scope.$watch('color', $scope.updateColor);
      updateDataDownloadUrl();
    }

    $scope.drawDeclarationYear = function() {
      $scope.declarationYear.enabled = true;
      $timeout(function() {
        $scope.feature.$promise.then(function(){
          var chart = $scope.api.getScope().chart;
          var container = d3.select('.chart-container svg .nv-stackedarea');

          var x = chart.xAxis.scale()($scope.feature.data.year_started_eez_at);
          var g = container.append('g');
          g.attr('id', 'declaration-year');
          g.append('line')
            .attr({
              x1: x,
              y1: 0.0,
              x2: x,
              y2: chart.yAxis.scale()(0)
            })
            .style('stroke', '#2daf51')
            .style('stroke-width', '1');

          g.append('text')
            .attr({
              fill: '#000',
              style: 'font-style: italic;',
              transform: 'translate('+(x+15)+',130) rotate(270,0,0)'
            })
            .text('EEZ declaration year');
        });
      });
    };
    $scope.hideDeclarationYear = function() {
      $scope.declarationYear.enabled = false;
      d3.select('.chart-container svg .nv-stackedarea g#declaration-year')
        .remove();
    };
    $scope.updateDeclarationYear = function() {
      if ($scope.declarationYear.show && $scope.declarationYear.enabled) {
        $scope.drawDeclarationYear();
      } else if ($scope.declarationYear.show && (!$scope.declarationYear.enabled)){
        $scope.hideDeclarationYear();
      }
    };

    $scope.options = {
      chart: {
        type: 'stackedAreaChart',
        height: 304,
        margin : {
          right: 0,
          bottom: 26
        },
        x: function(d){return d[0];},
        y: function(d){return d[1];},
        transitionDuration: 250,
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

    $scope.colors.Bold = {
      11: ['#f00','#0f0', '#00f', '#ff0', '#f0f', '#0ff', '#000',
            '#08f', '#0f8', '#f80', '#8f0', '#80f', '#f08',
            '#fff', '#f88', '#88f', '#8f8', '#800', '#080', '#008'
          ]
    };

    var defaultColors = $scope.colors.Spectral['11'];
    defaultColors.push(
      '#fff', '#f88', '#88f', '#8f8', '#800', '#080', '#008',
      '#888', '#333'
    );
    $scope.color = $scope.colors.Spectral;

    $scope.updateColor = function() {
      if ($scope.color[11]){
        $scope.options.chart.color = $scope.color[11];
      } else {
        $scope.options.chart.color = $scope.color[9];
      }
      $scope.updateDeclarationYear();
    };

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
      var data_options = {region: $scope.region.name, region_id: $scope.formModel.region_id};
      data_options.dimension = $scope.formModel.dimension.value;
      data_options.measure = $scope.formModel.measure.value;
      data_options.limit = $scope.formModel.limit.value;
      $scope.$parent.$parent.showDownload = false;
      var data = sauAPI.Data.get(data_options, function() {
        $scope.$parent.$parent.showDownload = true;
        if ($scope.noData === true) {
          $timeout(function() { $scope.api.update(); });
        }
        $scope.noData = false;
        $scope.data = data.data;
        angular.forEach($scope.data, function(datum) {
          if (datum.key === 'reported landings') {
            datum.key = 'Reported landings';
          }
        });
        $scope.showLegendLabelToggle = $scope.formModel.dimension.value === 'taxon';
        spinnerState.loading = false;
        if ($scope.useScientificNames) {
          $scope.toggleTaxonNames();
          $scope.useScientificNames = true;
        }
        $scope.updateDeclarationYear();
      }, function() {
        $scope.noData = true;
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
      $scope.updateDeclarationYear();
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
        var dimensionLabel = $scope.formModel.dimension.overrideLabel === undefined ?
            $scope.formModel.dimension.label :
            $scope.formModel.dimension.overrideLabel;
        var chartTitle = $scope.formModel.measure.titleLabel + ' ' + dimensionLabel + ' in the ';
        if ($scope.region.name === 'global') {
          chartTitle += 'global ocean';
        } else {
          chartTitle += 'waters of ' + $scope.feature.data.title;
        }
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
