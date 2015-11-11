'use strict';

angular.module('sauWebApp')
  .directive('sauTaxonGrid', function (uiGridConstants, taxonLevels, sauAPI) {

    var controller = function($scope, $q, $filter) {

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

      function cellTemplate() {
        return '<div class="ui-grid-cell-content">{{row.entity.common_name}} (<em>{{row.entity.scientific_name}}</em>)</div>';
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
        enableSorting: true,
        columnDefs: [
          {
            field: 'name',
            displayName: 'Taxon',
            filter: {
              condition: uiGridConstants.filter.CONTAINS,
              placeholder: 'Search this list'
            },
            cellTemplate: cellTemplate(),
            enableColumnMenu: false,
            enableSorting: true,
            suppressRemoveSort: true // this plus below fixes column sorting
          }
        ]
      };

      $scope.gridOptions.onRegisterApi = function(gridApi){
        $scope.gridApi = gridApi;
        gridApi.cellNav.on.navigate($scope,function(rowCol){
          $scope.selectRow(rowCol.row);
        });

        // borrowed from https://github.com/angular-ui/ng-grid/issues/2799
        // to allow column sorting to toggle between ASC/DESC, not ASC/DESC/UNSORTED
        $scope.gridApi.core.on.sortChanged($scope, function(grid, sortColumns) {
          if(sortColumns.length > 1) {
            angular.forEach(sortColumns, function(col){
              if(col.sort.priority === 1) {
                col.sort.priority = 0;
                col.sort.direction = null;
              } else {
                col.sort.priority = 1;
              }
            });
          } else {
            sortColumns[0].sort.priority = 1;
          }
        });

      };

      $scope.taxonChange = function() {
        $q.all([$scope.taxonLevels.$promise, $scope.taxonGroups.$promise])
          .then(function() {
            var taxaFilterConfig = {};
            if ($scope.selectedTaxonLevel.taxon_level_id >= 0) {
              taxaFilterConfig.taxon_level = $scope.selectedTaxonLevel.taxon_level_id;
            }
            if ($scope.selectedTaxonGroup.taxon_group_id >= 0) {
              taxaFilterConfig.taxon_group = $scope.selectedTaxonGroup.taxon_group_id;
            }
            var filteredTaxa = $filter('filter')($scope.allRegionTaxa, taxaFilterConfig);
            $scope.gridOptions.data = $filter('orderBy')(filteredTaxa || [], 'common_name');
            updateGridHeaderTitle();
          });
      };

      $scope.taxonLevels = sauAPI.TaxonLevels.get(function() {
        $scope.taxonLevels.data.unshift({name: '-- All levels --', taxon_level_id: -1});
        $scope.selectedTaxonLevel = $scope.taxonLevels.data[0];
      });
      $scope.taxonGroups = sauAPI.TaxonGroups.get(function() {
        $scope.taxonGroups.data.unshift({name: '-- All groups --', taxon_group_id: -1});
        $scope.selectedTaxonGroup = $scope.taxonGroups.data[0];
      });

      $scope.$watch('regionId', function() {
        var cb = function(response) {
          $scope.allRegionTaxa = response.data;
          createTaxaDisplayNames();
          $scope.taxonChange();
        };

        if ($scope.regionId === 0) {
          sauAPI.ExploitedOrganismsList.get(cb);
        } else {
          sauAPI.ExploitedOrganismsData.get({region: $scope.regionName, region_id: $scope.regionId}, cb);
        }
      }, true);

      function createTaxaDisplayNames() {
        if (!$scope.allRegionTaxa) {
          return; 
        }
        $scope.allRegionTaxa.forEach(function (taxon) {
          taxon.name = taxon.common_name + ' ' + taxon.scientific_name;
        });
      }

      function updateGridHeaderTitle() {
        var title = 'Taxa';
        if ($scope.gridOptions && $scope.gridOptions.data) {
          title += ' (' + $scope.gridOptions.data.length + ')';  
        }
        $scope.gridOptions.columnDefs[0].displayName = title;
      }

    };

    return {
      templateUrl: 'views/taxon-grid.html',
      restrict: 'E',
      controller: controller
    };
  });
