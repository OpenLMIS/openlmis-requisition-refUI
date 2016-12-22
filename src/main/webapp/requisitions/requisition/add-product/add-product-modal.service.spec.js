describe("AddProductModalService", function(){

    // injections
    var addProductModal, $ngBootbox, $rootScope, $q,

    // variables
    categories;

    beforeEach(function() {
        module('openlmis.requisitions');

        inject(function(_AddProductModalService_, _$ngBootbox_, _$rootScope_, _$q_){
            AddProductModalService = _AddProductModalService_;
            $ngBootbox = _$ngBootbox_;
            $rootScope = _$rootScope_;
            $q = _$q_;
        });


        categories = [
            {
                displayName: 'category1',
                isVisible: isVisible
            },
            {
                displayName: 'category2',
                isVisible: isVisible
            }
        ];
    });

    it('should open add product modal', function(){
        var spy = jasmine.createSpy();
        spyOn($ngBootbox, 'customDialog').andCallFake(spy);

        AddProductModalService.show(categories);
        $rootScope.$apply();

        expect(spy).toHaveBeenCalled();
    });

    it('should close add product modal', function(){
        var showSpy = jasmine.createSpy(),
            closeSpy = jasmine.createSpy();

        spyOn($ngBootbox, 'customDialog').andCallFake(showSpy);
        spyOn($ngBootbox, 'hideAll').andCallFake(closeSpy);

        AddProductModalService.show(categories).then(function() {
            result = true;
        }, function() {
            result = false;
        });
        $rootScope.$apply();

        expect(showSpy).toHaveBeenCalled();

        AddProductModalService.close();
        $rootScope.$apply();

        expect(closeSpy).toHaveBeenCalled();
        expect(result).toBe(false);
    });

    function isVisible() {
        return true;
    }
});