/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function() {

    'use strict';

    /**
     * @ngdoc service
     * @name openlmis.administration.Program
     *
     * @description
     * Allows user to perform operations on program resource.
     */
    angular.module('openlmis.administration').factory('programFactory', programFacotry);

    programFacotry.$inject = ['$q', 'templateDataService', 'programDataService'];

    function programFacotry($q, templateDataService, programDataService) {

        var factory = {
            get: get,
            getAll: getAll
        };

        return factory;


        /**
         * @ngdoc function
         * @name  get
         * @methodOf openlmis.administration.Program
         * @param {String} id Program UUID
         * @returns {Promise} Program info
         *
         * @description
         * Gets program by id.
         */
        function get(id) {
            return programDataService.get(id);
        }

        /**
         * @ngdoc function
         * @name  getAll
         * @methodOf openlmis.administration.Program
         * @returns {Promise} Array of all programs with templates
         *
         * @description
         * Gets all programs and adds requisition template to it.
         */
        function getAll() {
            var deferred = $q.defer();
            programDataService.getAll().then(function(programs) {
                getProgramTemplates(programs).then(function(items) {
                    deferred.resolve(items);
                }, function() {
                    deferred.reject();
                });
            }, function() {
                deferred.reject();
            });
            return deferred.promise;
        }

        function getProgramTemplates(programs) {
            var deferred = $q.defer();
            templateDataService.getAll().then(function(templates) {
                angular.forEach(programs, function(program, programIdx) {
                    angular.forEach(templates, function(template, templateIdx) {
                        if(program.id === template.programId) {
                            program.template = template;
                        }
                        if((programIdx === programs.length - 1) && (templateIdx === templates.length - 1))
                            deferred.resolve(programs);
                    });
                });
            }, function() {
                deferred.reject();
            });
            return deferred.promise;
        }
    }

})();
