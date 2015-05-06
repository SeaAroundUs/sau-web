'use strict';

angular.module('sauWebApp')
  .controller('ExpeditionCtrl', function ($scope, $modal, sauAPI) {

    getTimePeriods();
    getVessels();
    getCaptains();
    getScientists();

    $scope.selected = { period: $scope.timePeriods[0] };

    $scope.$watch('selected.period', getVessels);
    $scope.$watch('selected.captain', getScientists);

    $scope.getExpeditions = function(params) {
      var param, years;

      $scope.searchResults = null;
      $scope.expeditions = null;
      $scope.expDetails = null;

      for (param in params) {
        if (params.hasOwnProperty(param) && params[param].indexOf('-- Any') === 0) {
          delete params[param];
        }
      }

      if (params.period) {
        years = params.period.split(' - ');
        params.min_year = years[0];
        params.max_year = years[1];
      }

      sauAPI.Expeditions.get(params, function(resp) {
        $scope.searchResults = true;
        $scope.noData = (resp.data === undefined);

        $scope.expeditions = resp.data;
        $scope.searchParams = [];

        if (params.period) {
          $scope.searchParams.push('Time period: ' + params.period);
        }

        if (params.vessel) {
          $scope.searchParams.push('Vessel: ' + params.vessel);
        }

        if (params.captain) {
          $scope.searchParams.push('Captain: ' + params.captain);
        }

        if (params.scientist) {
          $scope.searchParams.push('Scientist: ' + params.scientist);
        }
      });
    };

    $scope.getExpeditionDetails = function(expId) {
      $scope.expDetails = null;

      sauAPI.Expeditions.get({id: expId}, function(resp) {
        $scope.expDetails = resp.data;
      });
    };

    $scope.acknowledgementModal = function() {
      $modal.open({templateUrl: 'views/exp-ack-modal.html', backdrop: false});
    };

    function getTimePeriods() {
      $scope.timePeriods = [
        '-- Any year --',
        '1598 - 1699',
        '1700 - 1799',
        '1800 - 1850',
        '1851 - 1900',
        '1901 - 1925',
        '1926 - 1950',
        '1951 - 1965',
        '1966 - 1980',
        '1981 - 1990',
        '1991 - 2000',
        '2001 - ' + (new Date()).getFullYear()
      ];
    }

    function getCaptains() {
      sauAPI.Expeditions.get({subview: 'captains'}, function(resp) {
        if (resp.data === undefined) {
          resp.data = [];
        }

        $scope.captains = resp.data;
        $scope.captains.unshift('-- Any captain --');
        $scope.selected.captain = $scope.captains[0];
      });
    }

    function getVessels() {
      var years;
      var params = {subview: 'vessels'};

      if ($scope.selected && $scope.timePeriods && $scope.selected.period !== $scope.timePeriods[0]) {
        years = $scope.selected.period.split(' - ');
        params.min_year = years[0];
        params.max_year = years[1];
      }

      sauAPI.Expeditions.get(params, function(resp) {
        if (resp.data === undefined) {
          resp.data = [];
        }

        $scope.vessels = resp.data;
        $scope.vessels.unshift('-- Any vessel --');
        $scope.selected.vessel = $scope.vessels[0];
      });
    }

    function getScientists() {
      var params = {subview: 'scientists'};

      if ($scope.selected && $scope.captains && $scope.selected.captain !== $scope.captains[0]) {
        params.captain = $scope.selected.captain;
      }

      sauAPI.Expeditions.get(params, function(resp) {
        if (resp.data === undefined) {
          resp.data = [];
        }

        $scope.scientists = resp.data;
        $scope.scientists.unshift('-- Any scientist --');
        $scope.selected.scientist = $scope.scientists[0];
      });
    }
  });
