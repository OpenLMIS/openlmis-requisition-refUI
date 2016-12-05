(function() {

    'use strict';

    angular
        .module('openlmis-dashboard')
        .factory('NavigationState', factory);

    function factory() {

        NavigationState.prototype.hasChildStates = hasChildStates;

        return NavigationState;

        function NavigationState(name, label, abstract) {
            this.name = name;
            this.label = label;
            this.abstract = abstract;
            this.main = false;
            this.childStates = [];
        }

        function hasChildStates() {
            return this.childStates.length > 0;
        }

        function hasSubmenu() {
            return this.main && this.hasChildStates();
        }

    }

})();
