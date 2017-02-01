(function() {

    'use strict';

    angular
        .module('requisition-non-full-supply')
        .config(routes);

    routes.$inject = ['$stateProvider', 'PAGINATION_CONSTANTS'];

    function routes($stateProvider, PAGINATION_CONSTANTS) {

        $stateProvider.state('requisitions.requisition.nonFullSupply', {
            url: '/nonFullSupply?page&size',
            templateUrl: 'requisition-non-full-supply/non-full-supply.html',
            controller: 'NonFullSupplyController',
            controllerAs: 'vm',
            isOffline: true,
            params: {
                page: '0',
                size: PAGINATION_CONSTANTS.PAGE_SIZE.toString()
            },
            resolve: {
                nonFullSupplyLineItems: function(requisition, $filter) {
                    return $filter('filter')(requisition.requisitionLineItems, {
                        $program: {
                            fullSupply:false
                        }
                    });
                },
                columns: function(requisition) {
                    return requisition.template.getColumns(true);
                },
                paginationOptions: function(nonFullSupplyLineItems, $stateParams) {
                    return {
                        totalPages: Math.ceil(nonFullSupplyLineItems.length / $stateParams.size),
                        totalItems: nonFullSupplyLineItems.length,
                        currentPage: parseInt($stateParams.page),
                        size: parseInt($stateParams.size)
                    };
                }
            }
        });

    }

})();
