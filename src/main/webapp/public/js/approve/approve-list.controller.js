(function() {

	'use strict';

  angular.module('rnr').controller('ApproveListCtrl', ApproveListCtrl);

  ApproveListCtrl.$inject = ['$scope', 'requisitionList', '$location', 'messageService'];

  function ApproveListCtrl($scope, requisitionList, $location, messageService) {
    $scope.requisitions = requisitionList;
    $scope.filteredRequisitions = $scope.requisitions;
    $scope.selectedItems = [];

    $scope.gridOptions = { data: 'filteredRequisitions',
      showFooter: false,
      showSelectionCheckbox: false,
      enableColumnResize: true,
      showColumnMenu: false,
      sortInfo: { fields: ['submittedDate'], directions: ['asc'] },
      showFilter: false,
      rowTemplate: '<div ng-mouseover="rowStyle={\'background-color\': \'red\'}; grid.appScope.onRowHover(this);" ng-mouseleave="rowStyle={}"><div ng-click="grid.appScope.openRnr(row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" class="ui-grid-cell" ng-class="col.colIndex()" ui-grid-cell></div></div>',
      columnDefs: [
        {field: 'programName', displayName: messageService.get("program.header") },
        {field: 'facilityCode', displayName: messageService.get("option.value.facility.code")},
        {field: 'facilityName', displayName: messageService.get("option.value.facility.name")},
        {field: 'facilityType', displayName: messageService.get("option.value.facility.type")},
        {field: 'districtName', displayName: messageService.get("option.value.facility.district")},
        {field: 'stringPeriodStartDate', displayName: messageService.get("label.period.start.date")},
        {field: 'stringPeriodEndDate', displayName: messageService.get("label.period.end.date")},
        {field: 'stringSubmittedDate', displayName: messageService.get("label.date.submitted")},
        {field: 'stringModifiedDate', displayName: messageService.get("label.date.modified")},
        {name: 'emergency', displayName: messageService.get("requisition.type.emergency"),
          cellTemplate: '<div class="ngCellText checked"><i ng-class="{\'icon-ok\': row.entity.emergency}"></i></div>',
          width: 110 }
      ]
    };

    $scope.openRnr = function (row) {
      alert(row.entity.facilityId);
      $scope.$parent.period = {'startDate': $scope.selectedItems[0].periodStartDate, 'endDate': $scope.selectedItems[0].periodEndDate};
      $location.url("rnr-for-approval/" + $scope.selectedItems[0].id + '/' + $scope.selectedItems[0].programId + '?supplyType=fullSupply&page=1');
    };

    $scope.filterRequisitions = function () {
      $scope.filteredRequisitions = [];
      var query = $scope.query || "";
      var searchField = $scope.searchField;

      $scope.filteredRequisitions = $.grep($scope.requisitions, function (rnr) {
        return (searchField) ? contains(rnr[searchField], query) : matchesAnyField(query, rnr);
      });

      $scope.resultCount = $scope.filteredRequisitions.length;
    };

    function contains(string, query) {
      return string.toLowerCase().indexOf(query.toLowerCase()) != -1;
    }

    function matchesAnyField(query, rnr) {
      var rnrString = "|" + rnr.programName + "|" + rnr.facilityName + "|" + rnr.facilityCode + "|";
      return contains(rnrString, query);
    }
  }

})();