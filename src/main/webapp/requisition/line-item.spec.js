describe('LineItem', function() {

    var LineItem, requisitionLineItem, requisition, program, calculationFactory, template;

    beforeEach(function() {
        module('requisition');

        calculationFactory = jasmine.createSpyObj('calculationFactory', ['totalCost', 'adjustedConsumption']);
        calculationFactory.totalCost.andReturn(20);

        module(function($provide) {
            $provide.factory('calculationFactory', function() {
                return calculationFactory;
            });
        });

        inject(function(_LineItem_) {
            LineItem = _LineItem_;
        });

        var template = jasmine.createSpyObj('template', ['getColumns']);
        template.columns = [
            {
                name: 'requestedQuantity',
                source: 'USER_INPUT',
                type: 'NUMERIC',
                display: true
            },
            {
                name: 'requestedQuantityExplanation',
                source: 'USER_INPUT',
                type: 'TEXT',
                display: true
            },
            {
                name: 'totalCost',
                source: 'CALCULATED',
                type: 'NUMERIC',
                display: true
            },
            {
                name: 'adjustedConsumption',
                source: 'CALCULATED',
                type: 'NUMERIC',
                display: true
            },
            {
                name: 'columnWithoutCalculations',
                source: 'CALCULATED',
                type: 'NUMERIC',
                display: true
            }
        ];
        template.getColumns.andCallFake(function (nonFullSupply) {
            return template.columns;
        });

        program = {
            id: '1',
            name: 'program1'
        };
        requisitionLineItem = {
            $program: {
                fullSupply: true
            },
            orderable: {
                id: '1',
                name: 'product',
                productCode: 'P1',
                programs: [
                    {
                        programId: program.id
                    }
                ]
            },
            requestedQuantity: 10,
            requestedQuantityExplanation: 'explanation'
        };
        requisition = jasmine.createSpyObj('requisition', ['$isApproved', '$isAuthorized', '$isApprovable']);
        requisition.$isApproved.andReturn(false);
        requisition.$isAuthorized.andReturn(false);
        requisition.requisitionLineItems = [requisitionLineItem];
        requisition.program = program;
        requisition.status = 'SUBMITTED';
        requisition.template = template;
        requisition.processingPeriod = {
            startDate: [2016, 4, 1],
            endDate: [2016, 4, 30]
        };
    });

    it('should add needed properties and methods to requisition line item', function() {
        var lineItem = new LineItem(requisitionLineItem, requisition);

        expect(lineItem.orderable).toEqual(requisitionLineItem.orderable);
        expect(lineItem.$errors).toEqual({});
        expect(lineItem.$program).toEqual(requisitionLineItem.orderable.programs[0]);
        expect(angular.isFunction(lineItem.getFieldValue)).toBe(true);
        expect(angular.isFunction(lineItem.updateFieldValue)).toBe(true);
    });

    describe('updateFieldValue', function() {

        it('should not update values in line item if they are set', function() {
            var lineItem = new LineItem(requisitionLineItem, requisition);

            lineItem.updateFieldValue(requisition.template.columns[0], requisition);
            lineItem.updateFieldValue(requisition.template.columns[1], requisition);

            expect(lineItem.requestedQuantity).toEqual(requisitionLineItem.requestedQuantity);
            expect(lineItem.requestedQuantityExplanation).toEqual(requisitionLineItem.requestedQuantityExplanation);
        });

        it('should update values in line item if they are undefined', function() {
            var lineItem = new LineItem(requisitionLineItem, requisition);

            lineItem.requestedQuantity = undefined;
            lineItem.requestedQuantityExplanation = undefined;
            lineItem.totalCost = undefined;

            lineItem.updateFieldValue(requisition.template.columns[0], requisition);
            lineItem.updateFieldValue(requisition.template.columns[1], requisition);
            lineItem.updateFieldValue(requisition.template.columns[2], requisition);

            expect(lineItem.requestedQuantity).toEqual(0);
            expect(lineItem.requestedQuantityExplanation).toEqual('');
            expect(lineItem.totalCost).toEqual(20);
        });

        it('should call proper calculation method when column name is Adjusted Consumption', function() {
            var lineItem = new LineItem(requisitionLineItem, requisition);
            lineItem.updateFieldValue(requisition.template.columns[3], requisition);

            expect(calculationFactory.adjustedConsumption).toHaveBeenCalledWith(lineItem, requisition);
        });

        it('should call proper calculation method when column name is calculated and not Adjusted Consumption', function() {
            var lineItem = new LineItem(requisitionLineItem, requisition);
            lineItem.updateFieldValue(requisition.template.columns[2], requisition);

            expect(calculationFactory.totalCost).toHaveBeenCalledWith(lineItem, requisition);
        });

        it('should set null if there is no calculation method for given column', function() {
            var lineItem = new LineItem(requisitionLineItem, requisition);
            lineItem.columnWithoutCalculations = 100;
            
            lineItem.updateFieldValue(requisition.template.columns[4], requisition);

            expect(lineItem.columnWithoutCalculations).toBe(null);
        });
    });

    describe('canBeSkipped', function() {

        it('should return true if line item can be skipped', function() {
            var lineItem = new LineItem(requisitionLineItem, requisition);

            lineItem.requestedQuantity = 0;
            lineItem.requestedQuantityExplanation = '';

            var result = lineItem.canBeSkipped(requisition);

            expect(result).toBe(true);
       });

       it('should return false if line item cannot be skipped', function() {
            var lineItem = new LineItem(requisitionLineItem, requisition);

            lineItem.requestedQuantity = 100;
            lineItem.requestedQuantityExplanation = 'we need more';

            var result = lineItem.canBeSkipped(requisition);

            expect(result).toBe(false);
       });

        it('should return false if requisition status is authorized', function() {
            var lineItem = new LineItem(requisitionLineItem, requisition);

            lineItem.requestedQuantity = 0;
            lineItem.requestedQuantityExplanation = '';
            requisition.$isApprovable.andReturn(true);

            var result = lineItem.canBeSkipped(requisition);

            expect(result).toBe(false);
        });

        it('should return false if requisition status is approved', function() {
            var lineItem = new LineItem(requisitionLineItem, requisition);

            lineItem.requestedQuantity = 0;
            lineItem.requestedQuantityExplanation = '';
            requisition.$isApproved.andReturn(true);

            var result = lineItem.canBeSkipped(requisition);

            expect(result).toBe(false);
        });
    });
});
