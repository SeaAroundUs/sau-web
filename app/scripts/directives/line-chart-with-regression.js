'use strict';

angular.module('sauWebApp')
.directive('lineChartWithRegression', function() {

  var controller = function($scope) {

    $scope.regressionModel = {};

    $scope.showMaximizer = false;
    $scope.showRegression = true;

    $scope.$watch('years', function() {
      $scope.fullRange = {
        startYear: $scope.years[0],
        endYear: $scope.years[$scope.years.length-1]
      };

      $scope.model = angular.copy($scope.fullRange);
      $scope.startYears = $scope.years;
      $scope.endYears = $scope.years;
      $scope.model.startYear = $scope.startYears[0];
      $scope.model.endYear = $scope.endYears[$scope.endYears.length-1];

      $scope.fullChartdata = angular.copy($scope.chartdata);

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


      var newSeries = {key: $scope.fullChartdata[0].key, values: $scope.fullChartdata[0].values.slice(startIndex,endIndex+1)};
      $scope.chartdata = [newSeries];

      $scope.computeRegression();
    };

    $scope.computeRegression = function() {
      $scope.showRegression = false;
      var regression = ss.linear_regression();
      regression.data($scope.chartdata[0].values);
      $scope.regressionModel.slope = regression.m();
      $scope.regressionModel.intercept = regression.b();
      $scope.regressionModel.r2 = ss.r_squared($scope.chartdata[0].values, regression.line());

      var x1 = $scope.model.startYear;
      var x2 = $scope.model.endYear;
      var y1 = regression.line()($scope.model.startYear);
      var y2 = regression.line()($scope.model.endYear);

      var line = [
        [x1, y1],
        [x2, y2]
      ];

      $scope.chartdata.push({key:'reg 1', values: line});

    };
  };

  return {
    restrict: 'E',
    templateUrl: 'views/line-chart-with-regression.html',
    scope: {
      years:'=',
      chartdata: '=chartdata',
      options: '=options',
    },
    controller: controller
  };
});