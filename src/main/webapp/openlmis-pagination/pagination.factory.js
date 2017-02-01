(function() {

    'use strict';

    angular
        .module('openlmis-pagination')
        .factory('paginationFactory', factory);

    function factory() {
        var factory = {
            getPage: getPage
        };
        return factory;

        function getPage(items, page, size) {
            var start = page * size,
                end = Math.min(items.length, start + size);

            return start < end ? items.slice(start, end) : [];
        }
    }

})();
