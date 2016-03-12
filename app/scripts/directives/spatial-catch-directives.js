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
        colors: '=',
        maxLabel: '=',
        minLabel: '=',
        keyLink: '=',
        boundaries: '=',
        selectedBucket: '=',
        currValue: '='
      },
      link: function(scope, element) {
        scope.legendColorBar = element.children('.legend-color-bar').first();
      },
      controller: function ($scope, $timeout) {

        function colorAll() {
          if (!$scope.colors) {
            console.log('No colors specified in spatial catch legend key. Cannot render.');
            return;
          }
          for (var i = 0; i < $scope.colors.length; i++) {
            $scope.colorMe(i);
          }
        }

        $scope.colorMe = function(colorIndex) {
          var swatch = $scope.legendColorBar.children('.legend-color-swatch')[colorIndex];
          //Swatch will be null if this function gets called befor the DOM is ready.
          if (swatch) {
            swatch.style.backgroundColor = $scope.colors[colorIndex];
            swatch.style.width = pctToCss(1 / $scope.colors.length);
          }
        };

        function pctToCss(pct) {
          return Math.round(pct * 10000) / 100 - 0.01 + '%';
        }

        $timeout(function initColors() {
          colorAll();
          $scope.$watch('color', colorAll);
        });
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

        //Updates the slider's layout when it goes from hidden to visible and vice versa.
        scope.$on('toggleFormVis', function() {
          refreshSlider();
        });

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
          refreshSlider();
        };

        ngModelCtrl.$parsers.push(function(viewValue) {
          return +viewValue;
        });

        function progressToCssWidth() {
          return Math.round(scope.loadingProgress * 100) + '%';
        }

        function refreshSlider() {
          $timeout(function() {
            slider.slider('refresh');
            slider.slider('setValue', ngModelCtrl.$viewValue);
          });
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
        items: '=',
        maxItems: '='
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
          maxItems: scope.maxItems || 10,
          render: {item: makeTaxaDropdownItem, option: makeTaxaDropdownItem}
        };

        //Create the component and set up bindings
        var query = element.selectize(config);
        var component = query[0].selectize;
        query.on('change', onComponentChanged);
        scope.$watchCollection('items', onModelChanged);
      }
    };
  })
  .directive('oceanLegend', function () {
    return {
      templateUrl: 'views/spatial-catch/spatial-catch-ocean-legend.html',
      restrict: 'E',
      scope: {
        color: '=',
        label: '='
      },
      link: function (scope, element) {
        var keyElement = element.find('.ocean-legend-key');
        keyElement.css('background-color', scope.color);
      }
    };
  });
