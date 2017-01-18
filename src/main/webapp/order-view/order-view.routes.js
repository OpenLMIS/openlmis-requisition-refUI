(function() {

    'use strict';

    angular
        .module('order-view')
        .config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider) {

        $stateProvider.state('orders.view', {
            controller: 'OrderViewController',
            controllerAs: 'vm',
            label: 'link.view',
            showInNavigation: true,
            templateUrl: 'order-view/order-view.html',
            url: '/view',
            resolve: {
                supplyingFacilities: function(facilityService) {
                    return facilityService.getFulfillmentFacilities();
                },
                requestingFacilities: function(facilityFactory, authorizationService, $q, $filter) {
                    var userId = authorizationService.getUser().user_id,
                        deferred = $q.defer();

                    $q.all([
                        facilityFactory.getUserFacilities(userId, 'REQUISITION_CREATE'),
                        facilityFactory.getUserFacilities(userId, 'REQUISITION_AUTHORIZE')
                    ]).then(function(results) {
                        deferred.resolve($filter('unique')(results[0].concat(results[1]), 'id'));
                    }, function() {
                        deferred.reject();
                    });

                    return deferred.promise;
                }
            }
        });

    }

})();
