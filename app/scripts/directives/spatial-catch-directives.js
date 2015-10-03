'use strict';

angular.module('sauWebApp')
  .directive('spatialCatchLegendKey', function () {
    return {
      templateUrl: 'views/spatial-catch/spatial-catch-legend-key.html',
      restrict: 'E',
      scope: {
        keyName: '=',
        keyNameSecond: '=',
        color: '=',
        maxLabel: '=',
        minLabel: '=',
        keyLink: '=',
        numBuckets: '='
      },
      link: function(scope, element) {
        scope.legendColorBar = element.children('.legend-color-bar').first();

      },
      controller: function ($scope) {
        $scope.$watch('color', colorAll);
        if (!$scope.numBuckets) {
          $scope.numBuckets = 5;
        }

        function colorAll() {
          for (var i = 0; i < +$scope.numBuckets; i++) {
            $scope.colorMe(i);
          }
        }

        $scope.colorMe = function(index) {
          var lightenPct = ($scope.numBuckets - 1 - index) / (+$scope.numBuckets + 1);
          var color = lightenColor($scope.color, lightenPct);
          var swatch = $scope.legendColorBar.children('.legend-color-swatch')[index];
          //Swatch will be null if this function gets called befor the DOM is ready.
          if (swatch) {
            swatch.style.backgroundColor = colorArrayToCss(color);
            swatch.style.width = pctToCss(1 / +$scope.numBuckets);
          }
        };

        $scope.repeatForRange = function (range) {
          return new Array(+range);
        };

        function lightenColor (color, pct) {
          return [
            lightenChannel(color[0], pct),
            lightenChannel(color[1], pct),
            lightenChannel(color[2], pct),
            255
          ];
        }

        function lightenChannel (channel, pct) {
          return ~~((255 - channel) * pct + channel);
        }

        function colorArrayToCss (color) {
          return 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
        }

        function pctToCss(pct) {
          return Math.round(pct * 100) + '%';
        }
      }
    };
  })
  .directive('spatialCatchTimeline', function() {
    return {
      templateUrl: 'views/spatial-catch/spatial-catch-timeline.html',
      restrict: 'E',
      require: 'ngModel',
      link: function (scope, element, attrs, ngModelCtrl) {
        var slider = angular.element('#timeline-slider').slider();

        slider.on('change', function(event) {
          ngModelCtrl.$setViewValue(event.value.newValue);
        });

        ngModelCtrl.$formatters.push(function(modelValue) {
          return modelValue;
        });

        ngModelCtrl.$render = function() {
          slider.slider('setValue', ngModelCtrl.$viewValue);
        };

        ngModelCtrl.$parsers.push(function(viewValue) {
          return +viewValue;
        });
      }
    };
  });