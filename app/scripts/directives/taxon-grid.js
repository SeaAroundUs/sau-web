;(function() {

  'use strict';

  angular.module('sauWebApp')
    .directive('sauTaxonGrid', function (uiGridConstants, taxonLevels, sauAPI) {

      var controller = function($scope, $q, $filter) {

        $scope.model = {
          taxon_level: {},
          taxon_group: {},
        };

        $scope.selectRow = function(row) {
          angular.forEach(row.grid.rows, function(r) {
            r.isSelected = false;
          });
          row.isSelected = true;
          var taxon = sauAPI.Taxon.get({taxon_key: row.entity.taxon_key}, function() {
            $scope.taxon = taxon.data;
          });
        };

        function rowTemplate() {
            return '<div ng-click="grid.appScope.selectRow(row)" ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>';
        }

        $scope.gridOptions = {
          enableFiltering: true,
          rowTemplate: rowTemplate(),
          multiSelect: false,
          modifierKeysToMultiSelect: false,
          noUnselect: true,
          enableRowSelection: true,
          // want these, but they're not showing
          enableVerticalScrollbars: uiGridConstants.scrollbars.ALWAYS,
          enableSorting: false,
          columnDefs: [
            {
              field: 'common_name',
              filter: {
                condition: uiGridConstants.filter.CONTAINS,
                placeholder: ''
              },
              enableColumnMenu: false
            },
            {
              field: 'scientific_name',
              filter: {
                condition: uiGridConstants.filter.CONTAINS,
                placeholder: ''
              },
              enableColumnMenu: false,
              allowCellFocus: false
            },
          ],
        };

        $scope.gridOptions.onRegisterApi = function(gridApi){
           $scope.gridApi = gridApi;
           gridApi.cellNav.on.navigate($scope,function(rowCol){
             $scope.selectRow(rowCol.row);
           });
        };

        $scope.taxonChange = function() {
          $q.all([$scope.taxon_levels.$promise, $scope.taxon_groups.$promise])
            .then(function() {

              var filteredData = $filter('filter')($scope.allData, {
                taxon_level: $scope.model.taxon_level.taxon_level_id,
                taxon_group: $scope.model.taxon_group.taxon_group_id
              });
              $scope.gridOptions.data = $filter('orderBy')(filteredData, 'common_name');

            });
        };

        $scope.taxon_levels = sauAPI.TaxonLevels.get(function() {
          $scope.model.taxon_level = $scope.taxon_levels.data[0];
        });
        $scope.taxon_groups = sauAPI.TaxonGroups.get(function() {
          $scope.model.taxon_group = $scope.taxon_groups.data[0];
        });

        $scope.$watch('regionId', function() {
          sauAPI.ExploitedOrganismsData.get({region: $scope.regionName, region_id: $scope.regionId}, function(response) {
              $scope.allData = response.data;
              $scope.taxonChange();
            });
        }, true);

      };

      return {
        templateUrl: 'views/taxon-grid.html',
        restrict: 'E',
        controller: controller,
      };
    });
})();