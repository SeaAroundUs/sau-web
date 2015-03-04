'use strict';

angular.module('sauWebApp').controller('RegionDetailCtrl',
  function ($scope, $rootScope, $q, $routeParams, $location, $window, sauAPI, region_id) {

    $scope.feature = null;

    $scope.viewContentLoaded = $q.defer();

    $rootScope.modalInstance.opened.then(function() {
      $scope.viewContentLoaded.resolve();
    });

    $scope.tabs = [
      {title: 'Catch Info',   template:'views/region-detail/catch.html'},
      {title: 'Biodiversity', template: 'views/region-detail/biodiversity.html'},
      {title: 'Ecosystems',   template: 'views/region-detail/ecosystems.html'},
      {title: 'Governance',   template: 'views/region-detail/governance.html'},
      {title: 'Indicators',   template: 'views/region-detail/indicators.html'},
      {title: 'Feedback',     template: 'views/region-detail/feedback.html'}
    ];

    $scope.viewContentLoaded.promise.then(function() {

      for (var i=0; i<$scope.tabs.length; i++) {
        $scope.tabs[i].active = false;
      }
      if ($routeParams.tab) {
        // allow ?tab=N to select the Nth tab on load. Until we can
        // fully support tabs changing this query parameter,
        // just immediately drop the parameter from the search
        // args to avoid confusion with the URL.  --jls
        $scope.tabs[$routeParams.tab].active = true;
        $location.search('tab', null);
      } else {
        $scope.tabs[0].active = true;
      }
    });


    $scope.dimensions = [
      {label: 'Taxon', value: 'taxon'},
      {label: 'Commercial Group', value: 'commercialgroup'},
      {label: 'Functional Group', value: 'functionalgroup'},
      {label: 'Country', value: 'country'},
      // {label: 'Gear', value: 'gear'},
      {label: 'Sector', value: 'sector'},
      {label: 'Catch Type', value: 'catchtype'},
    ];

    $scope.measures = {
      'tonnage': {label: 'Tonnage', value: 'tonnage', chartlabel: 'Catch(t)'},
      'value': {label: 'Landed Value', value: 'value', chartlabel: 'Landed value (U.S. $)'}
    };

    $scope.limits = [
      {label: '20', value: '20'},
      {label: '10', value: '10'},
      {label: '5', value: '5'},
      {label: '1', value: '1'},
    ];

    $scope.formModel = {
      dimension: $scope.dimensions[0],
      measure: $scope.measures.tonnage,
      limit : $scope.limits[1],
      region_id: parseInt(region_id)
    };

    $scope.updateRegion = function() {
      $scope.feature = sauAPI.Region.get({region: $scope.region.name, region_id: $scope.formModel.region_id});
      if ($scope.region.name === 'global') {
        $location.path('/' + $scope.region.name, false);
      } else {
        $location.path('/' + $scope.region.name + '/' + $scope.formModel.region_id, false);
      }
    };

    $scope.hoverRegion = $scope.feature;

    $scope.close = function () {
      $rootScope.modalInstance.close();
    };

    $scope.download = function() {
      // FIXME: constructing url manually, I don't know how to get it out of the $resource
      // This should probably be in a service or something too.
      var url = ['',
        sauAPI.apiURL,
        $scope.region.name,
        '/',
        $scope.formModel.measure.value,
        '/',
        $scope.formModel.dimension.value,
        '/?format=csv&limit=',
        $scope.formModel.limit.value,
        '&region_id=',
        $scope.formModel.region_id,
      ].join('');
      $window.open(url, '_blank');
    };


    $scope.updateData = function() {
      var data_options = {region: $scope.region.name, region_id: $scope.formModel.region_id};
      data_options.dimension = $scope.formModel.dimension.value;
      data_options.measure = $scope.formModel.measure.value;
      data_options.limit = $scope.formModel.limit.value;
      var data = sauAPI.Data.get(data_options, function() {
          $scope.data = data.data;
      });
    };

    $scope.clickFormLink = function(dim, measure) {
      $scope.formModel.dimension = dim;
      $scope.formModel.measure = $scope.measures[measure];
    };

    $scope.$watch('formModel.region_id', $scope.updateRegion);
    $scope.$watch('formModel', $scope.updateData, true);

});