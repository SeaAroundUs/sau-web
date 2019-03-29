  angular.module('sauWebApp').controller('MsyCtrl',
  function ($scope, $location, $window, sauAPI, $routeParams) {
    $(function () {
      var msy_arearange = new Array();
      var catch_json = new Array();
      var msy_catch_json = new Array();

      var bmsy_json = new Array();
      var bmsy_arearange = new Array();
      var bmsy_catch_json = new Array();

      var fmsy_json = new Array();
      var fmsy_arearange = new Array();
      var fmsy_catch_json = new Array();

      $.getJSON(sauAPI.apiURL + 'msy/' + $routeParams.ids, function(data) {
        // Populate series
        var msy = data.data[0].data;
        var sciname = data.data[0].scientific_name;
        var cname = data.data[0].common_name;
        var area = data.data[0].meow;
        for (var i = 0; i < msy.length; i++){
                bmsy_arearange.push([msy[i][0],msy[i][7],msy[i][8]]);
                bmsy_json.push([msy[i][0],msy[i][5]]);
                bmsy_catch_json.push([msy[i][0],msy[i][6]]);
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
              useHTML: true,
              text: '(B/B<sub>MSY</sub>)',
            },
            gridLineWidth: 0,
            lineWidth: 1,
            lineColor: '#000000'
          },
          tooltip: {
            crosshairs: true,
            shared: true
          },
          series: [
          {
            name: 'Biomass',
            data: bmsy_catch_json,
            color: 'black',
            dashStyle: 'Dash',
            marker: {
              enabled: false
            }
          },
            {
              name: 'Biomass',
              type: 'line',
              data: bmsy_json,
              marker: {
                enabled: false
              },
              color: '#20639B',
            },
//            {
//               name: 'BMSY',
//              data: bmsy_catch_json,
//              color: 'black',
//              dashStyle: 'Dash',
//              zIndex: 1,
//              marker: {
//                enabled: false
//              }
//            },
            {
              name: 'Upper and Lower BMSY',
              data: bmsy_arearange,
              type: 'arearange',
              lineWidth: 0,
              linkedTo: ':previous',
              fillOpacity: 0.3,
              zIndex: 0,
              marker: {
                enabled: false
              }
            }
            //},
              ],
          legend: {
            enabled: false,
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
          var span = $('h1').find('span');
          $('h1').text('Relative biomass of ' + cname + ' ('+sciname +') in ' + area);
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
              chart.series[1].setData(catch_json);
              chart.series[1].update({name:'Catch'}, false);
              chart.series[2].update({name:'Upper and Lower CMSY'}, false);
              chart.series[2].setData(msy_arearange);
              chart.yAxis[0].axisTitle.attr({useHTML: true, text: 'Catch (t * 10<sup>3</sup>)'});
              //chart.addSeries({name: 'Catches', type: 'line',data:catch_json,marker: {enabled: false},color: '#20639B'});
              chart.redraw();

              var span = $('h1').find('span')
              $('h1').text('Catch of ' + cname + ' ('+sciname +') in ' + area);
              $('h1').append(span);
            break;
            case "BMSY":
              var chart = $('#msycontainer').highcharts();
              bmsy_arearange = [];
              bmsy_catch_json = [];
              bmsy_json = [];
              for (i = 0; i < msy.length; i++){
                bmsy_arearange.push([msy[i][0],msy[i][7],msy[i][8]]);
                bmsy_catch_json.push([msy[i][0],msy[i][6]]);
                bmsy_json.push([msy[i][0],msy[i][5]]);
              }
              chart.series[0].setData(bmsy_catch_json);
              chart.series[0].update({name:'BMSY'}, false);
              chart.series[1].setData(bmsy_json);
              chart.series[1].update({name:'Biomass'}, false);
              chart.series[2].update({name:'Upper and Lower BMSY'}, false);
              chart.series[2].setData(bmsy_arearange);
              chart.yAxis[0].axisTitle.attr({text: '(B/B<sub>MSY</sub>)'});
              //chart.series[2].setData();
              //if (chart.series[2]){
              //  chart.series[2].remove();
              //}
              chart.redraw();

              var span2 = $('h1').find('span')
              $('h1').text('Relative biomass of ' + cname + ' ('+sciname +') in ' + area);
              $('h1').append(span2);
            break;
            case "FMSY":
              var chart = $('#msycontainer').highcharts();
              fmsy_arearange = [];
              fmsy_catch_json = [];
              fmsy_json = [];
              for (i = 0; i < msy.length; i++){
                fmsy_arearange.push([msy[i][0],msy[i][11],msy[i][12]]);
                fmsy_catch_json.push([msy[i][0],msy[i][10]]);
                fmsy_json.push([msy[i][0],msy[i][9]]);
              }
              chart.series[0].setData(fmsy_catch_json);
              chart.series[0].update({name:'FMSY'}, false);
              chart.series[1].setData(fmsy_json);
              chart.series[1].update({name:'Exploitation'}, false);
              chart.series[2].update({name:'Upper and Lower Exploitation'}, false);
              chart.series[2].setData(fmsy_arearange);
              chart.yAxis[0].axisTitle.attr({text: '(F/F<sub>MSY</sub>)'});
              //chart.series[2].setData();
              //if (chart.series[2]){
              //  chart.series[2].remove();
              //}
              chart.redraw();

              var span3 = $('h1').find('span')
              $('h1').text('Exploitation rate of ' + cname + ' ('+sciname +') in ' + area);
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