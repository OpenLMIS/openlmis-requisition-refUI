(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis-pagination.paginatedRouter
     *
     * @description
     * Provides method for enriching a resolve object with pagination related params. If a items
     * resolve is provided it will also set total items count.
     */
    angular
        .module('openlmis-pagination')
        .provider('paginatedRouter', factory);

    factory.$inject = ['PAGE_SIZE'];

    function factory(PAGE_SIZE) {
        this.resolve = resolve;

        this.$get = [function(){}];

        /**
         * @ngdoc method
         * @methodOf openlmis-pagination.paginatedRouter
         * @name resolve
         *
         * @description
         * Adds pagination related resolves to the given resolve object. If the toResolve object
         * has a resolve property its content and metadata are extracted into items, totalItems,
         * page and pageSize. Otherwise page, pageSize and totalItems are calculated based on the
         * toResolve.items array.
         *
         * @param   {Object}    toResolve   the object to be enriched
         * @return  {Object}                the enriched object
         */
        function resolve(toResolve) {
            if (toResolve.response) {
                if (!toResolve.totalItems) {
                    toResolve.totalItems = externalTotalItemsResolve;
                }

                if (!toResolve.items) {
                    toResolve.items = externalItemsResolve;
                }
            } else {

                if (!toResolve.totalItems && toResolve.items) {
                    toResolve.totalItems = totalItemsResolve;
                }
            }

            return toResolve;
        }

        function externalTotalItemsResolve(response) {
            return response.totalElements;
        }

        function externalItemsResolve(response) {
            return response.content;
        }

        function totalItemsResolve(items) {
            return items.length;
        }
    }

})();
