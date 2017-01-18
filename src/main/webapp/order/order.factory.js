(function() {

    'use strict';

    angular
        .module('order')
        .factory('orderFactory', factory);

    factory.$inject = ['orderService'];

    function factory(orderService) {
        var factory = {
            search: search
        };
        return factory;

        function search(supplyingFacilityId, requestingFacilityId, programId) {
            return orderService.search({
                supplyingFacility: supplyingFacilityId,
                requestingFacility: requestingFacilityId,
                program: programId
            });
        }
    }

})();
