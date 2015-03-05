;(function() {

    'use strict';

    angular.module('sauWebApp').controller('ProceduresAndOutcomesCtrl',
      function ($scope, $routeParams) {
        $scope.region_id = $routeParams.id;
        $scope.template = 'views/rfmo/content/' + $scope.region_id + '.html';
      });

})();