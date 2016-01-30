'use strict';

/* global d3 */

angular.module('sauWebApp')
  .directive('regionDataMultinationalFootprint', function() {
    var controller = function($scope, $rootScope, $timeout, $location, regionDataCatchChartOptions,
                              spinnerState, regionDataCatchChartTitleGenerator, sauAPI, sauChartUtils) {

      // chart options
      $scope.options = regionDataCatchChartOptions;
      $scope.options.chart.yAxis.axisLabel = 'Fraction of prim.prod.';
      $scope.options.chart.yAxisTickFormat = function(d) {
        return Number(d).toFixed(3).toString();
      };

      // eez declaration
      $scope.declarationYear = {
        visible: false,
        exists: $scope.region.name === 'eez'
      };

      // get chart data
      getChartData();


      /*
       * watchers
       */

      // update chart when region changes
      $scope.$watch('region', getChartData, true);
      $scope.$watch('declarationYear', updateDeclarationYear, true);


      /*
       * helper functions
       */

      function updateDeclarationYear() {
        if ($scope.declarationYear.exists) {
          $scope.declarationYear.visible ? drawDeclarationYear() : hideDeclarationYear();
        }
      }

      function hideDeclarationYear() {
        $scope.declarationYear.visible = false;
        d3.select('.chart-container svg .nv-stackedarea g#declaration-year').remove();
      }

      function drawDeclarationYear() {
        $scope.declarationYear.visible = true;
        $timeout(function() {
          sauAPI.Region.get({ region: $scope.region.name, region_id: $scope.region.id }, function(res) {
            var decYear = Math.max(1950, res.data.declaration_year);
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
                transform: 'translate(' + (x + 15) + ',150) rotate(270,0,0)'
              })
              .text('EEZ declaration year: ' + decYear);
          });
        });
      }

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
          var maxYear = Math.max.apply(null, res.data.countries.map(function(country) {
            return country.values[country.values.length - 1][0];
          }));

          // refresh chart if coming from a state with no data
          if ($scope.noData === true) {
            $timeout(function() { $scope.api.update(); });
          }
          $scope.noData = false;

          // expose the data to the scope
          $scope.data = data.countries;

          // update EEZ declaration year display
          updateDeclarationYear();

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
                x2: chart.xAxis.scale()(maxYear),
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
          sauAPI.Region.get({ region: $scope.region.name, region_id: $scope.region.id}, function(res) {
            regionDataCatchChartTitleGenerator.setTitle('Primary Production Required for catches in ' +
              (res.data.title ? 'the waters of ' + res.data.title : 'the global ocean') +
              ($scope.region.faoId && $scope.faos ? ' - ' + $scope.faos.reduce(function(name, fao) {
                return fao.id === $scope.region.faoId ? fao.title : name;
              }, 'Unknown') : '')
            );
          });

          // update download url
          updateDataDownloadURL();

          // update url for subregion
          $location.search('subRegion', $scope.region.faoId);

          // end loading state
          spinnerState.loading = false;

          // handle no data
        }, function() {
          $scope.noData = true;
          $scope.noDataMessage = sauChartUtils.getNoDataMessage(dataOptions.region, dataOptions.region_id);
          $location.search('subRegion', $scope.region.faoId);
          spinnerState.loading = false;
        });
      }

    };

    return {
      controller: controller,
      replace: true,
      restrict: 'E',
      scope: { region: '=', faos: '=' },
      templateUrl: 'views/region-data/multinational-footprint.html'
    }
  });
