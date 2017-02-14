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
        '$controller', 'requisitionValidator', 'TEMPLATE_COLUMNS', 'requisition', 'columns',
        'items', 'totalItems'
    ];

    function controller($controller, requisitionValidator, TEMPLATE_COLUMNS, requisition, columns,
                        items, totalItems) {

        var vm = this;

        $controller('BasePaginationController', {
            vm: vm,
            items: items,
            totalItems: totalItems,
            externalPagination: false,
            itemValidator: requisitionValidator.isLineItemValid
        });

        vm.skipAll = skipAll;
        vm.unskipAll = unskipAll;
        vm.isSkipColumn = isSkipColumn;

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

        function setSkipAll(value) {
            angular.forEach(items, function(lineItem) {
                if (lineItem.canBeSkipped(vm.requisition)) {
                    lineItem.skipped = value;
                }
            });
        }
    }

})();
