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

  angular.module('openlmis-auth')
  .run(authStateChangeInterceptor)

  /**
    * @ngdoc function
    * @name  openlmis-auth.authStateChangeInterceptor
    *
    * @description
    * When the UI-Router starts a state change, then the user's authentication is checked. If the user isn't authenticated, then they are shown the login page or login modal.
    *
    * Any route that the user visits within the openlmis-auth module they will be allowed to visit if they are not authenticated. Meaning if a user is authenticated, they won't be able to access the login or forgot password screens.
    *
    */
  authStateChangeInterceptor.$inject = ['$rootScope', '$state', 'AuthorizationService'];
  function authStateChangeInterceptor($rootScope, $state, AuthorizationService) {
    $rootScope.$on('$stateChangeStart', redirectAuthState);

    function redirectAuthState(event, toState, toParams, fromState, fromParams) {
      if(!AuthorizationService.isAuthenticated() && toState.name.indexOf('auth') != 0 && toState.name.indexOf('home') != 0){
        // if not authenticated and not on login page or home page
        event.preventDefault();
        $rootScope.$broadcast('event:auth-loginRequired', true);
      } else if(!AuthorizationService.isAuthenticated() &&  toState.name.indexOf('home') == 0){
        // if not authenticated and on home page
        event.preventDefault();
        $state.go('auth.login.form');
      } else if(AuthorizationService.isAuthenticated() && toState.name.indexOf('auth') == 0) {
        // if authenticated and on login page
        event.preventDefault();
        $state.go('home');
      } else if(toState.right && !AuthorizationService.hasRight(toState.right) ) {
        // if authenticated and on login page
        event.preventDefault();
      }
    }

    $rootScope.$on('auth.login', function(){
      $state.go('home');
    });

    $rootScope.$on('event:auth-loggedIn', function(){
      location.reload();
    });
  }

})();
