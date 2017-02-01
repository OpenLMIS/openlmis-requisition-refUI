(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name openlmis-pagination.PaginationController
     *
     * @description
     * Responsible for managing pagination element.
     */
    angular
        .module('openlmis-pagination')
        .controller('PaginationController', controller);

    function controller() {
        var vm = this;

        vm.changePage = changePage;
        vm.nextPage = nextPage;
        vm.previousPage = previousPage;

        vm.isCurrentPage = isCurrentPage;
        vm.isFirstPage = isFirstPage;
        vm.isLastPage = isLastPage;

        vm.getPageNumbers = getPageNumbers;

        /**
         * @ngdoc method
         * @name changePage
         * @methodOf openlmis-pagination.PaginationController
         *
         * @description
         * Changes the current page number to a new one. If callback for changing page
         * was provided then it will be called.
         *
         * @param  {integer} newPage New page number
         */
        function changePage(newPage) {
            if(newPage >= 0 && newPage < vm.totalPages) {
                vm.currentPage = newPage;
            }
        }

        /**
         * @ngdoc method
         * @name nextPage
         * @methodOf openlmis-pagination.PaginationController
         *
         * @description
         * Changes the current page to next one.
         */
        function nextPage() {
            changePage(vm.currentPage + 1);
        }

        /**
         * @ngdoc method
         * @name previousPage
         * @methodOf openlmis-pagination.PaginationController
         *
         * @description
         * Changes the current page number to a previous one.
         */
        function previousPage() {
            changePage(vm.currentPage - 1);
        }

        /**
         * @ngdoc method
         * @name isCurrentPage
         * @methodOf openlmis-pagination.PaginationController
         *
         * @description
         * Checks if the page number is current one.
         *
         * @param {integer} newPage number of page to check
         */
        function isCurrentPage(pageNumber) {
            return vm.currentPage === pageNumber;
        }

        /**
         * @ngdoc method
         * @name isFirstPage
         * @methodOf openlmis-pagination.PaginationController
         *
         * @description
         * Checks if current page is first one on the list.
         */
        function isFirstPage() {
            return vm.currentPage === 0;
        }

        /**
         * @ngdoc method
         * @name isLastPage
         * @methodOf openlmis-pagination.PaginationController
         *
         * @description
         * Checks if current page is last one on the list.
         */
        function isLastPage() {
            return vm.currentPage === vm.totalPages - 1;
        }

        /**
         * @ngdoc method
         * @name getPageNumbers
         * @methodOf openlmis-pagination.PaginationController
         *
         * @description
         * Generates array with numbers of all pages.
         *
         * @return {Array} generated numbers for pagination
         */
        function getPageNumbers() {
            return new Array(vm.totalPages);
        }
    }

})();
