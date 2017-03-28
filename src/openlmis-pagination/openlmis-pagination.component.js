/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2017 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms
 * of the GNU Affero General Public License as published by the Free Software Foundation, either
 * version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU Affero General Public License for more details. You should have received a copy of
 * the GNU Affero General Public License along with this program. If not, see
 * http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

	'use strict';

	/**
     * @ngdoc service
     * @name openlmis-pagination.component:openlmisPagination
     *
     * @description
     * The OpenLMIS-Pagination component provides controls for API endpoints
     * that can provide paginated content. This endpoint allows for methods to
     * add validation for sets of pages.
     *
     * There are two edge-cases that are supported by the OpenLMIS-Pagination
     * component, if there are no results or if a page greater than the total
     * number of pages is selected.
     *
     * @example
     * ```
     * <openlmis-pagination>
     * </openlmis-pagination>
     * ```
     */
	angular
		.module('openlmis-pagination')
		.directive('openlmisPagination', component);

	function component() {
		return {
			controller: 'PaginationController',
			controllerAs: 'pagination',
            templateUrl: 'openlmis-pagination/openlmis-pagination.html'
		};
	}

})();
