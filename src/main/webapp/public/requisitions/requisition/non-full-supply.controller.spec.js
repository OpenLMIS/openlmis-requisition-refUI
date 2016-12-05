describe('NonFullSupplyCtrl', function() {

    var vm, requisitionValidator, RequisitionCategory, AddProductModalService, requisition, q,
        rootScope, controller;

    beforeEach(function(){
        module('openlmis.requisitions');

        inject(function($q, $controller, $rootScope) {
            controller = $controller;
            rootScope = $rootScope;
            q = $q;
        });

        requisitionValidator = jasmine.createSpyObj('requisitionValidator', ['isLineItemValid']);
        AddProductModalService = jasmine.createSpyObj('AddProductModalService', ['show']);

        requisition = jasmine.createSpyObj('requisition', ['$isApproved', '$isAuthorized']);
        requisition.$template = jasmine.createSpyObj('Template', ['getColumns']);
        requisition.requisitionLineItems = [
            lineItemSpy(0, 'One', true),
            lineItemSpy(1, 'Two', true),
            lineItemSpy(2, 'One', true),
            lineItemSpy(3, 'Two', true),
            lineItemSpy(4, 'Three', false)
        ];
    });

    describe('initialization', function() {

        it('should bind requisitionValidator.isLineItemValid method to vm', function() {
            requisition.$isApproved.andReturn(false);
            requisition.$isAuthorized.andReturn(false);

            initController();

            expect(vm.isLineItemValid).toBe(requisitionValidator.isLineItemValid);
        });

        it('should bind requisition property to vm', function() {
            requisition.$isApproved.andReturn(false);
            requisition.$isAuthorized.andReturn(false);

            initController();

            expect(vm.requisition).toBe(requisition);
        });

        it('should bind columns property to vm', function() {
            requisition.$isApproved.andReturn(false);
            requisition.$isAuthorized.andReturn(false);

            initController();

            expect(vm.columns).toBe(requisition.$template.getColumns());
        });

        it('should bind requisitionLineItems property to vm', function() {
            requisition.$isApproved.andReturn(false);
            requisition.$isAuthorized.andReturn(false);

            initController();

            expect(vm.lineItems).toBe(requisition.requisitionLineItems);
        });

        it('should display add product button if reqisition is not authorized nor approved', function() {
            requisition.$isApproved.andReturn(false);
            requisition.$isAuthorized.andReturn(false);

            initController();

            expect(vm.displayAddProductButton).toBe(true);
        });

        it('should not display add product button if requisition is authorized', function() {
            requisition.$isApproved.andReturn(false);
            requisition.$isAuthorized.andReturn(true);

            initController();

            expect(vm.displayAddProductButton).toBe(false);
        });

        it('should not display add product button if requisition is approved', function() {
            requisition.$isApproved.andReturn(true);
            requisition.$isAuthorized.andReturn(false);

            initController();

            expect(vm.displayAddProductButton).toBe(false);
        });

    });

    describe('deleteLineItem', function() {

        beforeEach(function() {
            requisition.$isApproved.andReturn(false);
            requisition.$isAuthorized.andReturn(false);
            initController();
        });

        it('should delete line item if it exist', function() {
            var lineItem = requisition.requisitionLineItems[2];
            var product = lineItem.orderableProduct;

            vm.deleteLineItem(lineItem);

            expect(requisition.requisitionLineItems.length).toBe(4);
            expect(requisition.requisitionLineItems.indexOf(lineItem)).toBe(-1);
        });

        it('should make the product visible after deletion', function() {
            var lineItem = requisition.requisitionLineItems[2];
            var product = lineItem.orderableProduct;

            vm.deleteLineItem(lineItem);

            expect(product.$visible).toBe(true);
        });

        it('should not delete lineItem if it doesn\'t exist', function() {
            spyOn(requisition.requisitionLineItems, 'splice');

            vm.deleteLineItem(lineItemSpy(5, 'Three', false));

            expect(requisition.requisitionLineItems.length).toBe(5);
            expect(requisition.requisitionLineItems.splice).not.toHaveBeenCalled();
        });

        it('should not make the product visible if the item wasn\'t removed', function() {
            var lineItem = lineItemSpy(5, 'Three', false);
            var product = lineItem.orderableProduct;

            vm.deleteLineItem(lineItem);

            expect(product.$visible).toBe(false);
        });

    });

    describe('addProduct', function() {

        beforeEach(initController);

        it('should add product', function() {
            AddProductModalService.show.andReturn(q.when(lineItemSpy(5, 'Three', false)));

            vm.addProduct();
            rootScope.$apply();

            expect(requisition.requisitionLineItems.length).toBe(6);
        });

    });

    describe('displayDeleteColumn', function() {

    });

    function initController() {
        vm = controller('NonFullSupplyCtrl', {
            requisition: requisition,
            requisitionValidator: requisitionValidator,
            AddProductModalService: AddProductModalService
        });
    }

    function lineItemSpy(id, category, fullSupply) {
        return {
            $id: id,
            $program: {
                productCategoryDisplayName: category,
                fullSupply: fullSupply
            },
            orderableProduct: {
                $visible: false
            }
        };
    }

});
