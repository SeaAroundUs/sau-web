;(function() {

'use strict';

angular.module('sauWebApp').controller('PercentOfLandingsChartCtrl',
  function ($scope, sauAPI, externalURLs) {

    function init() {
      $scope.updateDataDownloadUrl(sauAPI.apiURL + '/global/eez-vs-high-seas/?format=csv');
    }

    window.scope = $scope;
    $scope.methodURL = externalURLs.docs + 'saup_manual.htm#13';

    var data = sauAPI.EEZVsHighSeasData.get({}, function() {
      $scope.data = data.data;
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
          tickValues: [1950,1960,1970,1980,1990,2000,2010,2020],
        },
        yAxis: {
          axisLabel: 'Percent of global catch'
        }
      }
    };

    init();
  });
})();