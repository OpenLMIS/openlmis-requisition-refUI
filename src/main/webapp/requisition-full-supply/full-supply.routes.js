(function() {

    'use strict';

    angular
        .module('requisition-full-supply')
        .config(routes);

    routes.$inject = ['$stateProvider', 'PAGINATION_CONSTANTS'];

    function routes($stateProvider, PAGINATION_CONSTANTS) {
        $stateProvider.state('requisitions.requisition.fullSupply', {
            url: '/fullSupply?page&size',
            templateUrl: 'requisition-full-supply/full-supply.html',
            controller: 'FullSupplyController',
            controllerAs: 'vm',
            isOffline: true,
            params: {
                page: '0',
                size: PAGINATION_CONSTANTS.PAGE_SIZE.toString()
            },
            resolve: {
                fullSupplyLineItems: function($filter, requisition) {
                    return $filter('filter')(requisition.requisitionLineItems, {
                        $program: {
                            fullSupply:true
                        }
                    });
                },
                columns: function(requisition) {
                    return requisition.template.getColumns();
                },
                paginationOptions: function(fullSupplyLineItems, $stateParams) {
                    return {
                        totalPages: Math.ceil(fullSupplyLineItems.length / $stateParams.size),
                        totalItems: fullSupplyLineItems.length,
                        currentPage: parseInt($stateParams.page),
                        size: parseInt($stateParams.size)
                    };
                }
            }
        });
    }

})();
