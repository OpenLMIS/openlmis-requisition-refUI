(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name openlmis-pagination.controller:BasePaginationController
     *
     * @description
     * Base for all controllers providing pagination.
     */
    angular
        .module('openlmis-pagination')
        .controller('BasePaginationController', controller);

    controller.$inject = [
        '$state', 'paginationFactory', 'vm', 'page', 'pageSize', 'items', 'totalItems',
        'externalPagination', 'itemValidator', 'customFilter'
    ];

    function controller($state, paginationFactory, vm, page, pageSize, items, totalItems,
                        externalPagination, itemValidator, customFilter) {

        vm.updateUrl = updateUrl;
        vm.getPage = getPage;
        vm.changePage = changePage;
        vm.isPageValid = isPageValid;

        /**
         * @ngdoc property
         * @propertyOf openlmis-pagination.controller:BasePaginationController
         * @name items
         * @type {Array}
         *
         * @description
         * The list of all items used for extracting pages. If external pagination is used this is
         * a list of items on the current page.
         */
        vm.items = items;

        /**
         * @ngdoc property
         * @propertyOf openlmis-pagination.controller:BasePaginationController
         * @name stateParams
         * @type {Object}
         *
         * @description
         * Stores the current state parameters. This object is used when reloading state.
         */
        vm.stateParams = {
            page: page,
            size: pageSize
        };

        /**
         * @ngdoc property
         * @propertyOf openlmis-pagination.controller:BasePaginationController
         * @name totalItems
         * @type {Number}
         *
         * @description
         * Stores the total amount of all items. This is used mostly by the pagination directive.
         */
        vm.totalItems = totalItems;

        /**
         * @ngdoc property
         * @propertyOf openlmis-pagination.controller:BasePaginationController
         * @name pageItems
         * @type {Array}
         *
         * @description
         * The list of items displayed on the current page.
         */
        vm.pageItems = getPageItems();

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.controller:BasePaginationController
         * @name updateUrl
         *
         * @description
         * Responsible for updating current state URL with the parameters stored in the
         * vm.stateParams object.
         */
        function updateUrl() {
            $state.go($state.current.name, vm.stateParams, {
                reload: externalPagination,
                notify: externalPagination
            });
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.controller:BasePaginationController
         * @name changePage
         *
         * @description
         * Changes current page. It will update URL and load new items(only if internal pagination
         * is used).
         */
        function changePage() {
            if (!externalPagination) {
                if (customFilter) {
                    vm.pageItems = customFilter(getPage(vm.stateParams.page));
                }
                vm.pageItems = getPage(vm.stateParams.page);
            }
            updateUrl();
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.controller:BasePaginationController
         * @name getPage
         *
         * @description
         * Gets the list of items on the given page.
         *
         * @param   {Number}    page    the number of the page
         * @return  {Array}             the list of items on the given page
         */
        function getPage(page) {
            return paginationFactory.getPage(vm.items, page, vm.stateParams.size);
        }

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.controller:BasePaginationController
         * @name isPageValid
         *
         * @description
         * Validates whether page with the given name is valid.
         *
         * @param   {Number}    page    the number of the page
         * @return  {Boolean}           true if the page with the given number is valid, false
         *                              otherwise
         */
        function isPageValid(page) {
            if (!itemValidator) return true;

            var valid = true;
            angular.forEach(getPage(page), function(item) {
                valid = valid && itemValidator(item);
            });
            return valid;
        }

        function getPageItems() {
            var items = externalPagination ? items : getPage(vm.stateParams.page);

            if (customFilter) {
                return customFilter(items);
            }
            return items;
        }
    }

})();
