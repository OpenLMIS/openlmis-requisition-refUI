(function() {

    'use strict';

    /**
     * @ngdoc directive
     * @name openlmis-table.directive:openlmisTableSortControl
     *
     * @description
     *
     */
    angular
        .module('openlmis-table')
        .directive('openlmisTableSortControl', directive);

    directive.$inject = ['$stateParams', '$location'];

    function directive($stateParams, $location) {
        var directive = {
            link: link,
            replace: true,
            require: 'ngModel',
            scope: {
                options: '='
            },
            templateUrl: 'openlmis-table/openlmis-table-sort-control.html',
        };
        return directive;

        function link(scope, element, attrs, ngModelCtrl) {
            var vm = scope.vm = {
                displayNames: scope.options,
                options: Object.keys(scope.options),
                toggleOrder: toggleOrder
            };

            ngModelCtrl.$render = render;

            scope.$watch('vm.sortBy + vm.descending', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    var newViewValue = angular.copy(ngModelCtrl.$viewValue);

                    newViewValue.sortBy = vm.sortBy;
                    newViewValue.descending = vm.descending;

                    $location.search('sortBy', newViewValue.sortBy);
                    $location.search('descending', newViewValue.descending);

                    ngModelCtrl.$setViewValue(newViewValue);
                }
            });

            if (vm.sortBy) vm.sortBy = vm.options[0];
            if (vm.descending) vm.descending = false;

            function render() {
                vm.sortBy = ngModelCtrl.$viewValue.sortBy;
                vm.descending = ngModelCtrl.$viewValue.descending === 'true';
            }

            function toggleOrder() {
                vm.descending = !vm.descending;
            }
        }
    }

})();
