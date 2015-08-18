'use strict';

/* global d3 */
/* global ss */

angular.module('sauWebApp')
.directive('lineChartWithRegression', function() {

  var controller = function($scope) {

    $scope.regressionModel = {};

    $scope.showMaximizer = false;
    $scope.showRegression = true;

    $scope.options = {
      chart: {
        type: 'lineChart',
        height: 200,
        margin : {
          top: 20,
          right: 20,
          bottom: 60,
          left: 85
        },
        color: ['#00f', '#f00'],
        x: function(d){
          if (d){
            return d[0];
          }
        },
        y: function(d){return d[1];},
        transitionDuration: 225,
        useInteractiveGuideline: false,
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
          axisLabel: $scope.ylabel
        },
        tooltipContent:function(key, x){
          var index = $scope.years.indexOf(x);
          return x + ':' + $scope.chartdata[0].values[index][1];
        },
      },
    };

    $scope.$watch('chartdata', function() {
      if (!$scope.showRegression) {
        $scope.changeRange();
      }
    }, true);

    $scope.$watch('years', function() {
      if (!$scope.years) {
        return;
      }
      $scope.fullRange = {
        startYear: $scope.years[0],
        endYear: $scope.years[$scope.years.length-1]
      };

      $scope.model = angular.copy($scope.fullRange);
      $scope.startYears = $scope.years;
      $scope.endYears = $scope.years;
      $scope.model.startYear = $scope.startYears[0];
      $scope.model.endYear = $scope.endYears[$scope.endYears.length-1];

    }, true);

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

      $scope.computeRegression();
    };

    $scope.computeRegression = function() {
      $scope.showRegression = false;
      var regression = ss.linear_regression();

      var startIndex = $scope.years.indexOf($scope.model.startYear);
      var endIndex = $scope.years.indexOf($scope.model.endYear);

      var newSeries = $scope.chartdata[0].values.slice(startIndex,endIndex+1);

      regression.data(newSeries);
      $scope.regressionModel.slope = regression.m();
      $scope.regressionModel.intercept = regression.b();
      $scope.regressionModel.r2 = ss.r_squared(newSeries, regression.line());

      var x1 = $scope.model.startYear;
      var x2 = $scope.model.endYear;
      var y1 = regression.line()($scope.model.startYear);
      var y2 = regression.line()($scope.model.endYear);

      var line = {
        key: 'Regression Line',
        values:
        [
          [x1, y1],
          [x2, y2]
        ]};

      if ($scope.chartdata.length === 1 ){
        $scope.chartdata.push(line);
      } else {
        $scope.chartdata[1] = line;
      }

    };
  };

  return {
    restrict: 'E',
    templateUrl: 'views/line-chart-with-regression.html',
    scope: {
      years:'=',
      chartdata: '=chartdata',
      ylabel: '@ylabel'
    },
    controller: controller
  };
});
