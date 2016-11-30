(function() {

    'use strict';

    angular
        .module('openlmis.referencedata.api')
        .factory('programDataService', dataService);

    dataService.$inject = ['$resource', 'openlmisUrl'];

    function dataService($resource, openlmisUrl) {
        var resource = $resource(openlmisUrl('/referencedata/api/programs/:id'), {}, {
            'getAll': {
                url: openlmisUrl('/referencedata/api/programs'),
                method: 'GET',
                isArray: true
            }
        }),

        factory = {
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
            return resource.get({id: id}).$promise;
        }

        /**
         * @ngdoc function
         * @name  getAll
         * @methodOf openlmis.administration.Program
         * @returns {Promise} Array of all programs with templates
         *
         * @description
         * Gets all programs.
         */
        function getAll() {
            return resource.getAll().$promise;
        }
    }

})();
