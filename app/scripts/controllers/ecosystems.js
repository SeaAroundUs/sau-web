  angular.module('sauWebApp').controller('EcosystemsCtrl',
    function ($scope, $location, $window, sauAPI, $routeParams, $modal) {
      $(function () {
        var eco_range = new Array();
        var area_color = new Array();
        $.getJSON(sauAPI.apiURL + 'ecosystems/' + $routeParams.ids, function(data) {
          var ecosystems = data.data[0].data;
          var ecocount = data.data;
          var eez_name = data.data[0].eez_name;
          area_color = ['#003f5c','#374c80','#7a5195','#bc5090','#ef5675','#ff764a']
          for (var i = 0; i < ecocount.length; i++){
            eco_range.push({name:data.data[i].eco_name, data: data.data[i].data, color: area_color[i], marker:{enabled: false}});
          }
          $('#ecosystemscontainer').highcharts(
          {
          title: {
            text: ""
          },
          chart: {
            type: 'area'
          },
          xAxis: {
            lineWidth: 1,
            lineColor: '#000000',
            startOnTick:true,
            pointStart: 1950,
            minPadding:0,
            tickInterval: 10
          },
          yAxis: {
            title: {
              useHTML: true,
              text: 'Catch',
              style: {
                fontSize: '18px'
              }
            },
            labels: {
              allowDecimals: false,
            },
            gridLineWidth: 0,
            min: 0,
            lineWidth: 1,
            lineColor: '#000000',
            tickWidth: 1,
            tickmarkPlacement: 'on'
          },
          exporting: {
            enabled: false
          },
          legend: {
            enabled: true,
            useHTML: true,
            layout: 'horizontal',
            align: 'right',
            verticalAlign: 'top',
            itemMarginTop: 0,
            itemStyle: {
              fontSize:'15px'
            }
          },
          series: eco_range
        });
          $(function () {
            var span = $('h1').find('span');
            $('h1').html('Ecosystems of ' + eez_name);
            $('h1').append(span);
          });
        });

      });
    });