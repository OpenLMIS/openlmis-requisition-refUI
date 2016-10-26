
(function(){
    "use strict";

    angular.module("openlmis-core").directive('openlmisSelect', select);

    function select($parse){
        return {
            scope: {
                ngModel: '=ngModel',
                onChange: '&?onChange',
                items: '=items',
                placeholder: '@?placeholder',
                fieldDisplayed:'@fieldDisplayed',
                repeat: '@repeat'
            },
            restrict: 'EA',
            templateUrl: 'common/select.html',
            controller: 'SelectController'
        };
    }
})();