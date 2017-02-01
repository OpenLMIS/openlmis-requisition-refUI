(function() {

    'use strict';

    angular
        .module('openlmis-pagination')
        .factory('PaginationOptions', factory);

    factory.$inject = [];

    function factory() {
        return PaginationOptions;

        function PaginationOptions(currentPage, size, totalItems, items) {
            this.currentPage = currentPage;
            this.size = size;
            this.totalItems = totalItems;
            this.items = items;
            this.totalPages = Math.ceil(totalItems / size);
        }
    }

})();
