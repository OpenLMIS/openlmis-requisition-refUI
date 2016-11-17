(function() {
	
	'use strict';

	/**
	 * @ngdoc service
	 * @name  openlmis.requisitions.LineItem
	 *
	 * @description 
	 * Responsible for extending passed line item with validation and value functions.
	 */
	angular
		.module('openlmis.requisitions')
		.factory('LineItem', lineItem);

	lineItem.$inject = ['ValidationFactory', 'CalculationFactory', 'Column', 'Source'];

	function lineItem(ValidationFactory, CalculationFactory, Column, Source) {

		var validationsToPass = {
			stockOnHand: [
				ValidationFactory.nonNegative,
			],
			totalConsumedQuantity: [
				ValidationFactory.nonNegative
			],
			requestedQuantityExplanation: [
				ValidationFactory.nonEmptyIfPropertyIsSet(Column.REQUESTED_QUANTITY)
			]
		};

		var counterparts = {
			stockOnHand: Column.TOTAL_CONSUMED_QUANTITY,
			totalConsumedQuantity: Column.STOCK_ON_HAND
		};

		LineItem.prototype.$isValid = isValid;
		LineItem.prototype.$getColumnError = getColumnError;
		LineItem.prototype.$areColumnsValid = areColumnsValid;
		LineItem.prototype.$isColumnValid = isColumnValid;
		LineItem.prototype.$getColumnValue = getColumnValue;

		return LineItem;

		function LineItem(lineItem) {
			angular.merge(this, lineItem);
			this.$errors = {};
		}

		function isValid() {
			var isValid = true;

			angular.forEach(this.$errors, function(error) {
				isValid = isValid && !error;
			});

			return isValid;
		}

		function isColumnValid(column, columns) {
			var lineItem = this,
					error;

			if (column.required) {
				error = error || ValidationFactory.nonEmpty(lineItem[column.name]);
			}

			angular.forEach(validationsToPass[column.name], function(validation) {
				error = error || validation(lineItem[column.name], lineItem);
			});

			var calulation = CalculationFactory[column.name];
			if (calulation && column.name !== Column.TOTAL_LOSSES_AND_ADJUSTMENTS) {
				if (!isCalculated(counterparts[column.name], columns)) {
					error = error || ValidationFactory.validCalculation(calulation)(lineItem[column.name], lineItem);
				}
			}

			this.$errors[column.name] = error;
			return !error;
		}

		function areColumnsValid(columns) {
			var lineItem = this,
					areValid = true;

			angular.forEach(columns, function(column) {
				if (column.display) {
					areValid = lineItem.$isColumnValid(column, columns) && areValid;
				}
			});

			return areValid;
		}

		function getColumnError(name) {
			return this.$errors[name];
		}

		function errors() {
			var errors = {};
			return function(newErrors) {
				return arguments.length ? (errors = newErrors) : errors;
			}
		}

		function getColumnValue(column, status) {
			var name = column.name,
				value;

			if (name.indexOf('.') > -1) { // for product code and product name
				value = this;
				angular.forEach(name.split('.'), function(property) { 
					value = value[property];
				});
				return value;
			}

			if (column.source === Source.CALCULATED) {
				this[name] = CalculationFactory[name](this, status);
				this.$isColumnValid(column);
			}

			return this[name];
		}

		function isCalculated(name, columns) {
			var calculated = false;
			angular.forEach(columns, function(column) {
				calculated = calculated || (column.name == name && column.source === Source.CALCULATED);
			});
			return calculated;
		}
	};

})();