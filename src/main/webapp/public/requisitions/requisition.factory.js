(function() {
	
	'use strict';

	angular
		.module('openlmis.requisitions')
		.factory('requisition', requisition);

  requisition.$inject = ['$q', '$resource', 'RequisitionURL', 'ColumnTemplateFactory', 'lineItem', 'Status', 'Source', 'Column'];

  function requisition($q, $resource, RequisitionURL, ColumnTemplateFactory, lineItem, Status, Source, Column) {
    var resource = $resource(RequisitionURL('/api/requisitions/:id'), {}, {
      'authorize': {
        url: RequisitionURL('/api/requisitions/:id/authorize'),
        method: 'POST'
      },
      'save': {
        method: 'PUT',
        transformRequest: transformRequisition
      },
      'submit': {
        url: RequisitionURL('/api/requisitions/:id/submit'),
        method: 'POST'
      },
      'approve': {
        url: RequisitionURL('/api/requisitions/:id/approve'),
        method: 'POST'
      },
      'reject': {
        url: RequisitionURL('/api/requisitions/:id/reject'),
        method: 'PUT'
      }
    });

    return extendRequisition;

    function extendRequisition(requisition) {
      requisition.$getColumnTemplates = getColumnTemplates;
      requisition.$columnTemplates = columnTemplates();
      requisition.$authorize = authorize;
      requisition.$save = save;
      requisition.$submit = submit;
      requisition.$remove = remove;
      requisition.$approve = approve;
      requisition.$reject = reject;
      requisition.$isValid = isValid;
      requisition.$isInitiated = isInitiated;
      requisition.$isSubmitted = isSubmitted;
      requisition.$isApproved = isApproved;
      requisition.$isAuthorized = isAuthorized;
      angular.forEach(requisition.requisitionLineItems, lineItem);
      return requisition;
    }

    function getColumnTemplates() {
      var deferred = $q.defer(),
          requisition = this;

      ColumnTemplateFactory.getColumnTemplates(this).then(function(columnTemplates) {
        deferred.resolve(requisition.$columnTemplates(columnTemplates));
      }, function(error) {
        deferred.reject(error);
      });

      return deferred.promise;
    }

    function columnTemplates() {
      var columnTemplates = [];
      return function(newColumnTemplates) {
        return arguments.length ? (columnTemplates = newColumnTemplates) : columnTemplates;
      };
    }

    function authorize() {
      return resource.authorize({
        id: this.id
      }, {}).$promise;
    }

    function remove() {
      return resource.remove({
        id: this.id
      }).$promise;
    }

    function save() {
      return resource.save({
        id: this.id
      },this).$promise;
    }

    function submit() {
      return resource.submit({
        id: this.id
      }, {}).$promise;
    }

    function approve() {
      return resource.approve({
        id: this.id
      }, {}).$promise;
    }

    function reject() {
      return resource.reject({
        id: this.id
      }, {}).$promise;
    }

    function isInitiated() {
      return this.status === Status.INITIATED;
    }

    function isSubmitted() {
      return this.status === Status.SUBMITTED;
    }

    function isAuthorized() {
      return this.status === Status.AUTHORIZED;
    }

    function isApproved() {
      return this.status === Status.APPROVED;
    }

    function isValid() {
      var columnTemplates = this.$columnTemplates(),
          isValid = true;

      angular.forEach(this.requisitionLineItems, function(lineItem) {
        isValid = lineItem.$areColumnsValid(columnTemplates) && isValid;
      });

      return isValid;
    }

    function transformRequisition(requisition) {
      var fieldsToNull = getFieldsToNull(requisition.$columnTemplates());
      angular.forEach(requisition.requisitionLineItems, function(lineItem) {
        transformLineItem(lineItem, fieldsToNull);
      })
      return angular.toJson(requisition);
    }

    function transformLineItem(lineItem, fieldsToNull) {
      angular.forEach(fieldsToNull, function(fieldToNull) {
        lineItem[fieldToNull] = null;
      });
    }

    function getFieldsToNull(columnTemplates) {
      var fieldsToNull = [];

      angular.forEach(Column, function(column) {
        fieldsToNull.push(column);
      });

      angular.forEach(columnTemplates, function(column) {
        var index = fieldsToNull.indexOf(column.name);
        if (index > -1 && column.source !== Source.CALCULATED) {
          fieldsToNull.splice(index, 1);
        }
      });

      return fieldsToNull;
    }
  }

})();