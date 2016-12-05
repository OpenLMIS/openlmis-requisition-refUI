/*
 * This program is part of the OpenLMIS logistics management information system platform software.
 * Copyright © 2013 VillageReach
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
 *  
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License along with this program.  If not, see http://www.gnu.org/licenses.  For additional information contact info@OpenLMIS.org. 
 */

(function(){
  "use strict";

  /**
   * @ngdoc service
   * @name openlmis-dashboard.NavigationService
   *
   * @description
   * Reads routes set in UI-Router and returns all routes that are visible to the user.
   *
   * When writting UI-Router routes, set the route with 'showInNavigation: true' which will add the route to the navigation service. The parent state from the UI-Router definition is used to create a hiearchy for navigation states.
   *
   * TODO: Check if a user has authorization to view the URL
   *
   */

    angular
        .module('openlmis-dashboard')
        .service('NavigationService', NavigationService);

    NavigationService.$inject = ['$state', 'AuthorizationService', 'NavigationState'];

    function NavigationService($state, AuthorizationService, NavigationState) {
        var service = this;

        service.getStates = getStates;

        initialize();

        function initialize() {
            service.states = []

            $state.get().forEach(function(state) {
                if (state.showInNavigation) {
                    var states = service.states,
                        pieces = state.name.split('.').reverse(),
                        current;

                    while (pieces.length) {
                        var name = (current ? current.name : '') + '.' + pieces.pop();

                        current = getByName(states, name);

                        if (!current) {
                            current = new NavigationState(name);
                            states.push(current);
                        }

                        states = current.childStates;
                    }

                    current.label = state.label;
                    current.abstract = state.abstract;
                    current.main = service.states.indexOf(current) !== -1;
                }
            });
        }

        function getByName(states, name) {
            var match;
            states.forEach(function(state) {
                if (state.name === name) {
                    match = state;
                }
            });
            return match;
        }

        function getStates() {
            return service.states;
        }
    }

})();
