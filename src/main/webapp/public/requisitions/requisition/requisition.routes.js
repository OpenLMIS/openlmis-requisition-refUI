(function() {

    'use strict';

    angular
        .module('openlmis.requisitions')
        .config(routes);

    routes.$inject = ['$stateProvider'];

    function routes($stateProvider) {

        $stateProvider.state('requisitions.requisition', {
            url: '^/requisition/:rnr',
            controller: 'RequisitionCtrl',
            right: 'REQUISITION_VIEW',
            templateUrl: 'requisitions/requisition/requisition.html',
            resolve: {
                requisition: function ($location, $q, $stateParams, RequisitionService) {
                    var deferred = $q.defer();

                    RequisitionService.get($stateParams.rnr).then(function(response) {
                        deferred.resolve(response);
                    }, function(response) {
                        deferred.reject();
                        return $location.url('/404');
                    });

                    return deferred.promise;
                },
                requisitions: requisitionsResolve
            }
        });

        $stateProvider.state('requisitions.requisition.fullSupply', {
            url: '/fullSupply',
            right: 'REQUISITION_VIEW',
            templateUrl: 'requisitions/requisition/full-supply.html',
            controller: 'FullSupplyCtrl',
            controllerAs: 'vm'
        });

        $stateProvider.state('requisitions.requisition.nonFullSupply', {
            url: '/nonFullSupply',
            right: 'REQUISITION_VIEW',
            templateUrl: 'requisitions/requisition/non-full-supply.html',
            controller: 'NonFullSupplyCtrl',
            controllerAs: 'vm'
        });

        function requisitionsResolve($stateParams, RequisitionService) {
            return RequisitionService.forConvert({
                filterBy: $stateParams.filterBy,
                filterValue: $stateParams.filterValue,
                sortBy: $stateParams.sortBy,
                descending: $stateParams.descending
            });
        }

    }

})();
