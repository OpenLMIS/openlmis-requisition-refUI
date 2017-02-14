(function() {

    'use strict';

    /**
     * @ngdoc controller
     * @name requisition-search.RequisitionViewController
     *
     * @description
     * Controller for requisition view page
     */

    angular
        .module('requisition-search')
        .controller('RequisitionSearchController', RequisitionSearchController);

    RequisitionSearchController.$inject = [
        '$stateParams', '$rootScope', '$state', 'facilityList', 'requisitionService',
        'REQUISITION_STATUS', 'dateUtils', 'loadingModalService', 'notificationService',
        'offlineService', 'localStorageFactory', 'confirmService'
    ];

    function RequisitionSearchController($stateParams, $rootScope, $state, facilityList,
                                         requisitionService, REQUISITION_STATUS, dateUtils,
                                         loadingModalService, notificationService, offlineService,
                                         localStorageFactory, confirmService) {

        var vm = this,
            offlineRequisitions = localStorageFactory('requisitions');

        vm.loadPrograms = loadPrograms;
        vm.search = search;
        vm.openRnr = openRnr;
        vm.removeOfflineRequisition = removeOfflineRequisition;
        vm.isOfflineDisabled = isOfflineDisabled;

        vm.searchOffline = offlineService.isOffline();
        vm.facilities = facilityList;
        vm.statuses = REQUISITION_STATUS.$toList();
        vm.selectedStatuses = [];

        vm.stateParams = $stateParams;

        vm.sortOptions = {
            'program.name': 'label.program',
            'facility.code': 'label.facilityCode',
            'facility.name': 'label.facilityName',
            'processingPeriod.startDate': 'label.period.start.date',
            'processingPeriod.endDate': 'label.period.end.date',
            createdDate: 'label.date.submitted',
            status: 'label.status'
        };

        function isOfflineDisabled() {
            if (offlineService.isOffline()) vm.searchOffline = true;
            return offlineService.isOffline();
        }

        /**
         * @ngdoc method
         * @name openRnr
         * @methodOf requisition-search.RequisitionViewController
         *
         * @description
         * Redirect to requisition page after clicking on grid row.
         *
         * @param {String} requisitionId Requisition UUID
         */
        function openRnr(requisitionId) {
            $state.go('requisitions.requisition.fullSupply', {
                rnr: requisitionId
            });
        }

        /**
         * @ngdoc method
         * @name removeOfflineRequisition
         * @methodOf requisition-search.RequisitionViewController
         *
         * @description
         * Removes requisition from local storage.
         *
         * @param {Resource} requisition Requisition to remove
         */
        function removeOfflineRequisition(requisition) {
            confirmService.confirmDestroy('msg.removeOfflineRequisitionQuestion').then(function() {
                offlineRequisitions.removeBy('id', requisition.id);
                requisition.$availableOffline = false;
            });
        }

        /**
         * @ngdoc method
         * @name loadPrograms
         * @methodOf requisition-search.RequisitionViewController
         *
         * @description
         * Loads selected facility supported programs to program select input.
         */
        function loadPrograms() {
            if (!vm.selectedFacility) {
                return;
            } else if (vm.selectedFacility.supportedPrograms) {
                vm.programs = vm.selectedFacility.supportedPrograms;
            } else {
                notificationService.error('msg.no.program.available');
            }
        }

        /**
         * @ngdoc method
         * @name search
         * @methodOf requisition-search.RequisitionViewController
         *
         * @description
         * Searches requisitions by criteria selected in form.
         */
        function search() {
            if (vm.selectedFacility) {
                vm.error = null;
                loadingModalService.open();
                requisitionService.search(vm.searchOffline, {
                        program: vm.selectedProgram ? vm.selectedProgram.id : null,
                        facility: vm.selectedFacility ? vm.selectedFacility.id : null,
                        initiatedDateFrom: vm.startDate ? vm.startDate.toISOString() : null,
                        initiatedDateTo: vm.endDate ? vm.endDate.toISOString() : null
                    })
                    .then(function(requisitionList) {
                        vm.requisitionList = requisitionList;
                        loadingModalService.close();
                    })
                    .catch(function() {
                        notificationService.error('msg.error.occurred');
                    })
                    .finally(loadingModalService.close);
            } else {
                notificationService.error('msg.no.facility.selected');
            }
        }
    }
})();
