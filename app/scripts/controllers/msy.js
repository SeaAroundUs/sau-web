  angular.module('sauWebApp').controller('MsyCtrl',
  function ($scope, $location, $window, sauAPI, $routeParams) {
    $(function () {
      var msy_arearange = new Array();
      var catch_json = new Array();
      var msy_catch_json = new Array();

      var bmsy_arearange = new Array();
      var bmsy_catch_json = new Array();

      var fmsy_arearange = new Array();
      var fmsy_catch_json = new Array();

      $.getJSON(sauAPI.apiURL + 'msy/' + $routeParams.ids, function(data) {
        // Populate series
        var msy = data.data[0].data;
        var sciname = data.data[0].scientific_name;
        for (var i = 0; i < msy.length; i++){
          msy_arearange.push([msy[i][0],msy[i][3],msy[i][4]]);
          catch_json.push([msy[i][0],msy[i][1]]);
          msy_catch_json.push([msy[i][0],msy[i][2]]);
        }
        // draw chart
        $('#msycontainer').highcharts(
        {
          title: {
            text: ""
          },
          xAxis: {
            title: {
              text: 'Years'
            },
            startOnTick:true,
            pointStart: 1950,
            minPadding:0,
            tickInterval: 10
          },
          yAxis: {
            title: {
              text: "(t x 1000)",
            },
			lineWidth: 1,
			lineColor: '#000000'
          },
          tooltip: {
            crosshairs: true,
            shared: true
          },
          series: [{
            name: 'MSY',
            data: msy_catch_json,
            color: 'black',
            //dashStyle: 'Dash',
            zIndex: 1,
            marker: {
              enabled: false
            }
          },
            {
              name: 'Upper and Lower MSY',
              data: msy_arearange,
              type: 'arearange',
              lineWidth: 0,
              linkedTo: ':previous',
              fillOpacity: 0.3,
              zIndex: 0,
              marker: {
                enabled: false
              }
            },
            {
              name: 'Catches',
              type: 'area',
              data: catch_json,
              marker: {
                enabled: false
              },
              color: '#20639B',
            }],
          legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'top',
            itemMarginTop: 0
          },
          exporting: {
            buttons:{
//					contextButton: {
//                 enabled: true,
//                  text: '',
//                  symbol: undefined
//              }
//					customButton: {
//						text: 'Custom Button',
//						onclick: function () {
//							this.setTitle({text: 'Miel'});
//						}
//					},
//				anotherButton: {
//						text: 'Another Button',
//						onclick: function () {
//							alert('You pressed another button!');
//						}
//					}
				}
          }
        });

        $(function () {
          var span = $('h1').find('span')
          $('h1').text('Catch for ' + sciname);
          $('h1').append(span);
        });

        $(".msy").change(function(){
          var msy_value = $(this).val();
          switch(msy_value){
            case "CMSY":
              var chart = $('#msycontainer').highcharts();
              msy_arearange = [];
              msy_catch_json = [];
              catch_json = [];
              for (i = 0; i < msy.length; i++){
                msy_arearange.push([msy[i][0],msy[i][3],msy[i][4]]);
                msy_catch_json.push([msy[i][0],msy[i][2]]);
                catch_json.push([msy[i][0],msy[i][1]]);
              }
              chart.series[0].setData(msy_catch_json);
              chart.series[0].update({name:'MSY'}, false);
              chart.series[1].update({name:'Upper and Lower CMSY'}, false);
              chart.series[1].setData(msy_arearange);
              chart.addSeries({name: 'Catches', type: 'area',data:catch_json,marker: {enabled: false},color: '#20639B'});
              //chart.series[2].setData(catch_json);
              chart.redraw();

              var span = $('h1').find('span')
              $('h1').text('Catch for ' + sciname);
              $('h1').append(span);
            break;
            case "BMSY":
              var chart = $('#msycontainer').highcharts();
              for (i = 0; i < msy.length; i++){
                bmsy_arearange.push([msy[i][0],msy[i][6],msy[i][7]]);
                bmsy_catch_json.push([msy[i][0],msy[i][5]]);
              }
              chart.series[0].setData(bmsy_catch_json);
              chart.series[0].update({name:'BMSY'}, false);
              chart.series[1].setData(bmsy_arearange);
              chart.series[1].update({name:'Upper and Lower BMSY'}, false);
              //chart.series[2].setData();
              if (chart.series[2]){
              chart.series[2].remove();
             }
              chart.redraw();

              var span2 = $('h1').find('span')
              $('h1').text('Biomass for ' + sciname);
              $('h1').append(span2);
            break;
            case "FMSY":
              var chart = $('#msycontainer').highcharts();
              for (i = 0; i < msy.length; i++){
                fmsy_arearange.push([msy[i][0],msy[i][9],msy[i][10]]);
                fmsy_catch_json.push([msy[i][0],msy[i][8]]);
              }
              chart.series[0].setData(fmsy_catch_json);
              chart.series[0].update({name:'Exploitation'}, false);
              chart.series[1].setData(fmsy_arearange);
              chart.series[1].update({name:'Upper and Lower Exploitation'}, false);
              //chart.series[2].setData();
              if (chart.series[2]){
              chart.series[2].remove();
             }
              chart.redraw();

              var span3 = $('h1').find('span')
              $('h1').text('Exploitation for ' + sciname);
              $('h1').append(span3);
            break;
            default:
              //code
            break;
          }
        });

      });
    });
  });