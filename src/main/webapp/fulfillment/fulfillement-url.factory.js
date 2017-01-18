(function() {

    'use strict';

    angular
        .module('fulfillment')
        .factory('fulfillmentUrlFactory', factory);

    factory.$inject = ['openlmisUrlFactory', 'pathFactory'];

    function factory(openlmisUrlFactory, pathFactory) {

        var fulfillmentUrl = '@@FULFILLMENT_SERVICE_URL';

        if (fulfillmentUrl.substr(0, 2) == '@@') {
            fulfillmentUrl = '';
        }

        return function(url) {
            url = pathFactory(fulfillmentUrl, url);
            return openlmisUrlFactory(url);
        };
    }

})();
