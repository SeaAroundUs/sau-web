'use strict';

angular.module('sauWebApp').controller('PercentOfLandingsChartCtrl',
  function ($scope, sauAPI) {

    function init() {
      $scope.updateDataDownloadUrl(sauAPI.apiURL + '/global/eez-vs-high-seas/?format=csv');
    }

    window.scope = $scope;

    var data = sauAPI.EEZVsHighSeasData.get({}, function() {
      $scope.data = data.data;
      $scope.updateChartTitle('Percent of landings in EEZs vs. High Seas');
    });

    $scope.colors = ['#f00','#00f'];

    $scope.options = {
      chart: {
        showControls: false,
        style: 'expand',
        type: 'stackedAreaChart',
        height: 350,
        x: function(d){return d[0];},
        y: function(d){return d[1];},
        useInteractiveGuideline: true,
        xAxis: {
          showMaxMin: false,
          tickValues: [1950,1955,1960,1965,1970,1975,1980,1985,1990,1995,2000,2005,2010,2015,2020]
        },
        yAxis: {
          axisLabel: 'Percent of global catch'
        }
      }
    };

    init();
  });
