(function() {

    'use strict';

    angular
        .module('openlmis.requisitions')
        .service('RequisitionStorage', service);

    service.$inject = ['$localStorage', '$q', '$filter'];

    function service($localStorage, $q, $filter) {

        this.get = get;
        this.put = put;
        this.getAll = getAll;
        this.search = search;
        this.clearAll = clearAll;

        init();

        function get(id) {
            var filtered = $filter('filter')($localStorage.requisitions, {
                requisition: {
                    id: id
                }
            });
            return filtered.length ? filtered[0] : undefined;
        }

        function getAll() {
            return $localStorage.requisitions;
        }

        function search(params) {
            var filtered = $filter('requisitionFilter')($localStorage.requisitions, {
                requisition: params
            }),
                requisitions = [];

            filtered.forEach(function(obj) {
                requisitions.push(obj.requisition);
            });

            return requisitions;
        }

        function put(requisition) {
            var current = getById(requisition.requisition.id);

            if (!current) {
                $localStorage.requisitions.push(requisition)
            } else {
                var id = $localStorage.requisitions.indexOf(current);
                $localStorage.requisitions[id] = requisition;
            }
        }

        function clearAll() {
            $localStorage.requisitions = [];
        }

        function init() {
            if (!$localStorage.requisitions) {
                $localStorage.requisitions = [];
            }
        }

        function getById(id) {
            var filtered = $filter('filter')($localStorage.requisitions, {
                requisition: {
                    id: id
                }
            });
            return filtered.length ? filtered[0] : undefined;
        }
    }

})();
