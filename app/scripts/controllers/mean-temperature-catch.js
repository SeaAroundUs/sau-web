'use strict';

/* global angular */
/* global d3 */

angular.module('sauWebApp').controller('MeanTemperatureCatchCtrl',
    function ($scope, $routeParams, $q, sauAPI, $timeout, spinnerState, ga, $location) {
        spinnerState.loading = true;

        // Tooltip for the graph
        var mtcTooltip = function(x,y,e) {
            var s = '<h3>' + e + '</h3>' +
            '<p>' + y + '</p>';
            return s;
        };
    
        $scope.mtcGraph = {
            chart: {
                type: 'scatterChart',
                height: 350,
                margin: {
                    top: 20,
                    right: 20,
                    bottom: 50,
                    left: 65
                },
                useInteractiveGuideline: false,
                tooltipContent: mtcTooltip,
                tooltips: true,
                xDomain: [1950, 2019],
                xAxis: {
                    axisLabel: 'Year',
                    tickValues: [1950,1960,1970,1980,1990,2000,2010,2019]
                },
                yAxis: {
                    axisLabel: 'Mean temperature of the catch (°C)',
                    showMaxMin: false,
                    tickFormat: function(d) { return d3.format('.1f')(d); }
                },
                showLegend: false
            },
            data: []
        };

        if (!$scope.mtc) {
            sauAPI.MeanTemperatureCatchData.get({ id: $routeParams.id }).$promise
                .then(function(response) {

                    $scope.mtc = response.data[0];

                    var scatterData = [];
                    var lineData = [];
                    var show_gen_spc = $scope.mtc.show_gen_spc;
                    var show_spc = $scope.mtc.show_spc;

                    if (show_gen_spc == true && show_spc == false) {
                        scatterData = response.data[0].mtc_gen_spc_data.map(function(d) {
                            return { x: +d[0], y: +d[1], size: 1 };
                        });

                        lineData = response.data[0].seg_reg_gen_spc_data
                            .filter(function(d) {
                                return d[1] != null;
                            })
                            .map(function(d) {
                                return { x: +d[0], y: +d[1], size: 1 };
                            });
                        $scope.bp_year = $scope.mtc.bp_gen_spc;

                    } else if (show_gen_spc == false && show_spc == true) {
                        scatterData = response.data[0].mtc_spc_data.map(function(d) {
                            return { x: +d[0], y: +d[1], size: 1 };
                        });

                        lineData = response.data[0].seg_reg_spc_data
                            .filter(function(d) {
                                return d[1] != null;
                            })
                            .map(function(d) {
                                return { x: +d[0], y: +d[1], size: 1 };
                            });
                        $scope.bp_year = $scope.mtc.bp_spc;
                    
                    } else {
                        $scope.mtcStatus = false;
                    }

                    if (show_gen_spc == true || show_spc == true) {
                        
                        $scope.mtcGraph.data = [
                            {
                                type: 'scatter',
                                color: 'black',
                                yAxis: 1,
                                values: scatterData
                            }
                        ];

                        appendSegmentedLine(lineData);
                        $scope.mtcGraph.chart.yDomain = (getYDomain(scatterData,lineData))
                    
                    }
                    
                }, function(error) {
                $scope.mtcStatus = false
            });
        }

        // Draws the segmented line based on lineData
        function appendSegmentedLine(lineData) {
            $timeout(function () {
                var svg = d3.select("#mtc-chart svg");

                if (svg.empty()) return;
            
                svg.selectAll(".segmented-line").remove();
            
                var chart = nv.graphs[nv.graphs.length - 1];

                var xScale = chart.scatter.xScale();
                var yScale = chart.scatter.yScale();
            
                var line = d3.svg.line()
                    .x(d => xScale(d.x))
                    .y(d => yScale(d.y))
                    .interpolate("linear");
            
                svg.select(".nv-scatterWrap .nv-groups")
                    .append("path")
                    .datum(lineData)
                    .attr("class", "segmented-line")
                    .attr("d", line)
                    .style("stroke", "black")
                    .style("stroke-width", 2)
                    .style("fill", "none");

            },200)
        }

        // Creates a buffer for the min and max y-domains
        function getYDomain(scatterData, segmentedLines, buffer = 0.25) {
            var allValues = [];
            scatterData.forEach(d => allValues.push(d.y));
            segmentedLines.forEach(d => allValues.push(d.y));
        
            var minY = d3.min(allValues);
            var maxY = d3.max(allValues);
        
            var range = maxY - minY;
            minY = minY - range * buffer;
            maxY = maxY + range * buffer;
        
            return [minY, maxY];
        }

    })