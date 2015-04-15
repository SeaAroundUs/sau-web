'use strict';

angular.module('sauWebApp')
.directive('sauLegendMariculture', function (insetMapLegendData, sauD3Utils) {

  var controller = function($scope) {
    $scope.markers = insetMapLegendData.mariculture.map(function(marker) {
      var circleProperties = sauD3Utils.pointCircleProperties(marker.value);
      marker.color = circleProperties.color;
      marker.size = circleProperties.size;
      return marker;
    });
  };

  return {
    templateUrl: 'views/sau-legend-mariculture.html',
    restrict: 'E',
    controller: controller
  };

});