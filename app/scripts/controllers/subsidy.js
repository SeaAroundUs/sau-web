'use strict';

angular.module('sauWebApp')
  .controller('SubsidyCtrl', function ($scope, $routeParams, sauAPI, externalURLs) {
    var geoID = $routeParams.id;

    $scope.citationURL = externalURLs.s3Root +
      'scientific-papers/reference/Fisheries_Subsidies_Citations.pdf';
    $scope.journalURL = externalURLs.s3Root +
      'scientific-papers/reference/MarineProtectedAreaCostsAsBeneficialFisheriesSubsidies.pdf';
    $scope.fullReportURL = externalURLs.s3Root +
      'scientific-papers/reference/SumailaPauly-Subsidies-2006-FCRR-146.pdf';

    sauAPI.Subsidies.get({geo_id: geoID}, function(resp) {
      $scope.data = resp.data;
      $scope.data.combined = [];

      $scope.eezPopover = resp.data.eezs.map(function(eez) {
        return '<a href="#/eez/' + eez.eez_id + '">EEZ Waters of ' + eez.name + '</a>';
      }).join('<br />');

      angular.forEach(['good', 'bad', 'ugly'], function(cat) {
        var i, figure, currentCat;
        var year2000 = resp.data['2000'][cat];
        var year2009 = resp.data['2009'][cat];

        $scope.data.combined.push({
          title: year2000.title,
          description: year2000.description,
          figures: []
        });

        currentCat = $scope.data.combined[$scope.data.combined.length - 1];

        for (i = 0; i < year2000.figures.length; i++) {
          figure = year2000.figures[i];
          if (figure.amount < 0) {
            figure.amount = '[' + Math.abs(figure.amount) + ']';
          }
          figure.year = 2003;
          currentCat.figures.push(figure);

          figure = year2009.figures[i];
          if (figure.amount < 0) {
            figure.amount = '[' + Math.abs(figure.amount) + ']';
          }
          figure.year = 2009;
          currentCat.figures.push(figure);
        }
      });
    });
  });
