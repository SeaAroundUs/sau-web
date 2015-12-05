'use strict';

/*global $*/

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
        numBuckets: '=',
        bucketRollovers: '=',
        selectedBucket: '='
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
  .directive('spatialCatchTimeline', function($timeout) {
    return {
      templateUrl: 'views/spatial-catch/spatial-catch-timeline.html',
      restrict: 'E',
      require: 'ngModel',
      scope: {
        onSlideStopDebounce: '&',
        loadingProgress: '='
      },
      link: function (scope, element, attrs, ngModelCtrl) {
        var slider = angular.element('#timeline-slider').slider();
        var sliderReleasedPromise;
        var progressBarElement;

        slider.on('change', function(event) {
          ngModelCtrl.$setViewValue(event.value.newValue);
        });

        //Sends out a delayed event that the user can handle.
        slider.on('slideStop', function () {
          $timeout.cancel(sliderReleasedPromise);
          sliderReleasedPromise = $timeout(scope.onSlideStopDebounce, 0);
        });

        //Cancels the delayed 'slideStop' event.
        slider.on('slideStart', function () {
          $timeout.cancel(sliderReleasedPromise);
        });

        ngModelCtrl.$formatters.push(function(modelValue) {
          return modelValue;
        });

        ngModelCtrl.$render = function() {
          $timeout(function() {
            slider.slider('refresh');
            slider.slider('setValue', ngModelCtrl.$viewValue);
          });
        };

        ngModelCtrl.$parsers.push(function(viewValue) {
          return +viewValue;
        });

        function progressToCssWidth() {
          return Math.round(scope.loadingProgress * 100) + '%';
        }

        //Create the progress bar.
        $timeout(function createProgressBar () {
          progressBarElement = $('.slider-track-high').clone().insertBefore('.slider-track-high').removeClass('right').css({left: '0px', backgroundColor: '#2F5B82', width: progressToCssWidth()});
          scope.$watch('loadingProgress', function updateProgressBar() {
            progressBarElement.css('width', progressToCssWidth());
          });
        });
      }
    };
  })
  .directive('taxaSelectize', function ($timeout) {
    return {
      template: '<select></select>',
      restrict: 'E',
      replace: true,
      scope: {
        options: '=',
        items: '='
      },
      link: function (scope, element) {
        /*
        This is used to render the list items in the multi-select dropdowns for taxa.
        It shows both the common and scientific names, scientific in italics.
        */
        function makeTaxaDropdownItem (item, escape) {
          var result = '<div>' + escape(item.common_name);
          if (item.scientific_name) {
            result += ' <span class="scientific-name">(' + escape(item.scientific_name) + ')</span>';
          }
          return result + '</div>';
        }

        /*
        View > Model binding
        */
        function onComponentChanged() {
          $timeout(function() {
            scope.items = component.items;
          });
        }

        /*
        Model > View binding
        */
        function onModelChanged() {
          component.setValue(scope.items, true);
          component.refreshOptions(false);
        }

        //Component setup
        var config = {
          options: scope.options,
          valueField: 'taxon_key',
          labelField: 'displayName',
          placeholder: 'Select...',
          sortField: 'common_name',
          searchField: ['common_name', 'scientific_name'],
          plugins: ['remove_button'],
          maxOptions: null,
          maxItems: 10,
          render: {item: makeTaxaDropdownItem, option: makeTaxaDropdownItem}
        };

        //Create the component and set up bindings
        var query = element.selectize(config);
        var component = query[0].selectize;
        query.on('change', onComponentChanged);
        scope.$watchCollection('items', onModelChanged);
      }
    };
  });
