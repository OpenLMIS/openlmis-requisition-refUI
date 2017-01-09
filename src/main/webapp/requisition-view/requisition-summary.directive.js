(function() {

    'use strict';

    angular
        .module('requisition-view')
        .directive('requisitionSummary', directive);

    function directive() {
        var directive = {
            restrict: 'E',
            replace: true,
            scope: {
                requisition: '=requisition'
            },
            templateUrl: 'requisition-view/requisition-summary.html',
            controller: 'RequisitionSummaryCtrl',
            controllerAs: 'vm'
        }
        return directive;
    }

})();
