'use strict';

angular.module('sauWebApp')
  .directive('spatialCatchLegendKey', function () {
    return {
      templateUrl: 'views/spatial-catch/spatial-catch-legend-key.html',
      restrict: 'E',
      scope: {
        keyName: '=',
        color: '=',
        maxLabel: '=',
        minLabel: '='
      },
      link: function(scope, element) {
        scope.legendColorBar = element.children('.legend-color-bar').first();

      },
      controller: function ($scope) {
        $scope.$watch('color', colorAll);

        function colorAll() {
          for (var i = 0; i < 5; i++) {
            $scope.colorMe(i);
          }
        }

        $scope.colorMe = function(index) {
          var pct = index / 6;
          var color = lightenColor($scope.color, pct);
          var swatch = $scope.legendColorBar.children('.legend-color-swatch')[index];
          //Swatch will be null if this function gets called befor the DOM is ready.
          if (swatch) {
            swatch.style.backgroundColor = colorArrayToCss(color);
          }
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