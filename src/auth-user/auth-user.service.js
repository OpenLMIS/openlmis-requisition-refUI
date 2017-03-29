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
(function(){

    'use strict';

    /**
     * @ngdoc service
     * @name auth-user.authUserService
     *
     * @description
     * Responsible for retrieving user info from the auth service.
     */
    angular
        .module('auth-user')
        .service('authUserService', service);

    service.$inject = [
        'openlmisUrlFactory', '$resource'
    ];

    function service(openlmisUrlFactory, $resource) {
        var resource = $resource(openlmisUrlFactory('/api/users/auth'), {}, {
                saveUser: {
                    method: 'POST'
                },
                resetPassword: {
                    method: 'POST',
                    url: openlmisUrlFactory('/api/users/auth/passwordReset')
                }
            });

        this.saveUser = saveUser;
        this.resetPassword = resetPassword;

        /**
         * @ngdoc method
         * @methodOf auth-user.authUserService
         * @name saveUser
         *
         * @description
         * Saves the given user in the auth service.
         *
         * @param   {Object}    user    the user to be saved
         * @return  {Promise}           the promise resolving to the saved user
         */
        function saveUser(user) {
            return resource.saveUser(undefined, user).$promise;
        }

        function resetPassword(username, newPassword) {
            return resource.resetPassword(undefined, {
                username: username,
                newPassword: newPassword
            }).$promise;
        }
    }
})();
