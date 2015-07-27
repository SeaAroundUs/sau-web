'use strict';

/* global d3 */

angular.module('sauWebApp')
  .directive('regionDataMultinationalFootprint', function() {
    var controller = function($scope, $rootScope, $timeout, regionDataCatchChartOptions, spinnerState,
                              regionDataCatchChartTitleGenerator, sauAPI, sauChartUtils, faos) {

      // chart options
      $scope.options = regionDataCatchChartOptions;
      $scope.options.chart.yAxis.axisLabel = 'Fraction of prim.prod.';
      $scope.options.chart.yAxisTickFormat = function(d) {
        return Number(d).toFixed(3).toString();
      };

      // update EEZ declaration year display
      $scope.updateDeclarationYear = function() {
        //TODO
      };

      // get chart data
      getChartData();


      /*
       * watchers
       */

      // update chart when region changes
      $scope.$watch('region', getChartData, true);


      /*
       * helper functions
       */

      function updateDataDownloadURL() {
        var params = ['',
          sauAPI.apiURL,
          $scope.region.name,
          '/multinational-footprint/?region_id=',
          $scope.region.id,
          '&format=csv'
        ];

        if ($scope.region.faoId) {
          params.push('&fao_id=', $scope.region.faoId);
        }

        $rootScope.$broadcast('setDownloadURL', params.join(''));
      }

      function clearDataDownloadURL() {
        $rootScope.$broadcast('setDownloadURL', null);
      }

      function getChartData() {
        var dataOptions = {
          region: $scope.region.name,
          region_id: $scope.region.id,
          fao_id: $scope.region.faoId
        };

        // show chart loading
        spinnerState.loading = true;
        regionDataCatchChartTitleGenerator.clearTitle();

        // reset download url
        clearDataDownloadURL();

        // get data from API
        sauAPI.MultinationalFootprintData.get(dataOptions, function(res) {
          var data = res.data;

          // refresh chart if coming from a state with no data
          if ($scope.noData === true) {
            $timeout(function() { $scope.api.update(); });
          }
          $scope.noData = false;

          // expose the data to the scope
          $scope.data = data.countries;

          // update EEZ declaration year display
          $scope.updateDeclarationYear();

          // Once we obtain the maximumFraction data, we may want to raise the ceiling on the yAxis.
          // Sometimes the maximumFraction is larger than the largest data point,
          // so this prevents the maximumFraction from being rendered "off the chart".
          sauChartUtils.calculateYAxisCeiling($scope, [data.maximum_fraction], 0.1);

          // draw maximum fraction line.  $timeout so it's drawn on top.
          $timeout(function() {
            var chart = $scope.api.getScope().chart;
            var container = d3.select('.chart-container svg .nv-stackedarea');

            container.append('line')
              .attr({
                x1: chart.xAxis.scale()(1950),
                y1: chart.yAxis.scale()(data.maximum_fraction),
                x2: chart.xAxis.scale()(2010),
                y2: chart.yAxis.scale()(data.maximum_fraction)
              })
              .style('stroke', '#f70');

            container.append('text')
              .attr({
                x: 10 + chart.xAxis.scale()(1950),
                y: -5 + chart.yAxis.scale()(data.maximum_fraction),
                fill: '#000',
                style: 'font-style: italic' // in SVG, styling attributes don't override css but style attr does
              })
              .text('Maximum fraction ' + data.maximum_fraction);
          });

          // update chart title
          regionDataCatchChartTitleGenerator.setTitle('Primary Production Required for catches in ' +
            (data.title ? 'the waters of ' + data.title : 'the global ocean') +
            ($scope.region.faoId ? ' - ' + faos.getFAOName($scope.region.name, $scope.region.id, $scope.region.faoId) : '')
          );

          // update download url
          updateDataDownloadURL();

          // end loading state
          spinnerState.loading = false;

          // handle no data
        }, function() {
          $scope.noData = true;
          $scope.noDataMessage = sauChartUtils.getNoDataMessage(dataOptions.region, dataOptions.region_id);
          spinnerState.loading = false;
        });
      }

    };

    return {
      controller: controller,
      replace: true,
      restrict: 'E',
      scope: { region: '=' },
      templateUrl: 'views/region-data/multinational-footprint.html'
    }
  });
