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
     * @ngdoc controller
     * @name admin-user-form-modal.controller:UserFormModalController
     *
     * @description
     * Exposes method for creating/updating user to the modal view.
     */
    angular
        .module('admin-user-form-modal')
        .controller('UserFormModalController', controller);

    controller.$inject = [
        'user', 'modalDeferred', 'referencedataUserService', 'loadingModalService',
        'notificationService', 'UserPasswordModal', 'authUserService'
    ];

    function controller(user, modalDeferred, referencedataUserService, loadingModalService,
                        notificationService, UserPasswordModal, authUserService) {

        var vm = this;

        vm.$onInit = onInit;
        vm.createUser = createUser;

        /**
         * @ngdoc method
         * @methodOf admin-user-form-modal.controller:UserFormModalController
         * @name $onInit
         *
         * @description
         * Initialization method of the UserFormModalController.
         */
        function onInit() {
            vm.user = user;
            vm.updateMode = !!user.id;
            vm.notification = 'msg.user' + (vm.updateMode ? 'Updated' : 'Created') + 'Successfully';
        }

        /**
         * @ngdoc method
         * @methodOf admin-user-form-modal.controller:UserFormModalController
         * @name createUser
         *
         * @description
         * Creates or updates the user.
         *
         * @return  {Promise}   the promise resolving to th created/updated user
         */
        function createUser() {
            var loadingPromise = loadingModalService.open(true);
            return referencedataUserService.createUser(vm.user).then(function(user) {
                /**authUserService.saveUser({
                    email: user.email,
                    enabled: true,
                    referenceDataUserId: user.id,
                    role: 'USER',
                    username: user.username
                }).then(function() {*/
                    loadingPromise.then(function() {
                        notificationService.success(vm.notification);
                    });

                    if (vm.updateMode) {
                        modalDeferred.resolve(user);
                    } else {
                        (new UserPasswordModal(user.username)).finally(function() {
                            modalDeferred.resolve(user);
                        });
                    }
                /**}, loadingModalService.close);*/
            }).finally(loadingModalService.close);
        }

    }

})();
