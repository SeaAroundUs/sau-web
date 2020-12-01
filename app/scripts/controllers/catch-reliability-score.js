  angular.module('sauWebApp').controller('CatchScoreCtrl',
    function ($scope, $location, $window, sauAPI, $routeParams, $modal) {
      $(function () {
      $.getJSON(sauAPI.apiURL + $scope.region.name + 'reliability-score/'+ $routeParams.ids, function(eezdata) {
        var eez = eezdata.data[0].data;
      });
    });
    });