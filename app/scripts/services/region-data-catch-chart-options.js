'use strict';

angular.module('sauWebApp')
  .factory('regionDataCatchChartOptions', function() {
    return {
      chart: {
        type: 'stackedAreaChart',
        height: 504,
        margin : {
          right: 16,
          bottom: 26
        },
        x: function(d) { return d[0]; },
        y: function(d) { return d[1]; },
        transitionDuration: 0,
        useInteractiveGuideline: true,
        showControls: false,
        xAxis: {
          showMaxMin: false,
          tickValues: [1950,1960,1970,1980,1990,2000,2010,2019,2030]
        },
        yAxis: {
          showMaxMin: false
        },
        cData: ['Stacked','Stream','Expanded']
      }
    };
  });
