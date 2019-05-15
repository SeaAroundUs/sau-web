  angular.module('sauWebApp').controller('MsyCtrl',
  function ($scope, $location, $window, sauAPI, $routeParams) {
    $(function () {
      var msy_arearange = new Array();
      var catch_json = new Array();
      var msy_catch_json = new Array();

      var bmsy_json = new Array();
      var bmsy_arearange = new Array();
      var bmsy_catch_json = new Array();
      //var bmsy_windowline = new Array();

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
          bmsy_arearange.push([msy[i][0],msy[i][8],msy[i][9]]);
          bmsy_json.push([msy[i][0],msy[i][5]]);
          bmsy_catch_json.push([msy[i][0],msy[i][6]]);
          //if (msy[i][15] && msy[i][16]){
            //bmsy_windowline.push({ x:msy[i][0], low:msy[i][15], high:msy[i][16], color:'black'});
          //}
        }
        // draw chart
        $('#msycontainer').highcharts(
        {
          title: {
            text: ""
          },
          xAxis: {
            title: {
              text: 'Years',
              style: {
                fontSize: '18px'
              }
            },
            startOnTick:true,
            pointStart: 1950,
            pointEnd: 2014,
            minPadding:0,
            tickInterval: 10
          },
          yAxis: [{
            title: {
              useHTML: true,
              //text: 'Relative biomass (B/B<sub>MSY</sub>)',
              text: 'Biomass (t * 10<sup>3</sup>)',
              style: {
                fontSize: '18px'
              }
            },
            labels: {
              format: '{value:.3f}'
            },
            gridLineWidth: 0,
            min: 0,
            lineWidth: 1,
            lineColor: '#000000',
          },
          {
            opposite: true,
            title: {
              useHTML: true,
              text: '',
              style: {
                fontSize: '18px'
              }
            },
            labels: {
              format: '{value:.3f}'
            },
            gridLineWidth: 0,
            lineWidth: 1,
            lineColor: '#000000',
          }
          ],
          tooltip: {
            crosshairs: true,
            shared: true
          },
          series: [
          {
            name: 'B/B<sub>MSY</sub>',
            data: bmsy_catch_json,
            showInLegend: false,
            enableMouseTracking: false,
            color: 'black',
            dashStyle: 'ShortDot',
            marker: {
              enabled: false
            }
          },
            {
              name: 'Relative biomass',
              showInLegend: false,
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
              id: 'upperandlowerbmsy',
              name: 'Conf. interval ',
              data: bmsy_arearange,
              type: 'arearange',
              lineWidth: 0,
              linkedTo: ':previous',
              fillOpacity: 0.3,
              zIndex: 0,
              color: '#b2dcff',
              marker: {
                enabled: false
              }
            //},
            //{
              //id: 'bmsywindowline',
              //type:'columnrange',
              //pointWidth: 2,
              //enableMouseTracking: false,
              //showInLegend: false,
              //data: bmsy_windowline
            }
//            {
//              id: 'halfbmsy',
//              name: 'Half BMSY',
//              showInLegend: false,
//              enableMouseTracking: false,
//              dashStyle: 'ShortDot',
//              data: halfbmsy_catch_json ,
//              marker: {
//                enabled: false
//              },
//              color: '#ff0000'
//            }
            //},
              ],
          legend: {
            enabled: true,
            useHTML: true,
            layout: 'horizontal',
            align: 'right',
            verticalAlign: 'top',
            itemMarginTop: 0
          },
          tooltip: {
            useHTML: true,
            shared: true
          },
          exporting: {
            enabled: false
            //buttons:{
            //contextButton: {
            //enabled: true,
            //text: '',
            //symbol: undefined
            //}
            //customButton: {
            //text: 'Custom Button',
            //onclick: function () {
            //this.setTitle({text: 'Miel'});
            //}
            //},
            //anotherButton: {
            //text: 'Another Button',
            //onclick: function () {
            //alert('You pressed another button!');
            //}
            //}
            //}
          }
        });

        $(function () {
          var span = $('h1').find('span');
          $('h1').html('Relative biomass of ' + cname + ' ('+sciname.italics()+') in ' + area);
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
              chart.series[0].update({showInLegend: true,enableMouseTracking: true}),
              chart.series[0].update({dashStyle: 'Dash'}, false);
              chart.series[1].setData(catch_json);
              chart.series[1].update({name:'Catch'}, false);
              chart.series[1].update({showInLegend: true,enableMouseTracking: true}),
              //chart.get('upperandlower').setData(msy_arearange);
              //chart.get('upperandlower').update({name:'Upper and Lower CMSY'}, false);
              //chart.series[2].setData(msy_arearange);
              //chart.series[2].update({name:'Upper and Lower CMSY'}, false);
              chart.yAxis[0].axisTitle.attr({useHTML: true, text: 'Catch (t * 10<sup>3</sup>)'});
              chart.yAxis[1].update({title: {text: null}});
              //chart.addSeries({name: 'Catches', type: 'line',data:catch_json,marker: {enabled: false},color: '#20639B'});
              chart.addSeries({id: 'upperandlowermsy', name: 'Conf. interval', type: 'arearange', data: msy_arearange, lineWidth: 0, linkedTo: ':previous', fillOpacity: 0.3, zIndex: 0, color: '#D3D3D3', marker: { enabled: false }}, false);

              if (chart.get('catch') && chart.get('msyline') && chart.get('fmsyline') && chart.get('upperandlowermsy')){
                chart.get('catch').remove(false);
                chart.get('upperandlowermsy').remove(false);
                chart.get('msyline').remove(false);
                chart.get('fmsyline').remove(false);
              }
              if (chart.get('upperandlowerbmsy')){
                chart.get('upperandlowerbmsy').remove(false);
              }
              if (chart.get('upperandlowerfmsy')){
                chart.get('upperandlowerfmsy').remove(false);
              }
              //if (chart.get('bmsywindowline')){
                //chart.get('bmsywindowline').remove(false);
              //}
              chart.redraw();

              var span = $('h1').find('span')
              $('h1').html('Catch of ' + cname + ' ('+sciname.italics() +') in ' + area);
              $('h1').append(span);

            break;
            case "BMSY":
              var chart = $('#msycontainer').highcharts();
              bmsy_arearange = [];
              bmsy_catch_json = [];
              bmsy_json = [];

              for (i = 0; i < msy.length; i++){
                bmsy_arearange.push([msy[i][0],msy[i][8],msy[i][9]]);
                bmsy_catch_json.push([msy[i][0],msy[i][6]]);
                bmsy_json.push([msy[i][0],msy[i][5]]);
                //if (msy[i][15] && msy[i][16]){
                  //bmsy_windowline.push({ x:msy[i][0], low:msy[i][15], high:msy[i][16], color:'black'});
                //}
              }
              chart.series[0].setData(bmsy_catch_json);
              chart.series[0].update({name:'B/B<sub>MSY</sub>'}, false);
              chart.series[0].update({showInLegend: false,enableMouseTracking: false}),
              chart.series[0].update({dashStyle: 'ShortDot'}, false);
              chart.series[1].setData(bmsy_json);
              chart.series[1].update({name:'Relative biomass'}, false);
              chart.series[1].update({showInLegend: false,enableMouseTracking: true}),
//              chart.series[2].update({name:'Conf. interval'}, false);
//              chart.series[2].setData(bmsy_arearange);
              chart.yAxis[0].axisTitle.attr({text: 'Biomass (t * 10<sup>3</sup>)'});
              chart.yAxis[1].update({title: {text: null}});

              if (!chart.get('upperandlowerbmsy')){
                chart.addSeries({id: 'upperandlowerbmsy', name: 'Conf. interval', type: 'arearange', data: bmsy_arearange, lineWidth: 0, linkedTo: ':previous', fillOpacity: 0.3, zIndex: 0, color: '#b2dcff', marker: { enabled: false }}, false);
              } else {
                chart.series[2].update({name:'Conf. interval'}, false);
                chart.series[2].setData(bmsy_arearange);
              }

              //if (!chart.get('bmsywindowline')){
                //chart.addSeries({id:'bmsywindowline', type:'columnrange',pointWidth: 2,enableMouseTracking: false, showInLegend: false,data: bmsy_windowline}, false);
              //}

              if (chart.get('catch') && chart.get('msyline') && chart.get('fmsyline')){
                chart.get('catch').remove(false);
                chart.get('msyline').remove(false);
                chart.get('fmsyline').remove(false);
              }
              if (chart.get('upperandlowermsy')){
                chart.get('upperandlowermsy').remove(false);
              }
              if (chart.get('upperandlowerfmsy')){
                chart.get('upperandlowerfmsy').remove(false);
              }

              chart.redraw();

              var span2 = $('h1').find('span')
              $('h1').html('Relative biomass of ' + cname + ' ('+sciname.italics() +') in ' + area);
              $('h1').append(span2);
            break;
            case "FMSY":
              var chart = $('#msycontainer').highcharts();
              fmsy_arearange = [];
              fmsy_catch_json = [];
              fmsy_json = [];
              for (i = 0; i < msy.length; i++){
                fmsy_arearange.push([msy[i][0],msy[i][12],msy[i][13]]);
                fmsy_catch_json.push([msy[i][0],msy[i][11]]);
                fmsy_json.push([msy[i][0],msy[i][10]]);
              }
              chart.series[0].setData(fmsy_catch_json);
              chart.series[0].update({name:'F/F<sub>MSY</sub>'}, false);
              chart.series[0].update({showInLegend: false,enableMouseTracking: false}),
              chart.series[0].update({dashStyle: 'ShortDot'}, false);
              chart.series[1].setData(fmsy_json);
              chart.series[1].update({name:'F/F<sub>MSY</sub>'}, false);
              chart.series[1].update({showInLegend: false,enableMouseTracking: true}),
//              chart.series[2].update({name:'Conf. interval'}, false);
//              chart.series[2].setData(fmsy_arearange);
              chart.yAxis[0].axisTitle.attr({text: 'Exploitation rate (F/F<sub>MSY</sub>)'});
              chart.yAxis[1].update({title: {text: null}});

              if (!chart.get('upperandlowerfmsy')){
                chart.addSeries({id: 'upperandlowerfmsy', name: 'Conf. interval', type: 'arearange', data: fmsy_arearange, lineWidth: 0, linkedTo: ':previous', fillOpacity: 0.3, zIndex: 0, color: '#b2dcff', marker: { enabled: false }}, false);
              } else {
                chart.get('upperandlowerfmsy').update({name:'Conf. interval', color: '#b2dcff'}, false);
                chart.get('upperandlowerfmsy').setData(fmsy_arearange);
              }

              //chart.series[2].setData();
              if (chart.get('catch') && chart.get('msyline') && chart.get('fmsyline')){
                chart.get('catch').remove(false);
                chart.get('msyline').remove(false);
                chart.get('fmsyline').remove(false);
              }
              if (chart.get('upperandlowermsy')){
                chart.get('upperandlowermsy').remove(false);
              }
              if (chart.get('upperandlowerbmsy')){
                chart.get('upperandlowerbmsy').remove(false);
              }
              //if (chart.get('bmsywindowline')){
                //chart.get('bmsywindowline').remove(false);
              //}
              chart.redraw();

              var span3 = $('h1').find('span')
              $('h1').html('Exploitation rate of ' + cname + ' ('+sciname.italics() +') in ' + area);
              $('h1').append(span3);

            break;
            case "ALL":
              var chart = $('#msycontainer').highcharts();
              msy_arearange = [];
              msy_catch_json = [];
              catch_json = [];
              bmsy_arearange = [];
              bmsy_catch_json = [];
              bmsy_json = [];
              fmsy_arearange = [];
              fmsy_catch_json = [];
              fmsy_json = [];
              for (i = 0; i < msy.length; i++){
                msy_arearange.push([msy[i][0],msy[i][3],msy[i][4]]);
                msy_catch_json.push([msy[i][0],msy[i][2]]);
                catch_json.push([msy[i][0],msy[i][1]]);
                bmsy_arearange.push([msy[i][0],msy[i][8],msy[i][9]]);
                bmsy_json.push([msy[i][0],msy[i][5]]);
                bmsy_catch_json.push([msy[i][0],msy[i][6]]);
                fmsy_arearange.push([msy[i][0],msy[i][12],msy[i][13]]);
                fmsy_catch_json.push([msy[i][0],msy[i][11]]);
                fmsy_json.push([msy[i][0],msy[i][10]]);
              }
              chart.series[0].setData(bmsy_catch_json);
              chart.series[0].update({name:'BMSY'}, false);
              chart.series[0].update({showInLegend: false,enableMouseTracking: false});
              chart.series[0].update({dashStyle: 'ShortDot'}, false);
              chart.yAxis[0].axisTitle.attr({text: ''});
              chart.yAxis[1].update({title: {text: 'Catch (t * 10<sup>3</sup>)'}});
              chart.series[1].setData(bmsy_json);
              chart.series[1].update({name:'Relative biomass'}, false);
              chart.series[1].update({showInLegend: true,enableMouseTracking: true});
              //chart.series[2].update({name:'Conf. interval BMSY',color: '#b2dcff'}, false);
              //chart.series[2].setData(bmsy_arearange);

              //if (!chart.get('halfbmsy')){
              //chart.addSeries({id: 'halfbmsy',name: 'Half BMSY', dashStyle: 'ShortDot', showInLegend: false,enableMouseTracking: false, data: halfbmsy_catch_json ,marker: {enabled: false}, color: '#ff0000'}, true);
              //}

              if (!chart.get('upperandlowerbmsy')){
                chart.addSeries({id: 'upperandlowerbmsy', name: 'Conf. interval BMSY', type: 'arearange', data: bmsy_arearange, lineWidth: 0, linkedTo: ':previous', fillOpacity: 0.3, zIndex: 0, color: '#b2dcff', marker: { enabled: false }}, false);
              } else {
                chart.get('upperandlowerbmsy').update({name: 'Conf. interval BMSY', type: 'arearange', data: bmsy_arearange, lineWidth: 0, linkedTo: ':previous', fillOpacity: 0.3, zIndex: 0, color: '#b2dcff', marker: { enabled: false }}, false);
              }

              chart.addSeries({id: 'catch', yAxis: 1, name: 'Catch', type: 'line', data: catch_json,marker: {enabled: false},color: '#000000'}, false);

              if (chart.get('upperandlowermsy')){
                chart.get('upperandlowermsy').remove(false);
              }

              //if (chart.get('bmsywindowline')){
                //chart.get('bmsywindowline').remove(false);
              //}

              if (!chart.get('upperandlowermsy')){
                chart.addSeries({id: 'upperandlowermsy', yAxis: 1, name: 'Conf. interval MSY', type: 'arearange', data: msy_arearange, lineWidth: 0, linkedTo: ':previous', fillOpacity: 0.3, zIndex: 0, color: '#D3D3D3', marker: { enabled: false }}, false);
              }

              chart.addSeries({id: 'msyline', yAxis: 1, name: 'MSY', dashStyle: 'Dash', data: msy_catch_json ,marker: {enabled: false}, color: '#000000'}, true);

              chart.addSeries({id: 'fmsyline',name: 'F/F<sub>MSY</sub>', type: 'line', data: fmsy_json ,marker: {enabled: false}, color: '#808080'}, true);

              if (!chart.get('upperandlowerfmsy')){
                chart.addSeries({id: 'upperandlowerfmsy', name: 'Conf. interval FMSY', type: 'arearange', data: fmsy_arearange, lineWidth: 0, linkedTo: ':previous', fillOpacity: 0.3, zIndex: 0, color: '#D3D3D3', marker: { enabled: false }}, false);
              } else {
                chart.get('upperandlowerfmsy').update({name: 'Conf. interval FMSY', type: 'arearange', data: fmsy_arearange, lineWidth: 0, linkedTo: ':previous', fillOpacity: 0.3, zIndex: 0, color: '#D3D3D3', marker: { enabled: false }}, false);
              }

              chart.redraw();
              var span4 = $('h1').find('span')
              $('h1').html('Biomass, Catch and Exploitation rate of ' + cname + ' ('+sciname.italics() +') in ' + area);
              $('h1').append(span4);
            break;
            default:
              //code
            break;
          }
        });

        //var tdata_score = "";
        //var year_tab = "";
        //for (var i = 0; i < msy.length; i++){
        //  switch (true){
        //    case (msy[i][17] > '0' && msy[i][17] <= '0.25'): tdata_score += "<td bgcolor='#009DF1'></td>"; break
        //    case (msy[i][17] > '0.26' && msy[i][17] <= '0.5'): tdata_score += "<td bgcolor='#008BD5'></td>"; break
        //    case (msy[i][17] > '0.51' && msy[i][17] <= '0.75'): tdata_score += "<td bgcolor='#6ECBFD'></td>"; break
        //    case (msy[i][17] > '0.76' && msy[i][17] <= '1'): tdata_score += "<td bgcolor='#3EBBFE'></td>"; break
        //    case (msy[i][17] > '1.01' && msy[i][17] <= '1.25'): tdata_score += "<td bgcolor='#99FEEF'></td>"; break
        //    case (msy[i][17] > '1.26' && msy[i][17] <= '1.5'): tdata_score += "<td bgcolor='#5AFCE4'></td>"; break
        //    case (msy[i][17] > '1.51' && msy[i][17] <= '1.75'): tdata_score += "<td bgcolor='#EDFEE4'></td>"; break
        //    case (msy[i][17] > '1.76' && msy[i][17] <= '2'): tdata_score += "<td bgcolor='#AFFE87'></td>"; break
        //    case (msy[i][17] > '2.01' && msy[i][17] <= '2.25'): tdata_score += "<td bgcolor='#F7FF96'></td>"; break
        //    case (msy[i][17] > '2.26' && msy[i][17] <= '2.5'): tdata_score += "<td bgcolor='#EDFB44'></td>"; break
        //    case (msy[i][17] > '2.51' && msy[i][17] <= '2.75'): tdata_score += "<td bgcolor='#FFE58B'></td>"; break
        //    case (msy[i][17] > '2.76' && msy[i][17] <= '3'): tdata_score += "<td bgcolor='#FFC703'></td>"; break
        //    case (msy[i][17] > '3.01' && msy[i][17] <= '3.25'): tdata_score += "<td bgcolor='#FFA25E'></td>"; break
        //    case (msy[i][17] > '3.26' && msy[i][17] <= '3.5'): tdata_score += "<td bgcolor='#FF720B'></td>"; break
        //    case (msy[i][17] > '3.51' && msy[i][17] <= '3.75'): tdata_score += "<td bgcolor='#FF6C6B'></td>"; break
        //    case (msy[i][17] > '3.76' && msy[i][17] <= '4'): tdata_score += "<td bgcolor='#FE0100'></td>"; break
        //  }
        //  if (i % 10 == 0){
        //    year_tab += "<td colspan='10'>" + msy[i][0] + "</td>";
        //  }
        //}
        //
        //var tab_score = "<table><tr>" + tdata_score + "</tr><tr>"+year_tab+"</tr></table>"
        //$(function () {
        //  var span = $('table').find('span');
        //  $('table').html(tab_score);
        //  $('table').append(span);
        //});

      });
    });
  });