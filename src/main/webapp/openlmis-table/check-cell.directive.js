(function() {

    'use strict';

    angular
        .module('openlmis-table')
        .directive('checkCell', directive);

    function directive() {
        var directive = {
            link: link,
            restrict: 'A',
            scope: {
                checked: '=checkCell'
            },
            templateUrl: 'openlmis-table/check-cell.html'
        };
        return directive;
    }

    function link(scope, element) {
        element.addClass('col-emergency');
    }

})();
