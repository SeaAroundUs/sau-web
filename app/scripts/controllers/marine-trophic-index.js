'use strict';

/* global angular */
/* global d3 */
/* global ss */

angular.module('sauWebApp')
  .controller('MarineTrophicIndexCtrl', function ($scope, $routeParams, sauService, region) {

    $scope.years = [];
    $scope.model = {};
    $scope.regressionModel = {};

    $scope.showMaximizer = false;
    $scope.showRegression = true;

    $scope.index = function(index) {return data[index];};

    window.scope = $scope;
    $scope.thisIndex = "";

    var data = sauService.MarineTrophicIndexData.get({region: region, region_id: $routeParams.id}, function() {

        $scope.data = data.data;
        angular.forEach($scope.data, function(time_series) {
            $scope[time_series.key] = [time_series];
        });

        angular.forEach($scope.data[0].values, function(xy) {
          if (xy[1]) {
            $scope.years.push(xy[0]);
          }
        });
        $scope.fullRange = {
          startYear: $scope.years[0],
          endYear: $scope.years[$scope.years.length-1]
        };
        $scope.model = angular.copy($scope.fullRange);
        $scope.startYears = $scope.years;
        $scope.endYears = $scope.years;
        $scope.model.startYear = $scope.startYears[0];
        $scope.model.endYear = $scope.endYears[$scope.endYears.length-1];

        // $scope.computeRegression();
    });

    $scope.options = {
      chart: {
          type: 'lineChart',
          height: 250,
          margin : {
              top: 20,
              right: 20,
              bottom: 60,
              left: 85
          },
          x: function(d){
            if (d){
              return d[0];
            }
          },
          y: function(d){return d[1];},
          transitionDuration: 225,
          // useInteractiveGuideline: true,
          showLegend: false,
          xAxis: {
              showMaxMin: false,
              tickValues: [1950,1960,1970,1980,1990,2000,2010,2020],
              axisLabel: 'Year'
          },
          yAxis: {
              showMaxMin: false,
              tickFormat: function(d){
                  return d3.format(',.2s')(d);
              },
              axisLabel: 'Trophic Index'
          }
        }
      };

      // $scope.fib_options = angular.copy($scope.trophic_options);
      // $scope.fib_options.chart.yAxis.axisLabel = 'fib index';

      $scope.maximizeRange = function() {
        $scope.model = angular.copy($scope.fullRange);
        $scope.changeRange();
      };

      $scope.changeRange = function() {

        $scope.showMaximizer = ! angular.equals($scope.model, $scope.fullRange);
        var startIndex = $scope.years.indexOf($scope.model.startYear);
        var endIndex = $scope.years.indexOf($scope.model.endYear);

        $scope.startYears = $scope.years.slice(0,endIndex);
        $scope.endYears = $scope.years.slice(startIndex);

        angular.forEach($scope.data, function(time_series) {

            var newSeries = {key: time_series.key, values: time_series.values.slice(startIndex,endIndex+1)};
            $scope[time_series.key] = [newSeries];
        });

        $scope.computeRegression();
      };

      $scope.computeRegression = function() {
        $scope.showRegression = false;
        var regression = ss.linear_regression();
        regression.data($scope.mean_trophic_level[0].values);
        $scope.regressionModel.slope = regression.m();
        $scope.regressionModel.intercept = regression.b();
        $scope.regressionModel.r2 = ss.r_squared($scope.mean_trophic_level[0].values, regression.line());

        var x1 = $scope.model.startYear;
        var x2 = $scope.model.endYear;
        var y1 = regression.line()($scope.model.startYear);
        var y2 = regression.line()($scope.model.endYear);

        var line = [
          [x1, y1],
          [x2, y2]
        ];

        $scope.mean_trophic_level.push({key:'reg 1', values: line});

      };

  });
