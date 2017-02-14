(function() {

	'use strict';

	angular
		.module('requisition-approval')
		.config(routes);

	routes.$inject = ['$stateProvider', 'REQUISITION_RIGHTS'];

	function routes($stateProvider, REQUISITION_RIGHTS) {

		$stateProvider.state('requisitions.approvalList', {
			showInNavigation: true,
			label: 'link.requisition.approve',
			url: '/approvalList?sortBy&descending',
			controller: 'RequisitionApprovalListController',
			controllerAs: 'vm',
			templateUrl: 'requisition-approval/requisition-approval-list.html',
			accessRights: [REQUISITION_RIGHTS.REQUISITION_APPROVE],
			reloadOnSearch: false,
			resolve: {
		        requisitionList: function (requisitionService) {
                    return requisitionService.forApproval();
		        }
		    }
		});

	}

})();
