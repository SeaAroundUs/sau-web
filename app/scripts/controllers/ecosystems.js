  angular.module('sauWebApp').controller('EcosystemsCtrl',
    function ($scope, $location, $window, sauAPI, $routeParams, $modal) {
      $(function () {
        var eco_range = new Array();
        var area_color = new Array();
        $.getJSON(sauAPI.apiURL + 'ecosystems/' + $routeParams.ids, function(data) {
          var ecosystems = data.data[0].data;
          var ecocount = data.data;
          var eez_name = data.data[0].eez_name;
          area_color = ['#FFFF00','#F08080','#b5651d','#008000','#000000','#00BFFF','#32CD32','#696969','#87CEFA']
          for (var i = 0; i < ecocount.length; i++){
            switch (data.data[i].eco_name) {
              case 'Estuaries':
                eco_range.push({name:data.data[i].eco_name, data: data.data[i].data, index:9, legendIndex: 1, color: area_color[0], marker:{enabled: false}});
              break;
              case 'Coral reefs':
                eco_range.push({name:data.data[i].eco_name, data: data.data[i].data, index:8, legendIndex: 2, color: area_color[1], marker:{enabled: false}});
              break;
              case 'Remaining inshore area':
                eco_range.push({name:data.data[i].eco_name, data: data.data[i].data, index:7, legendIndex: 3, color: area_color[2], marker:{enabled: false}});
              break;
              case 'Fronts in EEZ':
                eco_range.push({name:data.data[i].eco_name, data: data.data[i].data, index:6, legendIndex: 4, color: area_color[3], marker:{enabled: false}});
              break;
              case 'Seamounts in EEZ':
                eco_range.push({name:data.data[i].eco_name, data: data.data[i].data, index:5, legendIndex: 5, color: area_color[4], marker:{enabled: false}});
              break;
              case 'Remaining EEZ area':
                eco_range.push({name:data.data[i].eco_name, data: data.data[i].data, index:4, legendIndex: 6, color: area_color[5], marker:{enabled: false}});
              break;
              case 'Fronts in high seas':
                eco_range.push({name:data.data[i].eco_name, data: data.data[i].data, index:3, legendIndex: 7, color: area_color[6], marker:{enabled: false}});
              break;
              case 'Seamounts in high seas':
                eco_range.push({name:data.data[i].eco_name, data: data.data[i].data, index:2, legendIndex: 8, color: area_color[7], marker:{enabled: false}});
              break;
              case 'Remaining high seas area':
                eco_range.push({name:data.data[i].eco_name, data: data.data[i].data, index:1, legendIndex: 9, color: area_color[5], marker:{enabled: false}});
              break;
            }
          }
          $('#ecosystemscontainer').highcharts(
          {
          title: {
            text: ""
          },
          chart: {
            type: 'area'
          },
          dataSorting: {
            enabled: true,
            sortKey: 'custom.value'
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
          plotOptions: {
            series: {
              stacking: 'normal'
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