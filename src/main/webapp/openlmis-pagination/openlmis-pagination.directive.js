(function() {

	'use strict';

	/**
     * @ngdoc directive
     * @name openlmis-pagination.openlmisPagination
     *
     * @description
     * Provides pagination for table. Allows to add method for validating pages.
     */
	angular
		.module('openlmis-pagination')
		.directive('openlmisPagination', directive);

	function directive() {
		return {
			controller: 'PaginationController',
			controllerAs: 'vm',
			link: link,
			replace: true,
			require: ['openlmisPagination', 'ngModel'],
			restrict: 'E',
			scope: {
				pageValidator: '='
			},
			templateUrl: 'openlmis-pagination/openlmis-pagination.html'
		};
	}

	function link(scope, element, attrs, controllers) {
		var vm = controllers[0],
			ngModelCtrl = controllers[1];

		vm.isPageValid = scope.pageValidator;
		ngModelCtrl.$render = render;

		scope.$watch('vm.currentPage', function(oldPage, newPage) {
			if (oldPage !== newPage) {
				ngModelCtrl.$setViewValue({
					totalPages: vm.totalPages,
					totalItems: vm.totalItems,
					currentPage: vm.currentPage,
					items: vm.items
				});
			}
		});

		function render() {
			var viewValue = ngModelCtrl.$viewValue;
			vm.totalPages = viewValue.totalPages;
			vm.totalItems = viewValue.totalItems;
			vm.currentPage = viewValue.currentPage;
			vm.items = viewValue.items;
		}
	}

})();
