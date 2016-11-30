(function() {

    'use strict';

    angular.module('openlmis.requisitions.api').factory('requisitionUrl', requisitionUrl);

    requisitionUrl.$inject = ['openlmisUrl', 'pathFactory'];

    function requisitionUrl(openlmisURL, pathFactory) {

        var requisitionUrl = "@@REQUISITION_SERVICE_URL";

        if(requisitionUrl.substr(0,2) == "@@"){
            requisitionUrl = "";
        }

        return function(url){
            url = pathFactory(requisitionUrl, url);
            return openlmisURL(url);
        }
    }

})();
