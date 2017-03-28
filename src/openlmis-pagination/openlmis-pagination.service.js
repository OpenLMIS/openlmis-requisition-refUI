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
     * @name openlmis-pagination.paginationService
     *
     * @description
     * Allows registering the pagination elements.
     */
    angular
        .module('openlmis-pagination')
        .service('paginationService', service);

    service.$inject = ['$q', '$state', 'PAGE_SIZE', 'paginationFactory'];

    function service($q, $state, PAGE_SIZE, paginationFactory) {

        this.registerUrl = registerUrl;
        this.registerList = registerList;
        this.getSize = getSize;
        this.getPage = getPage;
        this.getTotalItems = getTotalItems;
        this.getShowingItems = getShowingItems;
        this.getItemValidator = getItemValidator;
        this.isExternalPagination = isExternalPagination;
        this.getPageItems = getPageItems;

        var size,
            page,
            totalItems,
            showingItems,
            itemValidator,
            externalPagination,
            stateParams,
            stateName,
            items;

        function registerUrl(newStateParams, loadItemsMethod) {

            var deferred = $q.defer(),
                promise;

            if(!newStateParams.page) newStateParams.page = 0;
            if(!newStateParams.size) newStateParams.size = PAGE_SIZE;

            if(shouldChangePageToFirstOne(newStateParams)) {
                newStateParams.page = 0;
            }

            promise = loadItemsMethod(newStateParams);

            if(promise && promise.then) {
                promise.then(function(response) {
                    size = response.size;
                    page = response.number;
                    totalItems = response.totalElements;
                    showingItems = response.content.length;
                    externalPagination = true;
                    itemValidator = null;
                    stateParams = newStateParams;
                    stateName = $state.current.name;

                    deferred.resolve(response.content);
                }, function() {
                    deferred.reject();
                });
            } else {
                size = 0;
                page = 0;
                totalItems = 0;
                showingItems = 0;
                externalPagination = true;
                itemValidator = null;
                stateParams = newStateParams;
                stateName = $state.current.name;
                deferred.resolve([]);
            }

            return deferred.promise;
        }

        function registerList(itemValidator, newStateParams, loadItemsMethod) {

            var deferred = $q.defer(),
                pageItems;

            if(!newStateParams.page) newStateParams.page = 0;
            if(!newStateParams.size) newStateParams.size = PAGE_SIZE;

            if(shouldChangePageToFirstOne(newStateParams)) {
                newStateParams.page = 0;
            }

            if(hasScreenChanged(newStateParams)) {
                items = loadItemsMethod();
                totalItems = items.length;
                externalPagination = false;
                itemValidator = itemValidator;
                stateName = $state.current.name;
            }
            size = parseInt(newStateParams.size);
            page = parseInt(newStateParams.page);
            pageItems = getPageItems(page);
            showingItems = pageItems.length;
            stateParams = newStateParams;

            deferred.resolve(pageItems);

            return deferred.promise;
        }

        function hasScreenChanged(params) {

            if(!stateParams) return true;

            var oldStateParams = angular.copy(stateParams),
                newStateParams = angular.copy(params);

            oldStateParams.page = null;
            oldStateParams.size = null;
            newStateParams.page = null;
            newStateParams.size = null;

            return !angular.equals(oldStateParams, newStateParams);
        }

        function shouldChangePageToFirstOne(newStateParams) {
            return $state.current.name === stateName &&
                !angular.equals(stateParams, newStateParams) &&
                newStateParams.page === stateParams.page;
        }

        function getSize() {
            return size;
        }

        function getPage() {
            return page;
        }

        function getTotalItems() {
            return totalItems;
        }

        function getShowingItems() {
            return showingItems;
        }

        function getItemValidator() {
            return itemValidator;
        }

        function isExternalPagination() {
            return externalPagination;
        }

        function getPageItems(page) {
            return paginationFactory.getPage(items, page, size);
        }
    }

})();
