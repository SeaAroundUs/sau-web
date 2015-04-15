'use strict';

angular.module('sauWebApp')
  .controller('SubsidyCtrl', function ($scope, $routeParams, sauAPI, externalURLs) {
    var regionID = $routeParams.id;

    $scope.citationURL = externalURLs.s3Root + 'scientific-papers/reference/Fisheries_Subsidies_Citations.pdf';
    $scope.journalURL = externalURLs.s3Root +
      '/scientific-papers/reference/MarineProtectedAreaCostsAsBeneficialFisheriesSubsidies.pdf';
    $scope.fullReportURL = '';

    sauAPI.CountryProfile.get({ region_id: regionID }, function(resp) {
      $scope.country = resp.data;
      $scope.country.subsidies = { '2003': {}, '2009': {} };

      sauAPI.Subsidies.get({ region_id: regionID, year: 2000 }, function(resp) {
        $scope.country.subsidies['2003'] = resp.data;
        $scope.country.subsidies.combined = resp.data;
        $scope.country.eezs = resp.data.eezs;

        $scope.eezPopover = $scope.country.eezs.map(function(eez) {
          return '<a href="#/eez/' + eez.id + '">EEZ Waters of ' + eez.title + '</a>';
        }).join('<br />');

        sauAPI.Subsidies.get({ region_id: regionID, year: 2009 }, function(resp) {
          var i, j, category, row, newCategory, otherRow;

          $scope.country.subsidies['2009'] = resp.data;

          for(i = 0; i < $scope.country.subsidies.combined.categories.length; i++) {
            category = $scope.country.subsidies.combined.categories[i];
            newCategory = {
              title: category.title,
              description: category.description,
              rows: []
            };

            for(j = 0; j < category.rows.length; j++) {
              row = category.rows[j];
              row.year = '2003';
              newCategory.rows.push(row);
              otherRow = $scope.country.subsidies['2009'].categories[i].rows[j];
              otherRow.year = '2009';
              newCategory.rows.push(otherRow);
            }

            $scope.country.subsidies.combined.categories[i] = newCategory;
          }
        });
      });
    });
  });
