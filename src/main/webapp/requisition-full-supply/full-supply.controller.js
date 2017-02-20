(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name requisition-full-supply.FullSupplyController
     *
     * @description
     * Responsible for managing product grid for full supply products.
     */
    angular
        .module('requisition-full-supply')
        .controller('FullSupplyController', controller);

    controller.$inject = [
        '$controller', '$filter', 'requisitionValidator', 'TEMPLATE_COLUMNS', 'requisition',
        'columns', 'items', 'page', 'pageSize', 'totalItems'
    ];

    function controller($controller, $filter, requisitionValidator, TEMPLATE_COLUMNS, requisition,
                        columns, items, page, pageSize, totalItems) {

        var vm = this;

        $controller('BasePaginationController', {
            vm: vm,
            page: page,
            pageSize: pageSize,
            items: items,
            totalItems: totalItems,
            externalPagination: false,
            itemValidator: requisitionValidator.isLineItemValid,
            customFilter: getCategories
        });

        vm.stateParams.rnr = requisition.id;

        vm.areSkipControlsVisible = areSkipControlsVisible;
        vm.skipAll = skipAll;
        vm.unskipAll = unskipAll;
        vm.isSkipColumn = isSkipColumn;
        vm.getCategories = getCategories;

        /**
         * @ngdoc property
         * @propertyOf requisition-full-supply.FullSupplyController
         * @name requisition
         * @type {Object}
         *
         * @description
         * Holds requisition. This object is shared with the parent and nonFullSupply states.
         */
        vm.requisition = requisition;

        /**
         * @ngdoc property
         * @propertyOf requisition-full-supply.FullSupplyController
         * @name columns
         * @type {Array}
         *
         * @description
         * Holds the list of columns visible on this screen.
         */
        vm.columns = columns;

        /**
         *
         * @ngdoc method
         * @methodOf requisition-full-supply.FullSupplyController
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
         * @ngdoc method
         * @methodOf requisition-full-supply.FullSupplyController
         * @name areSkipControlsVisible
         *
         * @description
         * Checks if the current requisition template has a skip column, and if the requisition state allows for skipping.
         */
        function areSkipControlsVisible(){
            if(!requisition.$isSubmitted() && !requisition.$isInitiated()){
                return false;
            }

            var hasSkipColumn = false;
            columns.forEach(function(column){
                if(isSkipColumn(column)){
                    hasSkipColumn = true;
                }
            });
            return hasSkipColumn;
        }

        /**
         * @ngdoc method
         * @methodOf requisition-full-supply.FullSupplyController
         * @name skipAll
         *
         * @description
         * Sets all line items that are skippable from a requisition as skipped.
         */
        function skipAll() {
            setSkipAll(true);
        }

        /**
         * @ngdoc method
         * @methodOf requisition-full-supply.FullSupplyController
         * @name unskipAll
         *
         * @description
         * Sets all line items from a requisition as not skipped.
         */
        function unskipAll() {
            setSkipAll(false);
        }

        /**
         * @ngdoc method
         * @methodOf requisition-full-supply.FullSupplyController
         * @name isSkipColumn
         *
         * @description
         * Determines whether column name is 'skipped'.
         * @return {Boolean} true if column name is 'skipped'
         */
        function isSkipColumn(column) {
            return column.name === TEMPLATE_COLUMNS.SKIPPED;
        }

        /**
         * @ngdoc methodOf
         * @methodOf requisition-non-full-supply.NonFullSupplyController
         * @name getCategories
         *
         * @description
         * Returns line items grouped by category name and ordered by program's display order.
         *
         * @return  {Array}    line items grouped by category and ordered by program's display order
         */
        function getCategories(lineItems) {
            var categories = [];

            angular.forEach(
                $filter('groupBy')(lineItems, '$program.orderableCategoryDisplayName'),
                function(lineItems, categoryName) {
                    categories.push({
                        name: categoryName,
                        displayOrder: lineItems[0].$program.orderableCategoryDisplayOrder,
                        lineItems: $filter('orderBy')(lineItems, '$program.displayOrder')
                    });
                }
            );

            return $filter('orderBy')(categories, 'displayOrder');
        }

        /**
         * @ngdoc property
         * @propertyOf requisition-full-supply.FullSupplyController
         * @name skippedAll
         * @type {Object}
         *
         * @description
         * Indicated if the skip all button has been clicked.
         *
         */
        vm.skippedAll = false;

        function setSkipAll(value) {
            angular.forEach(items, function(lineItem) {
                if (lineItem.canBeSkipped(vm.requisition)) {
                    lineItem.skipped = value;
                }
            });
            vm.skippedAll = value;
        }
    }

})();
