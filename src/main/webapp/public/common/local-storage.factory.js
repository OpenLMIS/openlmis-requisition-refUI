(function() {

    'use strict';

    angular
        .module('openlmis-core')
        .factory('localStorageFactory', factory);

    factory.$inject = ['$localStorage', '$filter'];

    function factory($localStorage, $filter) {

        return localStorageFactory;

        function localStorageFactory(name) {
            if (!$localStorage[name]) {
                $localStorage[name] = [];
            }

            return {
                put: put,
                getBy: getBy,
                search: search,
                contains: contains
            }

            function put(object) {
                if (object.id) {
                    var current = getBy('id', object.id);
                    if (current) {
                        $localStorage[name].splice($localStorage[name].indexOf(current), 1);
                    }
                }
                $localStorage[name].push(object);
            }

            function getBy(property, value) {
                var match;
                $localStorage[name].forEach(function(object) {
                    if (object[property] === value) match = object;
                });
                return match;
            }

            function search(params) {
                return $filter('filter')($localStorage[name], params);
            }

            function contains(object) {
                return $localStorage[name].indexOf(object) !== -1;
            }
        }

    }

})();
