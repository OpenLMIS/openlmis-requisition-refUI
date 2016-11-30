
 (function(){
  "use strict";

  /**
   * @ngdoc service
   * @name openlmis-common.AuthorizationService
   *
   * @description
   * This service is responsible for storing user authentication details, such as the current user's authorization rights and user object. This service only stores information, other services and factories are responsible for writing user information to the AuthorizationService. 
   * 
   */

  angular.module('openlmis-core')
    .service('AuthorizationService', AuthorizationService)

  var storageKeys = {
    'ACCESS_TOKEN': 'ACCESS_TOKEN',
    'USER_ID': 'USER_ID',
    'USERNAME': 'USERNAME',
    'USER_RIGHTS': 'RIGHTS',
    'USER_ROLE_ASSIGNMENTS': 'ROLE_ASSIGNMENTS'
  };

  AuthorizationService.$inject = ["$q", "localStorageService", "$injector"]
  function AuthorizationService ($q, localStorageService, $injector) {
    var service = {};

    service.isAuthenticated = isAuthenticated;

    service.getAccessToken = getAccessToken;
    service.setAccessToken = setAccessToken;
    service.clearAccessToken = clearAccessToken;

    service.preAuthorize = preAuthorize;
    service.preAuthorizeReporting = preAuthorizeReporting;
    service.hasPermission = hasPermission;

    service.getUser = getUser;
    service.setUser = setUser;
    service.clearUser = clearUser;
    service.getDetailedUser = getDetailedUser;

    service.clearRoleAssignments = clearRoleAssignments;
    service.setRoleAssignments = setRoleAssignments;
    service.getRoleAssignments = getRoleAssignments;
    service.hasRight = hasRight;

    var clientId, clientSecret;

    /**
     * @ngdoc function
     * @name  getAccessToken
     * @methodOf openlmis-common.AuthorizationService
     *
     * @description Retrives the current access token or returns false
     *
     * @returns {string} Current access token or false.
     * 
     */
    function getAccessToken(){
      var access_token = localStorageService.get(storageKeys.ACCESS_TOKEN);
      if(access_token){
        return access_token;
      } else {
        return false;
      }
    }

    /**
     *
     * @ngdoc function
     * @name  setAccessToken
     * @methodOf openlmis-common.AuthorizationService
     * @param {string} value Value to save as the access token
     *
     * @description Sets the access token
     *
     * @returns {boolean} Returns true if value successfully saved
     * 
     */
    function setAccessToken(value){
      return localStorageService.add(storageKeys.ACCESS_TOKEN, value);
    }

    /**
     * 
     * @ngdoc function
     * @name  clearAccessToken
     * @methodOf openlmis-common.AuthorizationService
     * @return {boolean} Returns true if access token was cleared
     * 
     */
    function clearAccessToken(){
      return localStorageService.remove(storageKeys.ACCESS_TOKEN);
    }

    /**
     * @ngdoc function
     * @name  isAuthenticated
     * @methodOf openlmis-common.AuthorizationService
     * @return {Boolean} Returns true if the current user is authenticated
     */
    function isAuthenticated(){;
        if(getAccessToken()){
            return true;
        } else {
            return false;
        }
    }

    /**
     * @ngdoc function
     * @name getUser
     * @methodOf openlmis-common.AuthorizationService
     * @return {Object} Returns at object with the current user's username and user_id
     */
    function getUser(){
      return {
        username: localStorageService.get(storageKeys.USERNAME),
        user_id: localStorageService.get(storageKeys.USER_ID)
      };
    }

    function getDetailedUser() {
      var user = getUser();
      return $injector.get('UserFactory').get(user.user_id);
    }

    /**
     * @ngdoc function
     * @name  getUser
     * @methodOf openlmis-common.AuthorizationService
     * 
     * @param {String} username Username for the current user
     * @param {String} user_id User ID for the current user
     *
     * @returns {Boolean} Returns true is user credentials successfully set
     *
     * @description Sets the user's name and password in local storages
     * 
     */
    function setUser(user_id, username){
      if( localStorageService.add(storageKeys.USERNAME, username) &&
        localStorageService.add(storageKeys.USER_ID, user_id)){
        return true;
      } else {
        return false;
      }
    }

    /**
     * @ngdoc function
     * @name clearUser
     * @methodOf openlmis-common.AuthorizationService
     * 
     * @returns {Boolean} Returns true if user details successfully cleared
     */
    function clearUser(){
      localStorageService.remove(storageKeys.USERNAME);
      localStorageService.remove(storageKeys.USER_ID);
    }

    /**
     * @ngdoc function
     * @name setRoleAssignments
     * @methodOf openlmis-common.AuthorizationService
     *
     * @param {Array} An array of user's role assignments
     */
    function setRoleAssignments(roleAssignments) {
        if(!roleAssignments) roleAssignments = defaultRoleAssignments;
        var roleAssignments = JSON.stringify(roleAssignments);
        localStorageService.add(storageKeys.USER_ROLE_ASSIGNMENTS, roleAssignments);
    }

    /**
     * @ngdoc function
     * @name  getRoleAssignments
     * @methodOf openlmis-common.AuthorizationService
     *
     * @description Reads local storages to set a list of the user's role assignments
     *
     * @return {Array} List of the user's role assignment
     */
    function getRoleAssignments() {
      var roleAssignments = false;
      try{
        var raw = localStorageService.get(storageKeys.USER_ROLE_ASSIGNMENTS);
        roleAssignments = JSON.parse(raw);
      } catch (e) {
        roleAssignments = [];
      }
      return roleAssignments;
    }

    // todo hasRight should check not only name, but also programCode, supervisoryNodeCode, warehouseCode if provided
    function hasRight(permissions) {
      var roleAssignments = getRoleAssignments();
      var rightNames = _.pluck(_.flatten(_.pluck(_.pluck(roleAssignments, 'role'), 'rights')), 'name');
      var hasRight = _.intersection(permissions, rightNames);

      return hasRight.length > 0 ? true : false;
    }

    /**
     * @ngdoc function
     * @name  clearRoleAssignments
     * @methodOf openlmis-common.AuthorizationService
     *
     * @description Removes user role assignments from local storage
     */
    function clearRoleAssignments(){
      localStorageService.remove(storageKeys.USER_ROLE_ASSIGNMENTS);
    }

    function preAuthorize() {
      var permissions = Array.prototype.slice.call(arguments);
      if(!hasRight(permissions)){
        return false;
      }
      return true;
    };

    function preAuthorizeReporting() {
      return rights && _.find(JSON.parse(rights), function (right) {
        return right.type === 'REPORTING';
      });
    };

    function hasPermission() {
      var permissions = Array.prototype.slice.call(arguments);
      return hasRight(permissions);
    };

    return service;
  }

  //todo change into proper roleAssignments
  var defaultRoleAssignments = [{
    "name": "DELETE_REQUISITION",
    "type": "REQUISITION"
  }, {
    "name": "MANAGE_DISTRIBUTION",
    "type": "ALLOCATION"
  }, {
    "name": "CREATE_REQUISITION",
    "type": "REQUISITION"
  }, {
    "name": "VIEW_ORDER",
    "type": "FULFILLMENT"
  }, {
    "name": "MANAGE_EQUIPMENT_INVENTORY",
    "type": "REQUISITION"
  }, {
    "name": "MANAGE_STOCK",
    "type": "REQUISITION"
  }, {
    "name": "AUTHORIZE_REQUISITION",
    "type": "REQUISITION"
  }, {
    "name": "VIEW_REQUISITION",
    "type": "REQUISITION"
  }, {
    "name": "APPROVE_REQUISITION",
    "type": "REQUISITION"
  }, {
    "name": "FACILITY_FILL_SHIPMENT",
    "type": "FULFILLMENT"
  }, {
    "name": "MANAGE_POD",
    "type": "FULFILLMENT"
  }, {
    "name": "VIEW_STOCK_ON_HAND",
    "type": "REQUISITION"
  }, {
    "name": "MANAGE_SUPERVISED_EQUIPMENTS",
    "type": "REQUISITION"
  }, {
    "name": "CONVERT_TO_ORDER",
    "type": "FULFILLMENT"
  }];

 })();
