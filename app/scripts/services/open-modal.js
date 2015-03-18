;(function() {

 /* global angular */

 'use strict';

 angular.module('sauWebApp')
 .service('openModal', function ($rootScope, $location, $route, $modal) {

  this.open = function(region_id, scope) {
    if ($rootScope.modalInstance) {
        // clean house
        $rootScope.modalInstance.close();
      }

      $rootScope.modalInstance = $modal.open({
        templateUrl: 'views/region-detail/main.html',
        controller: 'RegionDetailCtrl',
        scope: scope,
        size: 'lg',
        background: false,
        resolve: {
          region_id: function () {
            return region_id;
          }
        }
      });

      var closedModal = function (result) {
        if (result && result.location) {
          $location.path(result.location);
          $route.reload();
        } else {
        // closed another way
        // modal needs to disable geojson clicks, reenable it=
        scope.handleGeojsonClick();
        scope.handleGeojsonMouseout();
        scope.handleGeojsonMouseover();
        $location.path('/' + scope.region, false);
      }
    };

    $rootScope.modalInstance.result.then(closedModal, closedModal);
  };
});

})();