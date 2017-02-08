describe('ProofOfDeliveryManageController', function() {

    var vm, orderFactoryMock, $rootScope, loadingModalServiceMock, notificationServiceMock,
        right, programs, facility, user, deferred, orders, facilityService, authorizationService;

    beforeEach(function() {

        user = createObjWithId('user-one');

        right = createObjWithId('right-one');

        facility = {
            "id": "facility-one",
            "supportedPrograms": programs
        }

        programs = [
            createObjWithId('program-one'),
            createObjWithId('program-two')
        ];

        orders = [
            createOrder('order-one', 'RECEIVED'),
            createOrder('order-two', 'PICKING')
        ];

        module('proof-of-delivery-manage', function($provide) {
            orderFactoryMock = jasmine.createSpyObj('orderFactory', ['search']);
            loadingModalServiceMock = jasmine.createSpyObj('loadingModalService', ['open', 'close']);
            notificationServiceMock = jasmine.createSpyObj('notificationService', ['error']);

            $provide.factory('orderFactory', function() {
                return orderFactoryMock;
            });

            $provide.factory('loadingModalService', function() {
                return loadingModalServiceMock;
            });

            $provide.factory('notificationService', function() {
                return notificationServiceMock;
            });
        });

        inject(function($injector) {
            $rootScope = $injector.get('$rootScope');
            deferred = $injector.get('$q').defer();
            facilityService = $injector.get('facilityService');
            authorizationService = $injector.get('authorizationService');
            vm = $injector.get('$controller')('ProofOfDeliveryManageController', {
                user: user,
                facility: facility,
                homePrograms: programs,
                supervisedPrograms: programs
            });
        });
    });

    describe('initialization', function() {

        it('should assign requesting facility as home facility', function() {
            expect(vm.requestingFacilityId).toEqual(facility.id);
        });

        it('should assign programs as home programs', function() {
            expect(vm.programs).toEqual(homePrograms);
        });

        it('should assign selected program as undefined', function() {
            expect(vm.selectedProgramId).toEqual(undefined);
        });

    });

    describe('loadOrders', function() {

        beforeEach(function() {
            vm.requestingFacility = vm.requestingFacilities[0];
            vm.program = vm.programs[0];

            orderFactoryMock.search.andReturn(deferred.promise);
        });

        it('should open loading modal', function() {
            vm.loadOrders();

            expect(loadingModalServiceMock.open).toHaveBeenCalled();
        });

        it('should fetch orders from order factory with correct params', function() {
            vm.loadOrders();

            expect(orderFactoryMock.search).toHaveBeenCalledWith(
                'facility-one',
                'facility-three',
                'program-one'
            );
        });

        it('should set vm.orders', function() {
            vm.loadOrders();
            deferred.resolve(orders);
            $rootScope.$apply();

            expect(vm.orders).toEqual(orders);
        });

        it('should show error on failed request', function() {
            vm.loadOrders();
            deferred.reject();
            $rootScope.$apply();

            expect(notificationServiceMock.error).toHaveBeenCalledWith('msg.error.occurred');
        });

        it('should close loading modal', function() {
            vm.loadOrders();
            deferred.resolve();
            $rootScope.$apply();

            expect(loadingModalServiceMock.close).toHaveBeenCalled();
        });
    });

    describe('updateFacilityType', function() {
        it("should load proper data for supervised facility", function() {
            vm.updateFacilityType(true);

            expect(vm.requestingFacilities).toEqual([]);
            expect(vm.programs).toEqual(vm.supervisedPrograms);
            expect(vm.requestingFacilityId).toEqual(undefined);
        });

        it("should load proper data for home facility", function() {
            vm.updateFacilityType(false);

            expect(vm.requestingFacilities).toEqual([facility]);
            expect(vm.programs).toEqual(vm.homePrograms);
            expect(vm.requestingFacilityId).toEqual(facility.id);
        });
    });

    describe('loadFacilitiesForProgram', function() {
        it("should load list of facilities for selected program", function() {
            spyOn(facilityService, 'getUserSupervisedFacilities').andReturn([facility]);
            spyOn(authorizationService, 'getRightByName').andReturn(right);

            vm.loadFacilitiesForProgram(vm.supervisedPrograms[0]);

            expect(vm.requestingFacilities).toEqual([facility]);
        });

        it("should return empty list of facilities for undefined program", function() {
            vm.loadFacilitiesForProgram(undefined);

            expect(vm.requestingFacilities).toEqual([]);
        });
    });

});

function createObjWithId(id) {
    return {
        id: id
    };
}

function createOrder(id, status) {
    return {
        id: id,
        status: status
    };
}
