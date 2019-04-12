  angular.module('sauWebApp').controller('MsyCtrl',
  function ($scope, $location, $window, sauAPI, $routeParams) {
    $(function () {
      var msy_arearange = new Array();
      var catch_json = new Array();
      var msy_catch_json = new Array();

      var bmsy_json = new Array();
      var bmsy_arearange = new Array();
      var bmsy_catch_json = new Array();
      var halfbmsy_catch_json = new Array();

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
          halfbmsy_catch_json.push([msy[i][0],msy[i][7]]);
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
          yAxis: [{
            title: {
              useHTML: true,
              text: 'Relative biomass (B/B<sub>MSY</sub>)',
            },
            labels: {
              format: '{value:.4f}'
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
               text: ''
            },
            labels: {
              format: '{value:.4f}'
            },
            gridLineWidth: 0,
            min: 0,
            lineWidth: 1,
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
              name: 'Conf. interval ',
              data: bmsy_arearange,
              type: 'arearange',
              lineWidth: 0,
              linkedTo: ':previous',
              fillOpacity: 0.3,
              zIndex: 0,
              color: '#D3D3D3',
              marker: {
                enabled: false
              }
            },
            {
              id: 'halfbmsy',
              name: 'Half BMSY',
              showInLegend: false,
              enableMouseTracking: false,
              dashStyle: 'ShortDot',
              data: halfbmsy_catch_json ,
              marker: {
                enabled: false
              },
              color: '#ff0000'
            }
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
              if (chart.get('halfbmsy')){
                chart.get('halfbmsy').remove(false);
              }
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
              }
              chart.series[0].setData(bmsy_catch_json);
              chart.series[0].update({name:'B/B<sub>MSY</sub>'}, false);
              chart.series[0].update({showInLegend: false,enableMouseTracking: false}),
              chart.series[0].update({dashStyle: 'ShortDot'}, false);
              chart.series[1].setData(bmsy_json);
              chart.series[1].update({name:'Relative biomass'}, false);
              chart.series[1].update({showInLegend: true,enableMouseTracking: true}),
              chart.series[2].update({name:'Conf. interval'}, false);
              chart.series[2].setData(bmsy_arearange);
              chart.yAxis[0].axisTitle.attr({text: 'Relative biomass (B/B<sub>MSY</sub>)'});
              chart.yAxis[1].update({title: {text: null}});

              if (chart.get('catch') && chart.get('msyline') && chart.get('fmsyline')){
                chart.get('catch').remove(false);
                chart.get('msyline').remove(false);
                chart.get('fmsyline').remove(false);
              }
              if (chart.get('upperandlowermsy')){
                chart.get('upperandlowermsy').remove(false);
              }
              if (!chart.get('halfbmsy')){
                chart.addSeries({id: 'halfbmsy',name: 'Half BMSY', dashStyle: 'ShortDot', showInLegend: false, enableMouseTracking: false, data: halfbmsy_catch_json ,marker: {enabled: false}, color: '#ff0000'}, true);
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
              chart.series[1].update({showInLegend: false,enableMouseTracking: false}),
              chart.series[2].update({name:'Conf. interval'}, false);
              chart.series[2].setData(fmsy_arearange);
              chart.yAxis[0].axisTitle.attr({text: 'Exploitation rate (F/F<sub>MSY</sub>)'});
              chart.yAxis[1].update({title: {text: null}});

              //chart.series[2].setData();
              if (chart.get('catch') && chart.get('msyline') && chart.get('fmsyline') && chart.get('upperandlowermsy')){
                chart.get('catch').remove(false);
                chart.get('upperandlowermsy').remove(false);
                chart.get('msyline').remove(false);
                chart.get('fmsyline').remove(false);
              }
              if (chart.get('upperandlowermsy')){
                chart.get('upperandlowermsy').remove(false);
              }
              if (chart.get('halfbmsy')){
                chart.get('halfbmsy').remove(false);
              }
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
              halfbmsy_catch_json = [];
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
                halfbmsy_catch_json.push([msy[i][0],msy[i][7]]);
                fmsy_arearange.push([msy[i][0],msy[i][12],msy[i][13]]);
                fmsy_catch_json.push([msy[i][0],msy[i][11]]);
                fmsy_json.push([msy[i][0],msy[i][10]]);
              }
              chart.series[0].setData(bmsy_catch_json);
              chart.series[0].update({name:'BMSY'}, false);
              chart.series[0].update({dashStyle: 'ShortDot'}, false);
              chart.yAxis[0].axisTitle.attr({text: ''});
              chart.yAxis[1].update({title: {text: 'Catch (t * 10<sup>3</sup>)'}});
              //chart.yAxis[1].axisTitle.attr({text: 'Relative biomass (B/B<sub>MSY</sub>)'});
              chart.series[1].setData(bmsy_json);
              chart.series[1].update({name:'Relative biomass'}, false);
              chart.series[1].update({showInLegend: true,enableMouseTracking: true}),
              chart.series[2].update({name:'Upper and Lower BMSY'}, false);
              chart.series[2].setData(bmsy_arearange);

              if (!chart.get('halfbmsy')){
                chart.addSeries({id: 'halfbmsy',name: 'Half BMSY', dashStyle: 'ShortDot', showInLegend: false,enableMouseTracking: false, data: halfbmsy_catch_json ,marker: {enabled: false}, color: '#ff0000'}, true);
              }
              chart.addSeries({id: 'catch', yAxis: 1, name: 'Relative catch', type: 'line', data: catch_json,marker: {enabled: false},color: '#000000'}, false);
              if (!chart.get('upperandlowermsy')){
                chart.addSeries({id: 'upperandlowermsy', yAxis: 1, name: 'Conf. interval', type: 'arearange', data: msy_arearange, lineWidth: 0, linkedTo: ':previous', fillOpacity: 0.3, zIndex: 0, color: '#D3D3D3', marker: { enabled: false }}, false);
              }
              chart.addSeries({id: 'msyline', yAxis: 1, name: 'MSY', dashStyle: 'Dash', data: msy_catch_json ,marker: {enabled: false}, color: '#000000'}, true);
              chart.addSeries({id: 'fmsyline',name: 'F/F<sub>MSY</sub>', type: 'line', data: fmsy_json ,marker: {enabled: false}, color: '#808080'}, true);

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

      });
    });
  });