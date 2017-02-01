(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name requisition-non-full-supply.NonFullSupplyController
     *
     * @description
     * Responsible for managing product grid for non full supply products.
     */
    angular
        .module('requisition-non-full-supply')
        .controller('NonFullSupplyController', nonFullSupplyController);

    nonFullSupplyController.$inject = [
        'requisition', 'columns', 'requisitionValidator', 'addProductModalService', 'LineItem',
        '$filter', 'nonFullSupplyLineItems', 'paginationOptions', 'PaginationOptions',
        'paginationFactory', '$state'
    ];

    function nonFullSupplyController(requisition, columns, requisitionValidator,
                                     addProductModalService, LineItem, $filter,
                                     nonFullSupplyLineItems, paginationOptions, PaginationOptions,
                                     paginationFactory, $state) {

        var vm = this;

        vm.deleteLineItem = deleteLineItem;
        vm.addProduct = addProduct;
        vm.displayDeleteColumn = displayDeleteColumn;
        vm.changePage = changePage;
        vm.getCurrentPage = getCurrentPage;
        vm.isPageValid = isPageValid;

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.NonFullSupplyController
         * @name isLineItemValid
         *
         * @description
         * Checks whether any field of the given line item has any error. It does not perform any
         * validation. It is an exposure of the isLineItemValid method of the requisitionValidator.
         *
         * @param  {Object}  lineItem the line item to be checked
         * @return {Boolean}          true if any of the fields has error, false otherwise
         */
        vm.isLineItemValid = requisitionValidator.isLineItemValid;

        /**
         * @ngdoc property
         * @propertyOf requisition-non-full-supply.NonFullSupplyController
         * @name requisition
         * @type {Object}
         *
         * @description
         * Holds requisition. This object is shared with the parent and fullSupply states.
         */
        vm.requisition = requisition;

        vm.lineItems = getPage(paginationOptions.currentPage);
        vm.paginationOptions = getPaginationOptions(paginationOptions.currentPage);

        /**
         * @ngdoc property
         * @propertyOf requisition-non-full-supply.NonFullSupplyController
         * @name displayAddProductButton
         * @type {Boolean}
         *
         * @description
         * Flag responsible for hiding/showing the Add Product button.
         */
        vm.displayAddProductButton = !vm.requisition.$isApproved() && !vm.requisition.$isAuthorized() &&
        !vm.requisition.$isInApproval();
        /**
         * @ngdoc property
         * @propertyOf requisition-non-full-supply.NonFullSupplyController
         * @name columns
         * @type {Array}
         *
         * @description
         * Holds the list of columns visible on this screen.
         */
        vm.columns = columns;

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.NonFullSupplyController
         * @name deleteLineItem
         *
         * @description
         * Deletes the given line item, removing it from the grid and returning the product to the
         * list of approved products.
         *
         * @param  {Object} lineItem   the line item to be deleted
         */
        function deleteLineItem(lineItem) {
            var id = vm.requisition.requisitionLineItems.indexOf(lineItem);
            if (id > -1) {
                makeProductVisible(vm.requisition.requisitionLineItems[id].orderable.name);
                vm.requisition.requisitionLineItems.splice(id, 1);
                reload();
            }
        }

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.NonFullSupplyController
         * @name addProduct
         *
         * @description
         * Opens modal that lets the user add new product to the grid.
         */
        function addProduct() {
            addProductModalService.show(
                vm.requisition.availableNonFullSupplyProducts,
                vm.requisition.program.id
            ).then(function(lineItem) {
                vm.requisition.requisitionLineItems.push(
                    new LineItem(lineItem, vm.requisition)
                );
                reload();
            });
        }

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.NonFullSupplyController
         * @name displayDeleteColumn
         *
         * @description
         * Checks whether the delete column should be displayed. The column is visible only if any
         * of the line items is deletable.
         *
         * @return {Boolean} true if the delete column should be displayed, false otherwise
         */
        function displayDeleteColumn() {
            var display = false;
            vm.requisition.requisitionLineItems.forEach(function(lineItem) {
                display = display || lineItem.$deletable;
            });
            return display;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.NonFullSupplyController
         * @name changePage
         *
         * @description
         * Loads line items when page is changed.
         *
         * @param {integer} newPage new page number
         */
        function changePage(page) {
            reload();
            $state.go('requisitions.requisition.nonFullSupply', {
                rnr: vm.requisition.id,
                page: page,
                size: paginationOptions.size
            }, {
                notify: false
            });
        }

        /**
         * @ngdoc method
         * @methodOf requisition-non-full-supply.NonFullSupplyController
         * @name getCurrentPage
         *
         * @description
         * Gives current page of line items.
         *
         * @return {Array} page with line items
         */
        function getCurrentPage() {
            return vm.paginatedLineItems.getPage(vm.currentPage);
        }

        function reload() {
            var page = vm.paginationOptions.currentPage;
            vm.lineItems = getPage(page);
            vm.paginationOptions = getPaginationOptions(page);
        }

        function getPage(page) {
            return paginationFactory.getPage($filter('orderBy')(
                filterRequisitionLineItems(),
                '$program.productCategoryDisplayName'
            ), page, paginationOptions.size);
        }

        function getPaginationOptions(page) {
            return new PaginationOptions(
                page,
                paginationOptions.size,
                filterRequisitionLineItems().length,
                vm.lineItems.length
            );
        }

        function isPageValid(number) {
            return requisitionValidator.areLineItemsValid(paginationFactory.getPage(
                filterRequisitionLineItems(),
                number,
                paginationOptions.size
            ));
        }

        function makeProductVisible(productName) {
            angular.forEach(vm.requisition.availableNonFullSupplyProducts, function(product) {
                if (product.name === productName) product.$visible = true;
            });
        }

        function filterRequisitionLineItems() {
            return $filter('filter')(vm.requisition.requisitionLineItems, {
                $program: {
                    fullSupply:false
                }
            });
        }
    }

})();
