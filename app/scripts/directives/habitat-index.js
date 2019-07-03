/* global d3 */

(function(angular) {
  'use strict';

  angular.module('sauWebApp').directive('habitatIndex', function() {
    var habitatIndexController = function($scope, $filter, $timeout) {
      var extrasDrawn = false;

      $scope.colors = { red: '#FC111E', blue: '#0F25FA', green: '#138115' };

      $scope.legend = [
        { label: 'Biological', color: $scope.colors.red },
        { label: 'Depth related', color: $scope.colors.green },
        { label: 'Distance from shore', color: $scope.colors.blue }
      ];

      $scope.options = {
        chart: {
          type: 'discreteBarChart',
          height: 500,
          margin: {
            right: 120,
            bottom: 100
          },
          x: function(d) { return $filter('capitalize')(d.label); },
          xAxis: { axisLabel: 'Habitat' },
          y: function(d) { return d.value; },
          yAxis: { axisLabel: 'Index' },
          forceY: [0.0, 1.0],
          tooltips: false,
          color: [
            $scope.colors.red, $scope.colors.red, $scope.colors.red, $scope.colors.red,
            $scope.colors.green, $scope.colors.green, $scope.colors.green,
            $scope.colors.blue, $scope.colors.blue
          ]
        }
      };

      $scope.$watch('taxon.showHabitatIndex', drawChart, true);
      $scope.$watch('taxon', function(taxon) {
        if (!taxon) {
          return;
        }

        var firstDigit = $scope.taxon.taxon_key.toString().charAt(0);
        var habIdxCaveat = 'Habitat diversity index estimated from the average ecological parameters ' +
          'of species belonging to the same ';

        switch(firstDigit) {
          // Per Deng: "refrain from displaying the Habitat Diversity Index column
          // values for all taxon keys starting with 1 for now"
          case '1':
            $scope.taxon.has_habitat_index = false;
          break;
          case '2':
            $scope.habitatIndexCaveat = habIdxCaveat + 'class';
          break;
          case '3':
            $scope.habitatIndexCaveat = habIdxCaveat + 'order';
          break;
          case '4':
            $scope.habitatIndexCaveat = habIdxCaveat + 'family';
          break;
          case '5':
            $scope.habitatIndexCaveat = habIdxCaveat + 'genus';
          break;
        }

        if ($scope.taxon.has_habitat_index) {
          $scope.data = habitatIndexData($scope.taxon.habitat_index);
        }
      });

      function habitatIndexData(rawData) {
        var xLabels = [
          'estuaries',
          'coral',
          'front',
          'seamount',
          'others',
          'shelf',
          'slope',
          'abyssal',
          'inshore',
          'offshore'
        ];

        var data = xLabels.reduce(function(data, label) {
          data.push({ label: label, value: rawData[label] });
          return data;
        }, []);

        return [{ key: 'Habitat Index', values: data }];
      }

      function addExtras() {
        var y0Axis, y1AxisPosition, chart, svg,
          wfLines, lineG, lineLabelTranslate, sideMeasureG,
          habIdx, habIdxY;

        // grab existing chart elements
        y0Axis = $scope.api.getScope().chart.yAxis;
        svg = d3.select('.habitat-index-chart svg');
        chart = d3.select('.habitat-index-chart svg .nv-discreteBarWithAxes');

        // calculate far edge of chart
        y1AxisPosition = svg[0][0].clientWidth - 100;

        // add weighing factor lines
        wfLines = [
          { label: 'Always',
            color: '#FC111E',
            attr: { x1: 60, x2: y1AxisPosition, y1: y0Axis.scale()(1) + 15, y2: y0Axis.scale()(1) + 15 }
          },
          { label: 'Usually',
            color: '#0F25FA',
            attr: { x1: 60, x2: y1AxisPosition, y1: y0Axis.scale()(0.75) + 15, y2: y0Axis.scale()(0.75) + 15 }
          },
          { label: 'Often',
            color: '#138115',
            attr: { x1: 60, x2: y1AxisPosition, y1: y0Axis.scale()(0.5) + 15, y2: y0Axis.scale()(0.5) + 15 }
          },
          { label: 'Occasional',
            color: '#ECD2A5',
            attr: { x1: 60, x2: y1AxisPosition, y1: y0Axis.scale()(0.25) + 15, y2: y0Axis.scale()(0.25) + 15 }
          },
          { label: 'Absent/rare',
            color: '#64F4F3',
            attr: { x1: 60, x2: y1AxisPosition, y1: y0Axis.scale()(0) + 15, y2: y0Axis.scale()(0) + 15 }
          }
        ];

        lineG = chart.append('g');

        wfLines.forEach(function(line) {
          lineG.append('line')
            .attr(line.attr)
            .style('stroke', line.color)
            .style('stroke-width', 1);

          lineLabelTranslate = 'translate('+ (line.attr.x2 + 5) + ',';
          lineLabelTranslate += (line.attr.y2 + 5) + ')';

          lineG.append('text')
            .attr('transform', lineLabelTranslate)
            .attr('text-anchor', 'start')
            .attr('style', 'font-style:italic;')
            .text(line.label);
        });

        sideMeasureG = chart.append('g');

        // habitat index indicator
        habIdx = $scope.taxon.habitat_index.habitat_diversity_index.toFixed(2);
        habIdxY = y0Axis.scale()(habIdx) + 15;
        sideMeasureG.append('text')
          .attr('transform', 'translate(30, ' + habIdxY + ') rotate(-90)')
          .attr('fill', '#FC111E')
          .attr('text-anchor', 'middle')
          .text('Habitat diversity: ' + habIdx);
        sideMeasureG.append('line')
          .attr({ x1: 30, x2: 60, y1: habIdxY, y2: habIdxY })
          .style('stroke', '#FC111E')
          .style('stroke-width', 1);

        extrasDrawn = true;
      }

      function drawChart() {
        if ($scope.api && $scope.api.update) {
          $timeout(function() {
            if (!extrasDrawn) {
              addExtras();
            }
            $scope.api.update();
          });
        }
      }
    };

    return {
      controller: habitatIndexController,
      scope: { taxon: '=' },
      templateUrl: 'views/habitat-index.html'
    };
  });
})(angular);
