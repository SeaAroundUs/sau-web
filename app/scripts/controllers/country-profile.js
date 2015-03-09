;(function() {

  'use strict';

  angular.module('sauWebApp')
    .controller('CountryProfileCtrl', function ($scope, $routeParams, sauAPI) {
      var data = sauAPI.CountryProfile.get({region_id: $routeParams.id }, function() {
        $scope.profile = data.data;
      });
    });

})();
