  angular.module('sauWebApp').controller('MsyCtrl',
  function ($scope, $location, $window, sauAPI, $routeParams) {
    $(function () {
      var msy_arearange = new Array();
      var catch_json = new Array();
      var msy_catch_json = new Array();

      var bmsy_json = new Array();
      var bmsy_arearange = new Array();
      var bmsy_catch_json = new Array();
      var bmsy_cpue = new Array();
      //var bmsy_windowline = new Array();

      var fmsy_json = new Array();
      var fmsy_arearange = new Array();
      var fmsy_catch_json = new Array();
      var fmsy_cpue = new Array();

      var ref_data = new Array();

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
          bmsy_cpue.push([msy[i][0],msy[i][14]]);
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
              text: '',
              style: {
                fontSize: '18px'
              }
            },
            lineWidth: 1,
            lineColor: '#000000',
            startOnTick:true,
            pointStart: 1950,
            pointEnd: 2014,
            minPadding:0,
            tickInterval: 10,
            style: {
              fontFamily: 'Arial'
            }
          },
          yAxis: [{
            title: {
              useHTML: true,
              //text: 'Relative biomass (B/B<sub>MSY</sub>)',
              text: 'Biomass (t x 1000)',
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
          {
            opposite: true,
            offset: -9,
            title: {
              useHTML: true,
              text: '',
              style: {
                fontSize: '18px'
              }
            },
            labels: {
              format: '{value:.1f}'
            },
            gridLineWidth: 0,
            tickInterval: 0.5,
            min: 0,
            lineWidth: 0,
            lineColor: '#000000',
            tickWidth: 1
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
              name: 'Biomass',
              showInLegend: false,
              type: 'line',
              data: bmsy_json,
              marker: {
                enabled: false
              },
              color: '#20639B',
            },
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
            },
            {
              id: 'bcpue',
              name: 'Biomass CPUE',
              showInLegend: false,
              enableMouseTracking: false,
              data: bmsy_cpue,
              color: 'red',
              type: 'scatter',
              marker: {
                symbol: 'circle'
              },
            }
              //},
            //{
              //id: 'bmsywindowline',
              //type:'columnrange',
              //pointWidth: 2,
              //enableMouseTracking: false,
              //showInLegend: false,
              //data: bmsy_windowline
//            }
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
            itemMarginTop: 0,
            itemStyle: {
              fontSize:'15px'
            }
          },
          tooltip: {
            useHTML: true,
            shared: true
          },
          exporting: {
            enabled: false
          }
        });

    $.getJSON(sauAPI.apiURL + 'msy/ref/' + $routeParams.ids, function(data) {
        var ref_cmsy = data.data[0].data;
        for (var i = 0; i < ref_cmsy.length; i++){
          ref_data.push([ref_cmsy[i][0]]);
        }
    });


        $(function () {
          var span = $('h1').find('span');
          $('h1').html('Biomass of ' + cname + ' ('+sciname.italics()+') in ' + area);
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
              chart.series[0].update({dashStyle: 'ShortDash'}, false);
              chart.series[1].setData(catch_json);
              chart.series[1].update({name:'Catch', color: '#20639B'}, false);
              chart.series[1].update({showInLegend: true,enableMouseTracking: true}),
              //chart.get('upperandlower').setData(msy_arearange);
              //chart.get('upperandlower').update({name:'Upper and Lower CMSY'}, false);
              //chart.series[2].setData(msy_arearange);
              //chart.series[2].update({name:'Upper and Lower CMSY'}, false);
              chart.yAxis[0].update({labels: {allowDecimals: false, format: '{value:.f}'}});
              chart.yAxis[0].axisTitle.attr({useHTML: true, text: 'Catch (t x 1000)'});
              chart.yAxis[1].update({title: {text: null}, lineWidth: 0});
              //chart.addSeries({name: 'Catches', type: 'line',data:catch_json,marker: {enabled: false},color: '#20639B'});
              chart.addSeries({id: 'upperandlowermsy', name: 'Conf. interval', type: 'arearange', data: msy_arearange, lineWidth: 0, fillOpacity: 0.3, showInLegend: false, zIndex: 0, color: '#D3D3D3', marker: { enabled: false }}, false);

              if (chart.get('catch') && chart.get('msyline') && chart.get('fmsyline') && chart.get('upperandlowermsy')){
                chart.get('catch').remove(false);
                chart.get('upperandlowermsy').remove(false);
                chart.get('msyline').remove(false);
                chart.get('fmsyline').remove(false);
                chart.get('fmsycatchline').remove(false);
              }
              if (chart.get('upperandlowerbmsy')){
                chart.get('upperandlowerbmsy').remove(false);
              }
              if (chart.get('upperandlowerfmsy')){
                chart.get('upperandlowerfmsy').remove(false);
              }
              if (chart.get('bcpue')){
                chart.get('bcpue').remove(false);
              }
              if (chart.get('fcpue')){
                chart.get('fcpue').remove(false);
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
              bmsy_cpue = [];

              for (i = 0; i < msy.length; i++){
                bmsy_arearange.push([msy[i][0],msy[i][8],msy[i][9]]);
                bmsy_catch_json.push([msy[i][0],msy[i][6]]);
                bmsy_json.push([msy[i][0],msy[i][5]]);
                bmsy_cpue.push([msy[i][0],msy[i][14]]);
                //if (msy[i][15] && msy[i][16]){
                //bmsy_windowline.push({ x:msy[i][0], low:msy[i][15], high:msy[i][16], color:'black'});
                //}
              }
              chart.series[0].setData(bmsy_catch_json);
              chart.series[0].update({name:'B/B<sub>MSY</sub>'}, false);
              chart.series[0].update({showInLegend: false,enableMouseTracking: false}),
              chart.series[0].update({dashStyle: 'ShortDot'}, false);
              chart.series[1].setData(bmsy_json);
              chart.series[1].update({name:'Biomass', color: '#20639B'}, false);
              chart.series[1].update({showInLegend: false,enableMouseTracking: true}),
//              chart.series[2].update({name:'Conf. interval'}, false);
//              chart.series[2].setData(bmsy_arearange);
              chart.yAxis[0].update({labels: {allowDecimals: false, format: '{value:.f}'}});
              chart.yAxis[0].axisTitle.attr({text: 'Biomass (t x 1000)'});
              chart.yAxis[1].update({title: {text: null}, lineWidth: 0});

              if (!chart.get('upperandlowerbmsy')){
                chart.addSeries({id: 'upperandlowerbmsy', name: 'Conf. interval', type: 'arearange', data: bmsy_arearange, lineWidth: 0, linkedTo: ':previous', fillOpacity: 0.3, zIndex: 0, color: '#b2dcff', marker: { enabled: false }}, false);
              } else {
                chart.series[2].update({name:'Conf. interval'}, false);
                chart.series[2].setData(bmsy_arearange);
              }

              if (!chart.get('bcpue')){
                chart.addSeries({id: 'bcpue',name: 'Biomass CPUE', showInLegend: false, enableMouseTracking: false, data: bmsy_cpue, color: 'red',type: 'scatter', marker: { symbol: 'circle'}}, false);
              } else {
                chart.get('bcpue').update({name:'Biomass CPUE'}, false);
                chart.get('bcpue').setData(bmsy_cpue);
              }

              //if (!chart.get('bmsywindowline')){
              //chart.addSeries({id:'bmsywindowline', type:'columnrange',pointWidth: 2,enableMouseTracking: false, showInLegend: false,data: bmsy_windowline}, false);
              //}

              if (chart.get('catch') && chart.get('msyline') && chart.get('fmsyline')){
                chart.get('catch').remove(false);
                chart.get('msyline').remove(false);
                chart.get('fmsyline').remove(false);
                chart.get('fmsycatchline').remove(false);
              }
              if (chart.get('upperandlowermsy')){
                chart.get('upperandlowermsy').remove(false);
              }
              if (chart.get('upperandlowerfmsy')){
                chart.get('upperandlowerfmsy').remove(false);
              }
              if (chart.get('fcpue')){
                chart.get('fcpue').remove(false);
              }

              chart.redraw();

              var span2 = $('h1').find('span')
              $('h1').html('Biomass of ' + cname + ' ('+sciname.italics() +') in ' + area);
              $('h1').append(span2);
            break;
            case "FMSY":
              var chart = $('#msycontainer').highcharts();
              fmsy_arearange = [];
              fmsy_catch_json = [];
              fmsy_json = [];
              fmsy_cpue = [];
              for (i = 0; i < msy.length; i++){
                fmsy_arearange.push([msy[i][0],msy[i][12],msy[i][13]]);
                fmsy_catch_json.push([msy[i][0],msy[i][11]]);
                fmsy_json.push([msy[i][0],msy[i][10]]);
                fmsy_cpue.push([msy[i][0],msy[i][17]]);
              }
              chart.series[0].setData(fmsy_catch_json);
              chart.series[0].update({name:'FMSY'}, false);
              chart.series[0].update({showInLegend: false,enableMouseTracking: false}),
              chart.series[0].update({dashStyle: 'ShortDot'}, false);
              chart.series[1].setData(fmsy_json);
              chart.series[1].update({name:'F/F<sub>MSY</sub>', color: '#1F9139'}, false);
              chart.series[1].update({showInLegend: false,enableMouseTracking: true}),
              chart.yAxis[0].update({labels: {allowDecimals: true, format: '{value:.1f}'}});
              chart.yAxis[0].axisTitle.attr({text: 'Exploitation rate (F/F<sub>MSY</sub>)'});
              chart.yAxis[1].update({title: {text: null}, lineWidth: 0, });

              if (chart.get('upperandlowerfmsy')){
                chart.get('upperandlowerfmsy').remove(false);
              }

              if (!chart.get('upperandlowerfmsy')){
                chart.addSeries({id: 'upperandlowerfmsy', name: 'Conf. interval', type: 'arearange', data: fmsy_arearange, lineWidth: 0, linkedTo: ':previous', fillOpacity: 0.3, zIndex: 0, color: '#67D781', marker: { enabled: false }}, false);
              } else {
                chart.get('upperandlowerfmsy').update({name:'Conf. interval', color: '#67D781'}, false);
                chart.get('upperandlowerfmsy').setData(fmsy_arearange);
              }

              if (!chart.get('fcpue')){
                chart.addSeries({id: 'fcpue',name: 'Exploitation CPUE', showInLegend: false, enableMouseTracking: false, data: fmsy_cpue, color: 'red',type: 'scatter', marker: { symbol: 'circle'}}, false);
              } else {
                chart.get('fcpue').update({name:'Exploitation CPUE'}, false);
                chart.get('fcpue').setData(fmsy_cpue);
              }

              if (chart.get('catch') && chart.get('msyline') && chart.get('fmsyline')){
                chart.get('catch').remove(false);
                chart.get('msyline').remove(false);
                chart.get('fmsyline').remove(false);
                chart.get('fmsycatchline').remove(false);
              }
              if (chart.get('upperandlowermsy')){
                chart.get('upperandlowermsy').remove(false);
              }
              if (chart.get('upperandlowerbmsy')){
                chart.get('upperandlowerbmsy').remove(false);
              }
              if (chart.get('bcpue')){
                chart.get('bcpue').remove(false);
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
              chart.series[0].update({name:'B<sub>MSY</sub>'}, false);
              chart.series[0].update({showInLegend: true,enableMouseTracking: false});
              chart.series[0].update({dashStyle: 'ShortDot'}, false);
              chart.yAxis[0].update({labels: {allowDecimals: false, format: '{value:.f}'}});
              chart.yAxis[0].axisTitle.attr({text: 'Biomass and Catch (t x 1000)'});
              chart.yAxis[1].update({title: {text: 'Exploitation rate (F/F<sub>MSY</sub>)',rotation:'-90'}, lineWidth: 1});
              chart.series[1].setData(bmsy_json);
              chart.series[1].update({name:'Biomass', color: '#20639B'}, false);
              chart.series[1].update({showInLegend: true,enableMouseTracking: true});
              //chart.series[2].update({name:'Conf. interval BMSY',color: '#b2dcff'}, false);
              //chart.series[2].setData(bmsy_arearange);

              //if (!chart.get('halfbmsy')){
              //chart.addSeries({id: 'halfbmsy',name: 'Half BMSY', dashStyle: 'ShortDot', showInLegend: false,enableMouseTracking: false, data: halfbmsy_catch_json ,marker: {enabled: false}, color: '#ff0000'}, true);
              //}

              if (!chart.get('upperandlowerbmsy')){
                chart.addSeries({id: 'upperandlowerbmsy', name: 'Conf. interval BMSY', type: 'arearange', data: bmsy_arearange, lineWidth: 0, linkedTo: ':previous', fillOpacity: 0.3, zIndex: 0, color: '#85C7F9', marker: { enabled: false }}, false);
              } else {
                chart.get('upperandlowerbmsy').update({name: 'Conf. interval BMSY', type: 'arearange', data: bmsy_arearange, lineWidth: 0, linkedTo: ':previous', fillOpacity: 0.3, zIndex: 0, color: '#85C7F9', marker: { enabled: false }}, false);
              }

              chart.addSeries({id: 'catch', name: 'Catch', type: 'line', data: catch_json,marker: {enabled: false},color: '#000000'}, false);

              if (chart.get('upperandlowermsy')){
                chart.get('upperandlowermsy').remove(false);
              }
              if (chart.get('bcpue')){
                chart.get('bcpue').remove(false);
              }
              if (chart.get('fcpue')){
                chart.get('fcpue').remove(false);
              }

              //if (chart.get('bmsywindowline')){
              //chart.get('bmsywindowline').remove(false);
              //}

              chart.addSeries({id: 'msyline', name: 'MSY', dashStyle: 'ShortDash', data: msy_catch_json ,marker: {enabled: false}, color: '#000000'}, true);

              if (!chart.get('upperandlowermsy')){
                chart.addSeries({id: 'upperandlowermsy', name: 'Conf. interval MSY', type: 'arearange', data: msy_arearange, lineWidth: 0, linkedTo: ':previous', fillOpacity: 0.3, zIndex: 0, color: '#D3D3D3', marker: { enabled: false }}, false);
              }

              chart.addSeries({id: 'fmsyline', yAxis: 1, name: 'F/F<sub>MSY</sub>', type: 'line', data: fmsy_json ,marker: {enabled: false}, color: '#1F9139'}, true);

              if (!chart.get('upperandlowerfmsy')){
                chart.addSeries({id: 'upperandlowerfmsy', yAxis: 1, name: 'Conf. interval FMSY', type: 'arearange', data: fmsy_arearange, lineWidth: 0, linkedTo: ':previous', fillOpacity: 0.3, zIndex: 0, color: '#67D781', marker: { enabled: false }}, false);
              } else {
                chart.get('upperandlowerfmsy').update({ yAxis: 1, name: 'Conf. interval FMSY', type: 'arearange', data: fmsy_arearange, lineWidth: 0, linkedTo: ':previous', fillOpacity: 0.3, zIndex: 0, color: '#67D781', marker: { enabled: false }}, false);
              }

              chart.addSeries({id: 'fmsycatchline', yAxis: 1, name: 'F<sub>MSY</sub>', dashStyle: 'ShortDot', data: fmsy_catch_json ,marker: {enabled: false}, color: '#A4A8A5'}, true);

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

        var tdata_score = "";
        var year_tab = "";
        var rounded;
        for (var i = 0; i < msy.length; i++){
        rounded = msy[i][20];
        switch (true){
        //case (msy[i][20] > '0' && msy[i][20] <= '0.25'): tdata_score += "<td bgcolor='#009DF1'></td>"; break
        //case (msy[i][20] > '0.26' && msy[i][20] <= '0.5'): tdata_score += "<td bgcolor='#008BD5'></td>"; break
        //case (msy[i][20] > '0.51' && msy[i][20] <= '0.75'): tdata_score += "<td bgcolor='#6ECBFD'></td>"; break
        //case (msy[i][20] > '0.76' && msy[i][20] <= '1'): tdata_score += "<td bgcolor='#3EBBFE'></td>"; break
        //case (msy[i][20] > '1.01' && msy[i][20] <= '1.25'): tdata_score += "<td bgcolor='#99FEEF'></td>"; break
        //case (msy[i][20] > '1.26' && msy[i][20] <= '1.5'): tdata_score += "<td bgcolor='#5AFCE4'></td>"; break
        //case (msy[i][20] > '1.51' && msy[i][20] <= '1.75'): tdata_score += "<td bgcolor='#EDFEE4'></td>"; break
        //case (msy[i][20] > '1.76' && msy[i][20] <= '2'): tdata_score += "<td bgcolor='#AFFE87'></td>"; break
        //case (msy[i][20] > '2.01' && msy[i][20] <= '2.25'): tdata_score += "<td bgcolor='#F7FF96'></td>"; break
        //case (msy[i][20] > '2.26' && msy[i][20] <= '2.5'): tdata_score += "<td bgcolor='#EDFB44'></td>"; break
        //case (msy[i][20] > '2.51' && msy[i][20] <= '2.75'): tdata_score += "<td bgcolor='#FFE58B'></td>"; break
        //case (msy[i][20] > '2.76' && msy[i][20] <= '3'): tdata_score += "<td bgcolor='#FFC703'></td>"; break
        //case (msy[i][20] > '3.01' && msy[i][20] <= '3.25'): tdata_score += "<td bgcolor='#FFA25E'></td>"; break
        //case (msy[i][20] > '3.26' && msy[i][20] <= '3.5'): tdata_score += "<td bgcolor='#FF720B'></td>"; break
        //case (msy[i][20] > '3.51' && msy[i][20] <= '3.75'): tdata_score += "<td bgcolor='#FE0100'></td>"; break
        //case (msy[i][20] > '3.76' && msy[i][20] <= '4'): tdata_score += "<td bgcolor='#FF6C6B'></td>"; break
          case (msy[i][20] > '0' && msy[i][20] <= '0.25'): if (i % 4 != 0) { tdata_score += "<td bgcolor ='#FE0100'></td>"; } else { tdata_score += "<td bgcolor ='#FE0100'>" +rounded +"</td>";} break
          case (msy[i][20] >= '0.26' && msy[i][20] <= '0.5'): if (i % 4 != 0) { tdata_score += "<td bgcolor ='#FF6C6B'></td>";} else {tdata_score += "<td bgcolor ='#FF6C6B'>" + rounded +"</td>";} break
          case (msy[i][20] >= '0.51' && msy[i][20] <= '0.75'): if (i % 4 != 0) { tdata_score += "<td bgcolor ='#FF720B'></td>";} else {tdata_score += "<td bgcolor ='#FF720B'>" + rounded +"</td>";} break
          case (msy[i][20] >= '0.76' && msy[i][20] <= '1'): if (i % 4 != 0) { tdata_score += "<td bgcolor ='#FFA25E'></td>";} else {tdata_score += "<td bgcolor ='#FFA25E'>" + rounded +"</td>";} break
          case (msy[i][20] >= '1.01' && msy[i][20] <= '1.25'): if (i % 4 != 0) { tdata_score += "<td bgcolor ='#FFC703'></td>";} else {tdata_score += "<td bgcolor ='#FFC703'>" + rounded +"</td>";} break
          case (msy[i][20] >= '1.26' && msy[i][20] <= '1.5'): if (i % 4 != 0) { tdata_score += "<td bgcolor ='#FFE58B'></td>";} else {tdata_score += "<td bgcolor ='#FFE58B'>" + rounded +"</td>";} break
          case (msy[i][20] >= '1.51' && msy[i][20] <= '1.75'): if (i % 4 != 0) { tdata_score += "<td bgcolor ='#EDFB44'></td>";} else {tdata_score += "<td bgcolor ='#EDFB44'>" + rounded +"</td>";} break
          case (msy[i][20] >= '1.76' && msy[i][20] <= '2'): if (i % 4 != 0) { tdata_score += "<td bgcolor ='#F7FF96'></td>";} else {tdata_score += "<td bgcolor ='#F7FF96'>" + rounded +"</td>";} break
          case (msy[i][20] >= '2.01' && msy[i][20] <= '2.25'): if (i % 4 != 0) { tdata_score += "<td bgcolor ='#AFFE87'></td>";} else {tdata_score += "<td bgcolor ='#AFFE87'>" + rounded +"</td>";} break
          case (msy[i][20] >= '2.26' && msy[i][20] <= '2.5'): if (i % 4 != 0) { tdata_score += "<td bgcolor ='#EDFEE4'></td>";} else {tdata_score += "<td bgcolor ='#EDFEE4'>" +rounded +"</td>";} break
          case (msy[i][20] >= '2.51' && msy[i][20] <= '2.75'): if (i % 4 != 0) { tdata_score += "<td bgcolor ='#5AFCE4'></td>";} else {tdata_score += "<td bgcolor ='#5AFCE4'>" + rounded +"</td>";} break
          case (msy[i][20] >= '2.76' && msy[i][20] <= '3'): if (i % 4 != 0) { tdata_score += "<td bgcolor ='#99FEEF'></td>";} else {tdata_score += "<td bgcolor ='#99FEEF'>" +rounded +"</td>";} break
          case (msy[i][20] >= '3.01' && msy[i][20] <= '3.25'): if (i % 4 != 0) { tdata_score += "<td bgcolor ='#6ECBFD'></td>";} else {tdata_score += "<td bgcolor ='#6ECBFD'>" +rounded +"</td>";} break
          case (msy[i][20] >= '3.26' && msy[i][20] <= '3.5'): if (i % 4 != 0) { tdata_score += "<td bgcolor ='#3EBBFE'></td>";} else {tdata_score += "<td bgcolor ='#3EBBFE'>" + rounded +"</td>";} break
          case (msy[i][20] >= '3.51' && msy[i][20] <= '3.75'): if (i % 4 != 0) { tdata_score += "<td bgcolor ='#009DF1'></td>";} else {tdata_score += "<td bgcolor ='#009DF1'>" + rounded +"</td>";}break
          case (msy[i][20] >= '3.76' && msy[i][20] <= '4'): if (i % 4 != 0) { tdata_score += "<td bgcolor ='#008BD5'></td>";} else {tdata_score += "<td bgcolor ='#008BD5'>" + rounded +"</td>";} break
          default: tdata_score += "<td bgcolor ='#ffffff'>"+ ' '+"</td>"; break
        }
           if (i % 10 == 0){
             year_tab += "<td colspan='10'>" + msy[i][0] + "</td>";
            }
        }
        var tab_score = "<table><tr id ='color'>" + tdata_score + "</tr><tr>" + year_tab + "</tr></table>"
        $(function () {
          var span = $('table').find('span');
          $('table').html(tab_score);
          $('table').append(span);
        });
      });
    });
  });