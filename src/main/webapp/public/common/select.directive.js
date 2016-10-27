
(function(){
    "use strict";

    angular.module("openlmis-core").directive('openlmisSelect', select);

    function select($parse){
        return {
            scope: {
                id: "@id",
                ngModel: '=ngModel',
                onChange: '&?onChange',
                items: '=items',
                placeholder: '@?placeholder',
                fieldDisplayed:'@fieldDisplayed',
                orderBy: '@?',
                trackBy: '@?',
            },
            replace: true,
            restrict: 'E',
            templateUrl: 'common/select.html',
            controller: 'SelectController'
        };
    }
})();