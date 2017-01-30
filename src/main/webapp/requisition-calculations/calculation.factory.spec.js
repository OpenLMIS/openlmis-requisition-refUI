describe('calculationFactory', function() {

    var calculationFactory, REQUISITION_STATUS, TEMPLATE_COLUMNS, lineItem, requisitionMock,
        templateMock;

    beforeEach(module('requisition-calculations'));

    var lineItemInject = inject(function(_calculationFactory_, _REQUISITION_STATUS_,
                                         _TEMPLATE_COLUMNS_) {
        calculationFactory = _calculationFactory_;
        REQUISITION_STATUS = _REQUISITION_STATUS_;
        TEMPLATE_COLUMNS = _TEMPLATE_COLUMNS_;

        lineItem = {
            orderable: {},
            totalLossesAndAdjustments: 25,
            beginningBalance: 20,
            totalConsumedQuantity: 15,
            totalReceivedQuantity: 10,
            stockOnHand: 5
        };

        requisitionMock = jasmine.createSpyObj('requisition', ['$isAuthorized']);
        templateMock = jasmine.createSpyObj('template', ['getColumn']);
        requisitionMock.template = templateMock;
    });

    describe('Calculate packs to ship', function(){
        beforeEach(function() {
            lineItemInject();

            templateMock.getColumn.andReturn({
                name: 'requestedQuantity',
                display: true
            });
        });

        it('should return zero if pack size is zero', function() {
            lineItem.orderable.packSize = 0;

            expect(calculationFactory.packsToShip(lineItem, requisitionMock)).toBe(0);
        });

        it('should return zero if approved quantity is zero', function() {
            requisitionMock.$isAuthorized.andReturn(true);

            lineItem.approvedQuantity = 0;

            expect(calculationFactory.packsToShip(lineItem, requisitionMock)).toBe(0);
        });

        it('should return zero if requested quantity is zero', function() {
            requisitionMock.$isAuthorized.andReturn(false);

            lineItem.requestedQuantity = 0;

            expect(calculationFactory.packsToShip(lineItem, requisitionMock)).toBe(0);
        });

        it('should not round packs to ship if threshold is not exceeded', function() {
            requisitionMock.$isAuthorized.andReturn(false);

            lineItem.requestedQuantity = 15;
            lineItem.orderable.packSize = 10;
            lineItem.orderable.packRoundingThreshold = 6;

            expect(calculationFactory.packsToShip(lineItem, requisitionMock)).toBe(1);
        });

        it ('should round packs to ship if threshold is exceeded', function() {
            requisitionMock.$isAuthorized.andReturn(false);

            lineItem.requestedQuantity = 15;
            lineItem.orderable.packSize = 10;
            lineItem.orderable.packRoundingThreshold = 4;

            expect(calculationFactory.packsToShip(lineItem, requisitionMock)).toBe(2);
        });

        it ('should return zero if round to zero is set', function() {
            requisitionMock.$isAuthorized.andReturn(false);

            lineItem.requestedQuantity = 1;
            lineItem.orderable.packSize = 10;
            lineItem.orderable.packRoundingThreshold = 5;
            lineItem.orderable.roundToZero = true;

            expect(calculationFactory.packsToShip(lineItem, requisitionMock)).toBe(0);
        });

        it ('should return one if round to zero is not set', function() {
            requisitionMock.$isAuthorized.andReturn(false);

            lineItem.requestedQuantity = 1;
            lineItem.orderable.packSize = 10;
            lineItem.orderable.packRoundingThreshold = 5;
            lineItem.orderable.roundToZero = false;

            expect(calculationFactory.packsToShip(lineItem, requisitionMock)).toBe(1);
        });

        it ('should calculate total properly', function() {
            expect(calculationFactory.total(lineItem)).toBe(30);
        });

        it ('should calculate stock on hand properly', function() {
            expect(calculationFactory.stockOnHand(lineItem)).toBe(40);
        });

        it ('should calculate total consumed quantity', function() {
            expect(calculationFactory.totalConsumedQuantity(lineItem)).toBe(50);
        });

        it ('should calculate total cost', function() {
            lineItem.pricePerPack = 30.20;
            lineItem.packsToShip = 4;

            expect(calculationFactory.totalCost(lineItem)).toBe(120.8);
        });

        it ('should calculate zero total cost if value missing', function() {
            lineItem.pricePerPack = undefined;
            lineItem.packsToShip = 4;

            expect(calculationFactory.totalCost(lineItem)).toBe(0);

            lineItem.pricePerPack = 4;
            lineItem.packsToShip = undefined;

            expect(calculationFactory.totalCost(lineItem)).toBe(0);

            lineItem.pricePerPack = undefined;
            lineItem.packsToShip = undefined;

            expect(calculationFactory.totalCost(lineItem)).toBe(0);
        });

    });

    describe('Calculate total losses and adjustments', function() {
        var _additive__;
        beforeEach(module(function($provide) {
            var filter = function() {
                return [{
                    additive: _additive_,
                }];
            };

            $provide.value('filterFilter', filter);
        }));

        beforeEach(lineItemInject);

        it ('should return zero when calculating totalLossesAndAdjustments and no reason present', function() {
            expect(calculationFactory.totalLossesAndAdjustments(lineItem, {})).toBe(0);
        });

        it ('should use positive values when calculating totalLossesAndAdjustments and additive parameter is true', function() {
            _additive_ = true;
            lineItem.stockAdjustments = [
                {
                    quantity:10
                },
                {
                    quantity:1
                }
            ];
            expect(calculationFactory.totalLossesAndAdjustments(lineItem, {})).toBe(11);
        });

        it ('should use negative values when calculating totalLossesAndAdjustments and additive parameter is false', function() {
            _additive_ = false;
            lineItem.stockAdjustments = [
                {
                    quantity:10
                },
                {
                    quantity:1
                }
            ];
            expect(calculationFactory.totalLossesAndAdjustments(lineItem, {})).toBe(-11);
        });
    });

    describe('Calculate adjusted consumption', function() {
        beforeEach(lineItemInject);
        var period = {
            durationInMonths: 1
        };

        it('should return total consumed quantity when non-stockout days is zero', function() {
            lineItem.totalStockoutDays = 30;
            expect(calculationFactory.adjustedConsumption(lineItem, {processingPeriod: period})).toBe(lineItem.totalConsumedQuantity);
        });

        it('should return zero when consumed quantity is not defined', function() {
            lineItem.totalConsumedQuantity = 0;
            expect(calculationFactory.adjustedConsumption(lineItem, {processingPeriod: period})).toBe(0);
        });

        it('should calculate adjusted consumption', function() {
            lineItem.totalStockoutDays = 15;
            expect(calculationFactory.adjustedConsumption(lineItem, {processingPeriod: period})).toBe(30);
        });
    });

    describe('Calculate Maximum Stock Quantity', function () {

        var column;

        beforeEach(function() {
            lineItemInject();

            column = {
                name: 'maximumStockQuantity',
                option: {
                    optionName: 'default'
                }
            };

            templateMock.getColumn.andCallFake(function(name) {
                if (name === TEMPLATE_COLUMNS.MAXIMUM_STOCK_QUANTITY) return column;
            });
        });

        it('should return zero if requisition template does not contain maximumStockQuantity column', function () {
            templateMock.getColumn.andReturn(undefined);
            expect(calculationFactory.maximumStockQuantity(lineItem, requisitionMock)).toBe(0);
        });

        it ('should return zero if selected option is not equal to default', function () {
            column.option.optionName = 'test_option';
            expect(calculationFactory.maximumStockQuantity(lineItem, requisitionMock)).toBe(0);
        });

        it('should return maximum stock quantity when default option was selected', function () {
            lineItem.maxMonthsOfStock = 7.25;
            lineItem.averageConsumption = 2;

            column.option.optionName = 'default';

            expect(calculationFactory.maximumStockQuantity(lineItem, requisitionMock)).toBe(15);
        });
    });

    describe('calculatedOrderQuantity', function() {

        var stockOnHandColumn, maximumStockQuantityColumn, COLUMN_SOURCES;

        beforeEach(function() {
            spyOn(calculationFactory, 'stockOnHand');
            spyOn(calculationFactory, 'maximumStockQuantity');

            inject(function(_COLUMN_SOURCES_) {
                COLUMN_SOURCES = _COLUMN_SOURCES_;
            });

            stockOnHandColumn = {
                name: TEMPLATE_COLUMNS.STOCK_ON_HAND,
                source: COLUMN_SOURCES.USER_INPUT
            };

            maximumStockQuantityColumn = {
                name: TEMPLATE_COLUMNS.MAXIMUM_STOCK_QUANTITY,
                source: COLUMN_SOURCES.USER_INPUT
            };

            requisitionMock = {
                template: templateMock
            };

            templateMock.getColumn.andCallFake(function(name) {
                if (name === TEMPLATE_COLUMNS.STOCK_ON_HAND) return stockOnHandColumn;
                if (name === TEMPLATE_COLUMNS.MAXIMUM_STOCK_QUANTITY) return maximumStockQuantityColumn;
            });
        });

        it('should return null if stock on hand column is not present', function() {
            templateMock.getColumn.andCallFake(function(name) {
                if (name === TEMPLATE_COLUMNS.MAXIMUM_STOCK_QUANTITY) return maximumStockQuantityColumn;
            });
            expect(calculationFactory.calculatedOrderQuantity(lineItem, requisitionMock)).toBe(null);
        });

        it('should return null if maximum stock quantity column is not present', function() {
            templateMock.getColumn.andCallFake(function(name) {
                if(name === TEMPLATE_COLUMNS.STOCK_ON_HAND) return stockOnHandColumn;
            });
            expect(calculationFactory.calculatedOrderQuantity(lineItem, requisitionMock)).toBe(null);
        });

        it('should not call calculation if the stockOnHand is not calculated', function() {
            calculationFactory.calculatedOrderQuantity(lineItem, requisitionMock);

            expect(calculationFactory.stockOnHand).not.toHaveBeenCalled();
        });

        it('should not call calculation if the maximum stock quantity is not calculated', function() {
            calculationFactory.calculatedOrderQuantity(lineItem, requisitionMock);

            expect(calculationFactory.maximumStockQuantity).not.toHaveBeenCalled();
        });

        it('should call calculation if stockOnHand is calculated', function() {
            stockOnHandColumn.source = COLUMN_SOURCES.CALCULATED;

            calculationFactory.calculatedOrderQuantity(lineItem, requisitionMock);

            expect(calculationFactory.stockOnHand).toHaveBeenCalledWith(lineItem, requisitionMock);
        });

        it('should call calculation if maximum stock quantity is calculated', function() {
            maximumStockQuantityColumn.source = COLUMN_SOURCES.CALCULATED;

            calculationFactory.calculatedOrderQuantity(lineItem, requisitionMock);

            expect(calculationFactory.maximumStockQuantity).toHaveBeenCalledWith(lineItem, requisitionMock);
        });

        it('should calculate properly if both fields are user inputs', function() {
            lineItem.stockOnHand = 5;
            lineItem.maximumStockQuantity = 12;

            result = calculationFactory.calculatedOrderQuantity(lineItem, requisitionMock);

            expect(result).toBe(7);
        });

        it('should calculate properly if both fields are calculate', function() {
            stockOnHandColumn.source = COLUMN_SOURCES.CALCULATED;
            maximumStockQuantityColumn.source = COLUMN_SOURCES.CALCULATED;
            calculationFactory.stockOnHand.andReturn(6);
            calculationFactory.maximumStockQuantity.andReturn(14);

            result = calculationFactory.calculatedOrderQuantity(lineItem, requisitionMock);

            expect(result).toBe(8);
        });

        it('should calculate properly if on field is calculated', function() {
            maximumStockQuantityColumn.source = COLUMN_SOURCES.CALCULATED;
            lineItem.stockOnHand = 9;
            calculationFactory.maximumStockQuantity.andReturn(145);

            result = calculationFactory.calculatedOrderQuantity(lineItem, requisitionMock);

            expect(result).toBe(136);
        });

    });

});
