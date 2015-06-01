'use strict';

angular.module('sauWebApp').controller('KeyInfoOnTaxonCtrl',
  function ($scope, sauAPI, $routeParams, $timeout, $filter) {
    $scope.colors = { red: '#FC111E', blue: '#0F25FA', green: '#138115' };

    $scope.legend = [
      { label: 'Biological', color: $scope.colors.red },
      { label: 'Depth related', color: $scope.colors.blue },
      { label: 'Distance from shore', color: $scope.colors.green }
    ];

    $scope.$watch('showHabitatIndex', function() {
      if ($scope.api && $scope.api.update) {
        $timeout(function() { $scope.api.update(); });
      }
    });

    sauAPI.Taxon.get({taxon_key: $routeParams.taxon},
      function(result) {
        $scope.taxon = result.data;
        if ($scope.taxon.has_habitat_index) {
          $scope.data = habitatIndexData($scope.taxon.habitat_index);
        }
      },
      function(error) {
        $scope.taxon = {
          error: error,
          key: $routeParams.taxon
        };
      }
    );

    $scope.options = {
      chart: {
        type: 'discreteBarChart',
        height: 500,
        x: function(d) { return $filter('capitalize')(d.label); },
        xAxis: { axisLabel: 'Habitat' },
        y: function(d) { return d.value; },
        yAxis: { axisLabel: 'Index' },
        forceY: [0.0, 1.0],
        tooltips: false,
        color: [
          $scope.colors.red, $scope.colors.red, $scope.colors.red, $scope.colors.red,
          $scope.colors.green, $scope.colors.green, $scope.colors.green,
          $scope.colors.blue, $scope.colors.blue
        ]
      }
    };

    function habitatIndexData(rawData) {
      var xLabels = [
        'estuaries',
        'coral',
        'seamount',
        'others',
        'shelf',
        'slope',
        'abyssal',
        'inshore',
        'offshore'
      ];

      var data = xLabels.reduce(function(data, label) {
        data.push({ label: label, value: rawData[label] });
        return data;
      }, []);

      return [{ key: 'Habitat Index', values: data }];
    }
  });
