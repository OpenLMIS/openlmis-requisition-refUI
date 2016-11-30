(function() {

    'use strict';

    angular
        .module('openlmis.requisitions.api')
        .factory('templateDataService', dataService);

    dataService.$inject = ['$resource', 'requisitionUrl'];

    function dataService($resource, requisitionUrl) {
        var resource = $resource(requisitionUrl('/api/requisitionTemplates/:id'), {}, {
            'getAll': {
                url: requisitionUrl('/api/requisitionTemplates'),
                method: 'GET',
                isArray: true
            },
            'search': {
                url: requisitionUrl('/api/requisitionTemplates/search'),
                method: 'GET'
            }
        });

        var dataService = {
            get: get,
            getAll: getAll,
            search: search
        };

        return dataService;


        /**
         * @ngdoc function
         * @name  get
         * @methodOf openlmis.administration.RequisitionTemplate
         * @param {String} id Requsition template UUID
         * @returns {Promise} Requisition template info
         *
         * @description
         * Gets requisition template by id.
         */
        function get(id) {
            return resource.get({id: id}).$promise;
        }

        /**
         * @ngdoc function
         * @name  getAll
         * @methodOf openlmis.administration.RequisitionTemplate
         * @returns {Promise} Array of all requisition templates
         *
         * @description
         * Gets all requisition templates.
         */
        function getAll() {
            return resource.getAll().$promise;
        }

        /**
         * @ngdoc function
         * @name  search
         * @methodOf openlmis.administration.RequisitionTemplate
         * @param {String} programId Program UUID
         * @return {Promise} requisition template for given program
         *
         * @description
         * Gets requisition template for given program.
         */
        function search(programId) {
            return resource.search({program: programId}).$promise;
        }
    }

})();
