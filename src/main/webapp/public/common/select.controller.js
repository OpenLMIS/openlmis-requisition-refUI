(function(){
    "use strict";

    angular.module("openlmis-core").controller("SelectController", SelectController);

    SelectController.$inject = ['$scope','$attrs']
    function SelectController($scope, $attrs) {
        $scope.selected = {};
        $scope.ngModel = $scope.selected;

        if ($scope.items.length < 11) {
            $scope.searchEnabled = false;
        } else {
            $scope.searchEnabled = true;
        }

    }
})();