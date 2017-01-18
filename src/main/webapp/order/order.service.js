(function() {

    'use strict';

    angular
        .module('order')
        .service('orderService', service);

    service.$inject = ['$resource', 'fulfillmentUrlFactory', 'dateUtils'];

    function service($resource, fulfillmentUrlFactory, dateUtils) {
        var resource = $resource(fulfillmentUrlFactory('/api/orders'), {}, {
            search: {
                isArray: true,
                method: 'GET',
                transformResponse: transformOrder,
                url: fulfillmentUrlFactory('/api/orders/search')
            }
        });

        this.search = search;

        function search(params) {
            return resource.search(params).$promise;
        }

        function transformOrder(data, headers, status) {
            if (status === 200) {
                var orders = angular.fromJson(data);
                orders.forEach(function(order) {
                    order.processingPeriod.startDate = dateUtils.toDate(order.processingPeriod.startDate);
                    order.processingPeriod.endDate = dateUtils.toDate(order.processingPeriod.endDate);
                });
                return orders;
            }
            return data;
        }
    }

})();
