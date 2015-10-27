'use strict';

angular.module('sauWebApp').directive('define', function(sauAPI) {
  var controller = function($scope, $element, $attrs, $transclude) {
    $transclude(function(content) {
      sauAPI.Glossary.get().$promise.then(function(res) {
        if (content[0].textContent && res.data[content[0].textContent]) {
          $scope.definition = '<div class="definition"><span>' + content[0].textContent + ':</span><div>' +
            res.data[content[0].textContent] + '</div></div>';
        }
      });
    });
  };

  return {
    controller: controller,
    restrict: 'E',
    scope: {},
    templateUrl: 'views/define.html',
    transclude: true
  };
});
