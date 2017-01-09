describe('RequisitionSummaryCtrl', function() {

    var $filter, calculations, lineItems, vm;

    beforeEach(function() {

        module('requisition-view');

        lineItems = [
            createLineItem(5, 10.30, false, true),
            createLineItem(10, 2.3, false, true),
            createLineItem(3, 4.2, false, false),
            createLineItem(6, 2.3, false, false)
        ];

        inject(function(_$filter_, _calculations_, $controller) {
            $filter = _$filter_;
            calculations = _calculations_;
            vm = $controller('RequisitionSummaryCtrl', {
                $scope: {
                    requisition: {
                        requisitionLineItems: lineItems
                    }
                }
            });
        });

    });

    describe('calculateFullSupplyCost', function() {

        it('should calculate total cost correctly', function() {
            expect(vm.calculateFullSupplyCost()).toBe(74.6);
        });

        it('should include only full supply requisitions', function() {

        });

        it('should skip skipped lineItems', function() {

        });

    });

    function createLineItem(pricePerPack, packsToShip, skipped, fullSupply) {
        return {
            pricePerPack: pricePerPack,
            packsToShip: packsToShip,
            skipped: skipped,
            $program: {
                fullSupply: fullSupply
            }
        };
    }

});
