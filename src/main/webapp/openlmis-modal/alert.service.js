(function(){
    "use strict";

    /**
     * @ngdoc service
     * @name openlmis-modal.alertService
     *
     * @description
     * Service allows to display alert modal with custom message.
     */

    angular.module('openlmis-modal')
        .service('alertService', alertService);

    alertService.$inject = ['$timeout', '$q', '$rootScope', '$compile', '$templateRequest',
        '$templateCache', 'bootbox', 'messageService'
    ];

    function alertService($timeout, $q, $rootScope, $compile, $templateRequest, $templateCache,
        bootbox, messageService) {

        this.warning = warning;
        this.error = error;
        this.success = success;

        /**
         *
         * @ngdoc function
         * @name alertService
         * @methodOf openlmis-modal.alertService
         *
         * @description
         * Shows warning modal with custom message and returns promise.
         *
         * @param {String} message Primary message to display at the top
         * @param {String} additionalMessage Additional message to display below
         * @return {Promise} alert promise
         */
        function warning(message, additionalMessage) {
            var deferred = $q.defer();
            showAlert('glyphicon-alert', deferred.resolve, message, additionalMessage);
            return deferred.promise;
        }

        /**
         * @ngdoc function
         * @name error
         * @methodOf openlmis-modal.alertService
         *
         * @description
         * Shows alert modal with custom message and calls callback after closing alert.
         *
         * @param {String} message Message to display
         * @param {String} callback Function called after closing alert
         */
        function error(message, callback) {
            showAlert('glyphicon-remove-circle', callback, message);
        }

        /**
         * @ngdoc function
         * @name success
         * @methodOf openlmis-modal.alertService
         *
         * @description
         * Shows success modal with custom message and calls callback after closing alert.
         *
         * @param {String} message Message to display
         * @param {String} additionalMessage Additional message to display below
         * @param {String} callback Function called after closing alert
         */
        function success(message, additionalMessage, callback) {
            showAlert('glyphicon-ok-circle', callback, message, additionalMessage);
        }

        function showAlert(alertClass, callback, message, additionalMessage) {

            var templateURL = 'openlmis-modal/alert.html',
                template = $templateCache.get(templateURL);

            if (template){
                makeAlert(template);
            } else {
                $templateRequest(templateURL).then(makeAlert);
            }

            function makeAlert(html) {

                var modal,
                    scope = $rootScope.$new();

                scope.icon = alertClass;
                scope.message = message;
                if (additionalMessage) scope.additionalMessage = additionalMessage;

                modal = bootbox.dialog({
                    message: $compile(html)(scope),
                    callback: callback,
                    backdrop: true,
                    onEscape: callback ? callback : true,
                    closeButton: false,
                    className: 'alert-modal'
                });
                modal.on('click.bs.modal', function(){
                    if(callback) callback();
                    modal.modal('hide');
                });
                modal.on('hidden.bs.modal', function(){
                    angular.element(document.querySelector('.alert-modal')).remove();
                });
            }

        }


    }
})();
