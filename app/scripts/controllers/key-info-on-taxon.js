'use strict';

/* global d3 */

angular.module('sauWebApp').controller('KeyInfoOnTaxonCtrl',
  function ($scope, sauAPI, $routeParams, $timeout, $filter) {
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
          right: 100
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

    function drawChart() {
      if ($scope.api && $scope.api.update) {
        $timeout(function () {
          var y1, y1Axis, y1AxisPosition, chart, svg;

          // grab existing chart elements
          svg = d3.select('.habitat-index-chart svg');
          chart = d3.select('.habitat-index-chart svg .nv-discreteBarWithAxes');

          // create new y-axis
          y1 = d3.scale.linear().range([435, 0]);
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
            .attr('transform', 'translate(' + (y1AxisPosition + 50) + ' ,260) rotate(90)')
            .attr('dy', '.75em')
            .text('Kilometers');

          // resize chart
          $scope.api.update();
        });
      }
    }
  });
