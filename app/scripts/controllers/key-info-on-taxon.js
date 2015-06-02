'use strict';

/* global d3 */

angular.module('sauWebApp').controller('KeyInfoOnTaxonCtrl',
  function ($scope, sauAPI, $routeParams, $timeout, $filter) {
    var extrasDrawn = false;

    $scope.colors = { red: '#FC111E', blue: '#0F25FA', green: '#138115' };

    $scope.legend = [
      { label: 'Biological', color: $scope.colors.red },
      { label: 'Depth related', color: $scope.colors.blue },
      { label: 'Distance from shore', color: $scope.colors.green }
    ];

    $scope.$watch('showHabitatIndex', drawChart);

    sauAPI.Taxon.get({taxon_key: $routeParams.taxon},
      function(result) {
        $scope.taxon = result.data;
        if ($scope.taxon.has_habitat_index) {
          $scope.data = habitatIndexData($scope.taxon.habitat_index);
        }
      },
      function(error) {
        $scope.taxon = {
          error: error,
          key: $routeParams.taxon
        };
      }
    );

    $scope.options = {
      chart: {
        type: 'discreteBarChart',
        height: 500,
        margin: {
          right: 100,
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

    function habitatIndexData(rawData) {
      var xLabels = [
        'estuaries',
        'coral',
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
      var y1, y0Axis, y1Axis, y1AxisPosition, chart, svg,
        wfLines, lineG, lineLabelTranslate, sideMeasureG,
        habIdx, habIdxY, effectiveD, effectiveDY;

      // grab existing chart elements
      y0Axis = $scope.api.getScope().chart.yAxis;
      svg = d3.select('.habitat-index-chart svg');
      chart = d3.select('.habitat-index-chart svg .nv-discreteBarWithAxes');

      // create new y-axis
      y1 = d3.scale.linear().range([y0Axis.scale()(0), 0]);
      y1.domain([0,100]);
      y1Axis = d3.svg.axis()
        .scale(y1)
        .orient('right')
        .ticks(10)
        .tickSize(0,0);

      // calculate far edge of chart
      y1AxisPosition = svg[0][0].clientWidth - 100;

      // add new y-axis
      chart.append('g')
        .attr('class', 'y axis secondary')
        .attr('transform', 'translate(' + y1AxisPosition + ' ,15)')
        .call(y1Axis);

      // add new y-axis label
      chart.append('text')
        .attr('class', 'y label')
        .attr('text-anchor', 'end')
        .attr('transform', 'translate(' + (y1AxisPosition + 55) + ' ,260) rotate(90)')
        .attr('dy', '.75em')
        .text('Kilometers');

      // add weighing factor lines
      wfLines = [
        { label: 'Always',
          color: '#FC111E',
          attr: { x1: 60, x2: y1AxisPosition, y1: y0Axis.scale()(1) + 15, y2: y0Axis.scale()(1) + 15 }
        },
        { label: 'Abundant',
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

      wfLines.forEach(function(line, i) {
        lineG.append('line')
          .attr(line.attr)
          .style('stroke', line.color)
          .style('stroke-width', 1);

        lineLabelTranslate = 'translate('+ (line.attr.x2 - 10) + ',';
        if (i === 4) {
          lineLabelTranslate += (line.attr.y2 - 2) + ')';
        } else {
          lineLabelTranslate += (line.attr.y2 + 12) + ')';
        }

        lineG.append('text')
          .attr('transform', lineLabelTranslate)
          .attr('text-anchor', 'end')
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

      // effective distance inicator
      effectiveD = $scope.taxon.habitat_index.effective_d.toFixed(2);
      effectiveDY = y1Axis.scale()(effectiveD) + 15;
      sideMeasureG.append('text')
        .attr('transform',
        'translate(' + (y1AxisPosition + 25) +', ' + effectiveDY + ') rotate(90)')
        .attr('fill', '#FC111E')
        .attr('text-anchor', 'middle')
        .text('Effective distance: ' + effectiveD);
      sideMeasureG.append('line')
        .attr({
          x1: (y1AxisPosition + 25),
          x2: y1AxisPosition,
          y1: effectiveDY,
          y2: effectiveDY
        })
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
  });
