'use strict';

/* global angular */
/* global d3 */
/* global nv */

angular.module('sauWebApp')
  .controller('MultinationalFootprintCtrl', function ($scope, $routeParams, $timeout, sauAPI, sauChartUtils) {

    var getChartTitle = function() {
      if (!$scope.feature || !$scope.feature.data) { return ''; }
      return 'Primary Production Required for catches in ' +
        ($scope.feature.data.title ? 'the waters of ' + $scope.feature.data.title : 'the global ocean');
    };

    $scope.api = {};

    $scope.declarationYear = {
      visible: false,
      exists: $scope.region.name === 'eez'
    };

    $scope.drawDeclarationYear = function() {
      $scope.declarationYear.visible = true;
      $timeout(function() {
        $scope.feature.$promise.then(function(){
          var decYear = Math.max(1950, $scope.feature.data.declaration_year);
          var chart = $scope.api.getScope().chart;
          var container = d3.select('.chart-container svg .nv-stackedarea');
          container.select('#declaration-year').remove();
          var x = chart.xAxis.scale()(decYear);
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
              transform: 'translate('+(x+15)+',150) rotate(270,0,0)'
            })
            .text('EEZ declaration year: ' + decYear);
        });
      });
    };
    $scope.hideDeclarationYear = function() {
      $scope.declarationYear.visible = false;
      d3.select('.chart-container svg .nv-stackedarea g#declaration-year')
        .remove();
    };
    $scope.updateDeclarationYear = function() {
      if ($scope.declarationYear.exists && $scope.declarationYear.visible) {
        $scope.drawDeclarationYear();
      } else if ($scope.declarationYear.exists && (!$scope.declarationYear.visible)) {
        $scope.hideDeclarationYear();
      }
    };
    nv.utils.windowResize($scope.updateDeclarationYear);

    var updateData = function() {
      var data = sauAPI.MultinationalFootprintData.get({region: $scope.region.name, region_id: $scope.formModel.region_id, fao_id: $scope.mapLayers.selectedFAO}, function() {

        //If we go from having no data to having data, we need to redraw the chart after the DOM re-enables the div that holds the chart.
        if ($scope.noData === true) {
          $timeout(function() { $scope.api.update(); });
        }
        $scope.noData = false;
        $scope.$parent.$parent.showDownload = true;

        $scope.data = data.data.countries;
        $scope.maximumFraction = data.data.maximum_fraction;
        $scope.updateChartTitle(getChartTitle());

        //Once we obtain the maximumFraction data, we may want to raise the ceiling on the yAxis.
        //Sometimes the maximumFraction is larger than the largest data point,
        //so this prevents the maximumFraction from being rendered "off the chart".
        sauChartUtils.calculateYAxisCeiling($scope, [$scope.maximumFraction], 0.1);

        // draw maximum fraction line.  $timeout so it's drawn on top.
        $timeout(function() {
          var chart = $scope.api.getScope().chart;
          var container = d3.select('.chart-container svg .nv-stackedarea');

          container.append('line')
            .attr({
              x1: chart.xAxis.scale()(1950),
              y1: chart.yAxis.scale()($scope.maximumFraction),
              x2: chart.xAxis.scale()(2010),
              y2: chart.yAxis.scale()($scope.maximumFraction)
            })
            .style('stroke', '#f70');
          container.append('text')
            .attr({
              x: 10 + chart.xAxis.scale()(1950),
              y: -5 + chart.yAxis.scale()($scope.maximumFraction),
              fill: '#000',
              style: 'font-style: italic' // in SVG, styling attributes don't override css but style attr does
            })
            .text('Maximum fraction ' + $scope.maximumFraction);
        });

        $scope.updateDeclarationYear();
      },
      function() { //Error MNF data response
        $scope.noData = true;
        $scope.$parent.$parent.showDownload = false;

        //Some very hard-coded custom error messages, quarantined in the utils class.
        $scope.noDataMessage = sauChartUtils.getNoDataMessage($scope.region.name, $scope.formModel.region_id);
      });

      $scope.feature.$promise.then(function() {
        $scope.updateChartTitle(getChartTitle());
        updateDataDownloadUrl();
      });
    };

    $scope.$watch('formModel.region_id', function() {
      $scope.mapLayers.selectedFAO = undefined;
      updateData();
    });
    $scope.$watch('mapLayers.selectedFAO', updateData);

    $scope.options = {
      chart: {
        type: 'stackedAreaChart',
        height: 530,
        margin : {
          top: 20,
          right: 16,
          bottom: 26,
        },
        x: function(d){return d[0];},
        y: function(d){return d[1];},
        transitionDuration: 0,
        useInteractiveGuideline: true,
        showControls: false,
        xAxis: {
          showMaxMin: false,
          tickValues: [1950,1960,1970,1980,1990,2000,2010,2020]
        },
        yAxisTickFormat: function(d) {
          return Number(d).toFixed(3).toString();
        },
        yAxis: {
          showMaxMin: false,
          axisLabel: 'Fraction of prim.prod.'
        }
      }
    };

    function updateDataDownloadUrl() {
      var params = ['',
        sauAPI.apiURL,
        $scope.region.name,
        '/multinational-footprint/?region_id=',
        $scope.formModel.region_id,
        '&format=csv'
      ];

      if ($scope.mapLayers.selectedFAO) {
        params.push('&fao_id=', $scope.mapLayers.selectedFAO);
      }

      var url = params.join('');
      $scope.updateDataDownloadUrl(url);
    }

    updateDataDownloadUrl();
  });
