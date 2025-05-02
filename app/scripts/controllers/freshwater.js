'use strict';

/* global angular */
/* global d3 */

angular.module('sauWebApp')
    .controller('FreshwaterCtrl', function ($scope, $filter, $location, $routeParams, $timeout, $sce, sauAPI, regionDimensionLimits, sauChartUtils) {

      function init() {

        $scope.has_subentity = false;
        sauAPI.FreshwaterHasSubEntity.get({ region_id: regionId }).$promise
        .then(function(response) {
          $scope.has_subentity = response.data[0].has_subentity;
        })
        if ($routeParams.sub_entity_id) {
          $scope.dimensions = dim_with_subentity
        } else {
          $scope.dimensions = dim
        }
        $scope.limits = regionDimensionLimits['freshwater'];
        $scope.formModel = {
          dimension: $scope.dimensions[0],
          sub_entity: [{sub_entity_id: null}],
          limit: $scope.limits[1]
        }
        //$scope.$on('$locationChangeSuccess', function() {
        //  $scope.formModel.sub_entity.sub_entity_id = $location.search().sub_entity_id;
        //});
      }

      $scope.$watch('formModel', onFormModelChange, true);
      var dim = [{label: "Reporting status", value: "reporting-status"}];
      var dim_all = [{label: "Taxon", value: "taxon"},
                    {label: "Fishing sector", value: "sector"},
                    {label: "Reporting status", value: "reporting-status"},
                    {label: "Sub-national entities", value: "subentity"}];
      var dim_with_subentity = [{label: "Taxon", value: "taxon"},
                                {label: "Fishing sector", value: "sector"}];
      var regionId = $routeParams.ids;
      var sub_entity_id_param = $routeParams.sub_entity_id;
      var recon_catch_data = new Array();
      var peak = {};
      var info_options = {};
      $scope.trustAsHtml = $sce.trustAsHtml;
      $scope.freshwaterAPI = {};
      $scope.freshwaterOptions = {
        chart: {
          type:'lineChart',
          height: 400,
          margin : {
            top: 20,
            right: 20,
            bottom: 60,
            left: 65
          },
          x: function(d){return d[0];},
          y: function(d){return d[1];},
          xAxis: {
            showMaxMin: false,
            tickValues: [1950,1960,1970,1980,1990,2000,2010,2019],
            axisLabel: 'Year'
          },
          yAxis: {
            axisLabel: 'Catch (t x 1000)',
            showMaxMin: false,
            tickFormat: function(d) {
              var magnitude;
              magnitude = 3;
              return $filter('significantDigits')(d, magnitude);
            }
          },
        }
      }
      function onFormModelChange() {
        updateData();
        updateChartTitle();
        updateURL();
        updateChart();
      }
      function updateData() {
        var catch_data = [];
        var data_options = {
          entity_id: regionId,
          dimension: $scope.formModel.dimension.value,
          limit: $scope.formModel.limit.value
        };

        //Only add sub_entity_id as on data_options if dimension is not subentity and reporting-status
        if ($scope.formModel.dimension.value != 'subentity' && $scope.formModel.dimension.value != 'reporting-status') {
          if ($scope.formModel.sub_entity.sub_entity_id != null) {
            data_options.sub_entity_id = $scope.formModel.sub_entity.sub_entity_id;
          } else {
            data_options.sub_entity_id = sub_entity_id_param;
          }
        }

        //API getting the freshwater data from data_options parameter
        var fsdata = sauAPI.FreshwaterData.get(data_options, function() {
          if ($scope.formModel.sub_entity.sub_entity_id == null || $scope.formModel.sub_entity.sub_entity_id == undefined) {
            for (var i = 0; i < fsdata.data.length; i++) {
              if (fsdata.data[i].key == 'Reported') {
                fsdata.data[i].area = 'True';
                fsdata.data[i].color = '#ff7f0e';
              } else if (fsdata.data[i].key == 'Unreported') {
                fsdata.data[i].color = 'black';
                for (var j = 0; j < fsdata.data[i].values.length; j++) {
                  recon_catch_data.push({x:fsdata.data[i].values[j][0],y:fsdata.data[i].values[j][1]});
                }
              }
            }
          }

          if ($scope.formModel.sub_entity.sub_entity_id == null || $scope.formModel.dimension.value != 'reporting-status') {
            catch_data.push(fsdata.data);
            $scope.data = catch_data[0];
          }

          $timeout(legendChange);
          $scope.showLegendLabelToggle = $scope.formModel.dimension.value === 'taxon';

          if ($scope.formModel.useScientificName) {
            sauChartUtils.toggleTaxonNames($scope);
          }
        });

        if ($scope.formModel.sub_entity.sub_entity_id) {
          info_options = {
            region_id: regionId,
            sub_entity_id: $scope.formModel.sub_entity.sub_entity_id
          }
        } else {
          info_options = {
            region_id: regionId
          }
        }

        //API getting the freshwater information from info_options parameter
        var country_info = sauAPI.Freshwater.get(info_options, function() {
            if (country_info.data[0]) {
              $scope.country_name = country_info.data[0].entity_name;

              if (country_info.data[0].country_territory_text) {

                $scope.sub_country = country_info.data[0].sub_entity_name;

                //Formats and adds hyperlinks to text with https
                var cleanedText = country_info.data[0].country_territory_text.replace(/;/g, '');
                var linkifiedctext = cleanedText.replace(
                  /https?:\/\/[^\s]+/g, function(url) {
                    //return `<a href="${url}" target="_blank">${url}</a>;`;
                    return '<a href="' + url + '" target="_blank">' + url + '</a>';
                  }
                );
                $scope.country_text = linkifiedctext;

                //Adds doi links to doi text
                if (country_info.data[0].references) {
                  var doi_str = country_info.data[0].references.replace("doi: ", "http://doi.org/");
                  var linkifiedContent = doi_str.replace(
                    /https?:\/\/[^\s]+/g, function(url) {
                      //return `<a href="${url}" target="_blank">${url}</a>`;
                      return '<a href="' + url + '" target="_blank">' + url + '</a>';
                    }
                  );
                  $scope.references = linkifiedContent.split(/\r?\n/);
                }

                $scope.underreporting_factor = country_info.data[0].underreporting_factor;
                peak = country_info.data[0].peak_year;

                $scope.noData = false;
                $scope.noFisheriesData = false;

                updateChartTitle();

              } else {
                $scope.noFisheriesData = true;
              }

              if (country_info.data[0].has_subentity == true) {
                updateDimensionList();
              }

            } else {
              $scope.noData = true;
            }
          }
        );
      }

      function updateDimensionList() {
        var data_sub_entity = sauAPI.FreshwaterSubEntity.get({region_id: regionId}, function() {
          var allProvinces = {
            sub_entity_name: 'All',
            sub_entity_id: null
          };

          $scope.sub_entity = data_sub_entity.data;
          $scope.sub_entity.unshift(allProvinces);

          //Checks if the sub_entity_id parameter exists and sub_entity_id = null
          if (sub_entity_id_param && $scope.formModel.sub_entity.sub_entity_id == null) {
            $scope.formModel.sub_entity = $scope.sub_entity[sub_entity_id_param];
            sub_entity_id_param = null;
            $scope.dimensions = dim_with_subentity;
          } else if (sub_entity_id_param == null && $scope.formModel.sub_entity.sub_entity_id) {
            $scope.formModel.sub_entity = $scope.sub_entity[$scope.formModel.sub_entity.sub_entity_id];
            $scope.dimensions = dim_with_subentity;
            $scope.formModel.dimension = getDimensionObjectByValue(getDimensionFromURL());
          } else if (sub_entity_id_param == null) {
            $scope.formModel.sub_entity = $scope.sub_entity[0];
            $scope.dimensions = dim_all;
            $scope.formModel.dimension = getDimensionObjectByValue(getDimensionFromURL());
          }
        });
      }

      function updateChartTitle() {
        var chartTitle = [
          'Catches by ',
          $scope.formModel.dimension.label,
          'in freshwaters of',
          $scope.country_name,
          ].join(' ');

        if ($scope.formModel.sub_entity.sub_entity_id != null && $scope.formModel.sub_entity.sub_entity_name !== 'All') {
          chartTitle += ' - ' + $scope.formModel.sub_entity.sub_entity_name;
        }
        $scope.chartTitle = chartTitle;
      }

      function updateURL() {
        $location.search({sub_entity_id: $scope.formModel.sub_entity.sub_entity_id,
          chart: 'freshwater-chart',
          dimension: $scope.formModel.dimension.value,
          limit: $scope.formModel.limit.value,
        }).replace();
      }

      function updateChart() {
        if ( $scope.formModel.dimension.value == 'reporting-status') {
          $scope.freshwaterOptions.chart.type = 'lineChart';
          $scope.freshwaterOptions.chart.callback = highlightPoints;
        } else {
          $scope.freshwaterOptions.chart.type = 'stackedAreaChart';
          $scope.freshwaterOptions.chart.showControls = false;
          $scope.freshwaterOptions.chart.useInteractiveGuideline = true;
        }

        $scope.freshwaterOptions.chart.yAxisTickFormat = function(d) {
          var magnitude = 3
          return $filter('significantDigits')(d, magnitude);
        };
      }

      function getDimensionFromURL() {
        var dimensionObj = getDimensionObjectByValue($location.search().dimension);
        if (dimensionObj) {
          return dimensionObj.value;
        } else {
          return $scope.dimensions[0].value;
        }
      }

      function getDimensionObjectByValue(value) {
        var dimension = null;
        angular.forEach($scope.dimensions, function(i) {
          if (i.value === value) { dimension = i; }
        });
        return dimension;
      }

      function highlightPoints(chart) {
        d3.select('.nv-groups')
            .selectAll("circle.myPoint")
            .remove();

        var points = d3.select('.nv-groups')
            .selectAll("circle.myPoint")
            .data(recon_catch_data.filter(function(d) { return d.x == peak; }));

        points.enter().append("circle")
            .attr("class", "myPoint")
            .attr("fill", "#203C88")
            .attr("cx", function(d) { return chart.xAxis.scale()(d.x); })
            .attr("cy", function(d) { return chart.yAxis.scale()(d.y); })
            .attr("r", 6);
      }

      function legendChange() {
        if ($scope.formModel.dimension.value == 'reporting-status') {
          var count = d3.selectAll('.nv-series').size();
          d3.selectAll('.nv-legend-symbol')
            .filter(function(d, i){ return i == count-1})
            .remove();

          d3.selectAll('.recon_legend')
              .remove();

          var legendrecon = d3.selectAll('.nv-series')
                              .filter(function(d, i){ return i == count-1});

          legendrecon.append("line")
          .attr("x1", "0")
          .attr("y1", "0")
          .attr("x2", "5")
          .attr("y2", "0")
          .attr("stroke", "black")
          .attr("stroke-width", "2");

        }
      }

      $scope.toggleTaxonNames = function() {
        $scope.formModel.useScientificName = !$scope.formModel.useScientificName;
        sauChartUtils.toggleTaxonNames($scope);
      };

      $scope.onReady = function(scope, el){
        chart = scope.chart;
      }

      //Replot point when resizing screen
      $(window).on("resize",function(){
        $scope.$apply(function(){
          if (peak != 'null' && typeof $scope.freshwaterAPI.getScope === 'function') {
            highlightPoints($scope.freshwaterAPI.getScope().chart);
          }
        });
      });

      init();
    });
