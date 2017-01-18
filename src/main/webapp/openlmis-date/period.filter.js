(function() {

    'use strict';

    angular
        .module('openlmis-date')
        .filter('period', filter);

    filter.$inject = ['$filter'];

    function filter($filter) {
        return periodFilter;

        function periodFilter(period, includeName) {
            var format = 'dd/MM/yyyy',
                startDate = $filter('date')(period.startDate, format),
                endDate = $filter('date')(period.endDate, format),
                transformed = startDate + ' - ' + endDate;

            return includeName ? period.name + ' (' + transformed + ')' : transformed;
        }
    }

})();
