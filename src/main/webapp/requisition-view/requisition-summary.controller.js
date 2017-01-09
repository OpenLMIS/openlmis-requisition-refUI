(function() {

    'use strict';

    angular
        .module('requisition-view')
        .controller('RequisitionSummaryCtrl', controller);

    controller.$inject = ['$scope', '$filter', 'calculations'];

    function controller($scope, $filter, calculations) {
        var vm = this;

        vm.calculateFullSupplyCost = calculateFullSupplyCost;
        vm.calculateNonFullSupplyCost = calculateNonFullSupplyCost;
        vm.calculateTotalCost = calculateTotalCost;

        function calculateFullSupplyCost() {
            return calculateCost(true);
        }

        function calculateNonFullSupplyCost() {
            return calculateCost(false);
        }

        function calculateTotalCost() {
            return calculateCost();
        }

        function calculateCost(fullSupply) {
            var sum = 0;

            getLineItems(fullSupply).forEach(function(lineItem) {
                if (!lineItem.skipped) {
                    sum += calculations.totalCost(lineItem);
                }
            });

            return sum;
        }

        function getLineItems(fullSupply) {
            var lineItems;

            if (fullSupply === undefined) {
                lineItems = $scope.requisition.requisitionLineItems;
            } else {
                lineItems = $filter('filter')($scope.requisition.requisitionLineItems, {
                    $program: {
                        fullSupply: fullSupply
                    }
                });
            }

            return lineItems;
        }
    }

})();
