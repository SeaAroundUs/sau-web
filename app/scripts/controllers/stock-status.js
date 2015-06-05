'use strict';

/* global angular */
/* global d3 */

angular.module('sauWebApp')
  .controller('StockStatusCtrl', function ($scope, $routeParams, $modal, sauAPI, externalURLs, region) {
    var regionId = $routeParams.id || 1;
    $scope.data = {};
    $scope.regionName = region;
    $scope.region = sauAPI.Region.get({region: region, region_id: regionId});
    $scope.docsMethodsURL = externalURLs.sspMethods;

    var data = sauAPI.StockStatusData.get({region: region, region_id: regionId}, function() {
      $scope.showDownload = true;
      angular.forEach(data.data, function(data_set, key) {
        $scope.data[key] = data_set;
      });
    });

    $scope.downloadModalGA = {
      category: 'DownloadModal',
      action: 'Open'
    };

    $scope.css_options = {
      chart: {
        type: 'stackedAreaChart',
        height: 350,
        margin : {
          top: 20,
          right: 20,
          bottom: 60,
          left: 65
        },
        showControls: false,
        style: 'expand',
        x: function(d){return d[0];},
        y: function(d){return d[1];},
        useInteractiveGuideline: true,
        xAxis: {
          showMaxMin: false,
          tickValues: [1950,1960,1970,1980,1990,2000,2010,2020],
          axisLabel: 'Year'
        },
        yAxis: {
          tickFormat: function(d){
            return d3.format(',.1s')(d);
          },
          axisLabel: 'Catch by stock status'
        },
        color: ['#B42626', '#FF8E05', '#F5DFB4','#9CCE36', '#056705' ]
      }
    };

    $scope.nss_options = angular.copy($scope.css_options);
    $scope.nss_options.chart.yAxis.axisLabel = 'Number of stocks by status';

    $scope.openDownloadDataModal = function() {
      var params = [
        sauAPI.apiURL,
        region,
        '/stock-status',
        '/?format=csv',
        '&region_id=',
        regionId
      ];

      $modal.open({
        templateUrl: 'views/download-data-modal.html',
        controller: 'DownloadDataModalCtrl',
        resolve: {
          dataUrl: function() { return params.join(''); }
        }
      });
    };
  });
