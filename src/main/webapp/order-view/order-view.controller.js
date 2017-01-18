(function() {

    'use strict';

    angular
        .module('order-view')
        .controller('OrderViewController', controller);

    controller.$inject = [
        'supplyingFacilities', 'requestingFacilities', 'orderFactory', 'loadingModalService',
        'notificationService', 'fulfillmentUrlFactory'
    ];

    function controller(supplyingFacilities, requestingFacilities, orderFactory,
                        loadingModalService, notificationService, fulfillmentUrlFactory) {

        var vm = this;

        vm.loadOrders = loadOrders;
        vm.getDownloadUrl = getDownloadUrl;

        vm.supplyingFacilities = supplyingFacilities;
        vm.requestingFacilities = requestingFacilities;

        function loadOrders() {
            loadingModalService.open();
            orderFactory.search(
                vm.supplyingFacility.id,
                vm.requestingFacility ? vm.requestingFacility.id : null,
                vm.program ? vm.program.id : null
            ).then(function(orders) {
                vm.orders = orders;
            }, function() {
                notificationService.error('msg.error.occurred');
            }).finally(function() {
                loadingModalService.close();
            });
        }

        function getDownloadUrl(order) {
            return fulfillmentUrlFactory('/api/orders/' + order.id + '/export?type=csv');
        }
    }

})();
