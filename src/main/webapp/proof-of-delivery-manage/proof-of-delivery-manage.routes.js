(function() {

    'use strict';

    angular
        .module('proof-of-delivery-manage')
        .config(routes);

    routes.$inject = ['$stateProvider', 'FULFILLMENT_RIGHTS'];

    function routes($stateProvider, FULFILLMENT_RIGHTS) {

        $stateProvider.state('orders.podManage', {
			showInNavigation: true,
			label: 'link.orders.podManage',
            url: '/manage',
            controller: 'ProofOfDeliveryManageController',
            controllerAs: 'vm',
            templateUrl: 'proof-of-delivery-manage/proof-of-delivery-manage.html',
            accessRights: [
                FULFILLMENT_RIGHTS.PODS_MANAGE
            ],
            resolve: {
                facility: function (authorizationService, $q) {
                    var deferred = $q.defer();

                    authorizationService.getDetailedUser().$promise.then(function(response) {
                        deferred.resolve(response.homeFacility);
                    }, function(response) {
                        deferred.reject();
                    });

                    return deferred.promise;
                },
                user: function(authorizationService) {
                    return authorizationService.getUser();
                },
                supervisedPrograms: function (programService, user) {
                    return programService.getUserPrograms(user.user_id, false);
                },
                homePrograms: function (programService, user) {
                    return programService.getUserPrograms(user.user_id, true);
                },
                supplyingFacilities: function(facilityFactory, authorizationService) {
                    return facilityFactory.getSupplyingFacilities(
                        authorizationService.getUser().user_id
                    );
                }
            }
        });

    }

})();
