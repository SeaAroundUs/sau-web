angular.module('sauWebApp').controller('MsyCtrl',
  function ($scope, $location, $window, sauAPI) {
$(function () {
    var msy_arearange = new Array();
    var catch_json = new Array();
    var msy_catch_json = new Array();

    var bmsy_arearange = new Array();
    var bmsy_catch_json = new Array();

    var fmsy_arearange = new Array();
    var fmsy_catch_json = new Array();
    $.getJSON(sauAPI.apiURL + 'msy/129', function(data) {
        // Populate series
        var msy = data.data[0].data;
        var sciname = data.data[0].scientific_name;
        for (i = 0; i < msy.length; i++){
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
                pointStart: 1950,
                tickInterval: 10
            },
            yAxis: {
                title: {
                    text: "Catch (t x 1000)"
                    }
            },
            tooltip: {
                crosshairs: true,
                shared: true
            },
            series: [{
                name: 'Catch',
                data: msy_catch_json,
                color: 'black',
                dashStyle: 'Dash',
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
				color: Highcharts.getOptions().colors[1],
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
		$span = $('h1').find('span')
		$('h1').text('Catch for ' + sciname);
		$('h1').append($span);
});
		$('#selCMSY').click(function() {
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
		chart.series[0].update({name:'Catch'}, false);
		chart.series[1].update({name:'Upper and Lower CMSY'}, false);
		chart.series[1].setData(msy_arearange);
		chart.series[2].setData(catch_json);
		chart.redraw();
		
		$span = $('h1').find('span')
		$('h1').text('Catch for ' + sciname);
		$('h1').append($span);
            });

		$('#selBMSY').click(function() {
        var chart = $('#msycontainer').highcharts();
		for (i = 0; i < msy.length; i++){
			bmsy_arearange.push([msy[i][0],msy[i][6],msy[i][7]]);
			bmsy_catch_json.push([msy[i][0],msy[i][5]]);
        }
		chart.series[0].setData(bmsy_catch_json);
		chart.series[1].setData(bmsy_arearange);
		chart.series[2].setData();
//		chart.series[2].remove();
		
		chart.series[0].update({name:'BMSY'}, false);
		chart.series[1].update({name:'Upper and Lower BMSY'}, false);
		chart.redraw();
		
		$span = $('h1').find('span')
		$('h1').text('BMSY for ' + sciname);
		$('h1').append($span);
		
            });
			
		$('#selFMSY').click(function() {
        var chart = $('#msycontainer').highcharts();
		for (i = 0; i < msy.length; i++){
			fmsy_arearange.push([msy[i][0],msy[i][9],msy[i][10]]);
			fmsy_catch_json.push([msy[i][0],msy[i][8]]);
        }
		chart.series[0].setData(fmsy_catch_json);
		chart.series[1].setData(fmsy_arearange);
		chart.series[2].setData();
//		chart.series[2].remove();
		
		chart.series[0].update({name:'FMSY'}, false);
		chart.series[1].update({name:'Upper and Lower FMSY'}, false);
		chart.redraw();
		
		$span = $('h1').find('span')
		$('h1').text('FMSY for ' + sciname);
		$('h1').append($span);
            });

    });
        });
		
		  });