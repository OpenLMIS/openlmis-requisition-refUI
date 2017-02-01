(function() {

    'use strict';

    angular
        .module('requisition-convert-to-order')
        .config(routes);

    routes.$inject = ['$stateProvider', 'REQUISITION_RIGHTS', 'PAGINATION_CONSTANTS'];

    function routes($stateProvider, REQUISITION_RIGHTS, PAGINATION_CONSTANTS) {

        $stateProvider.state('requisitions.convertToOrder', {
            showInNavigation: true,
            label: 'link.requisitions.convertToOrder',
            url: '/convertToOrder?filterBy&filterValue&sortBy&descending&page&size',
            controller: 'ConvertToOrderController',
            controllerAs: 'vm',
            templateUrl: 'requisition-convert-to-order/convert-to-order.html',
            accessRights: [REQUISITION_RIGHTS.REQUISITION_CONVERT_TO_ORDER],
            params: {
                filterBy: 'all',
                filterValue: '',
                page: '0',
                size: PAGINATION_CONSTANTS.PAGE_SIZE.toString()
            },
            resolve: {
                response: responseResolve,
                requisitions: requisitionsResolve,
                paginationOptions: paginationOptionsResolve
            }
        });

        function responseResolve($stateParams, requisitionService) {
            return requisitionService.forConvert({
                filterBy: $stateParams.filterBy,
                filterValue: $stateParams.filterValue,
                sortBy: $stateParams.sortBy,
                descending: $stateParams.descending,
                page: $stateParams.page,
                size: $stateParams.size
            });
        }

        function requisitionsResolve(response) {
            return response.content;
        }

        function paginationOptionsResolve(response) {
            return {
                totalPages: response.totalPages,
                totalItems: response.totalElements,
                currentPage: response.number,
                items: response.numberOfElements
            };
        }

    }

})();
