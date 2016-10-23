(function() {
  
  'use strict';

  angular.module('openlmis.requisitions').directive('productGrid', productGrid)
    .filter('numberFilter', numberFilter);

  productGrid.$inject = ['messageService'];

  function productGrid(messageService) {
    return {
      restrict: 'E',
      scope: {
        columns: '=columns',
        products: '=products'
      },
      templateUrl: 'requisitions/product-grid/product-grid.html',
      link: function(scope) {

        var columnDefs = [{
          field: 'orderableProduct.programs.0.productCategoryDisplayName',
          displayName: messageService.get('label.category'),
          grouping: { groupPriority: 0 },
          enableSorting: false,
          pinnedLeft: true,
          visible: false
        },{
          field: 'orderableProduct.productCode',
          displayName: messageService.get('label.vaccine.manufacturer.product.code'),
          pinnedLeft: true,
          customTreeAggregationFn: function ( aggregation, fieldValue, numValue, row ){
            aggregation.value = row.entity.orderableProduct.programs[0].productCategoryDisplayName;
          }
        }, {
          field: 'orderableProduct.name',
          displayName: messageService.get('option.value.product'),
          pinnedLeft: true
        }];
        
        for (var column in scope.columns) {
          columnDefs.push({
            field: column,
            displayName: column.name,
            cellFilter: 'numberFilter',
            cellTemplate: '<product-grid-cell ng-model="row.entity" col="grid.appScope.columns[col.field]"></product-grid-cell>'
          });
        }

        scope.options = {
          data: scope.products,
          showFooter: false,
          showSelectionCheckbox: false,
          enableColumnResize: true,
          enableColumnMenus: false,
          showFilter: false,
          columnDefs: columnDefs,
          sortInfo: {
            fields: ['orderableProduct.programs.0.productCategoryDisplayOrder', 'orderableProduct.productCode'],
            directions: ['asc']
          },
          onRegisterApi: function(gridApi) {
            gridApi.grid.registerDataChangeCallback(function() {
              gridApi.grid.api.treeBase.expandAllRows();
            });
          }
        };
      }
    };
  }

  function numberFilter() {
    return function(value) {
      return (value === null ? 0 : value);
    };
  }

})();