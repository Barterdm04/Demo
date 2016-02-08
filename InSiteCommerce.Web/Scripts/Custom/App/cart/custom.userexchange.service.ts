module insite.cart {
    "use strict";

    export interface IUserExchangeRequest {

    }

    export interface IUserExchangeService {
        getUsers();
    }

    export class UserExchangeService implements IUserExchangeService {

        serviceUri = this.coreService.getApiUri("/api/NEB/userexchange");
        constructor(protected $rootScope: ng.IRootScopeService,
            protected $http: ng.IHttpService,
            protected $q: ng.IQService,
            protected coreService: core.ICoreService) {
        }

        getUsers(): ng.IHttpPromise<string> {
            var uri = this.serviceUri;
            uri += "/getUsers";
            return this.$http.get(uri, { bypassErrorInterceptor: true });
        }

    }

    function factory($rootScope: ng.IRootScopeService, $http: ng.IHttpService, $q: ng.IQService, coreService: core.ICoreService): UserExchangeService {
        return new UserExchangeService($rootScope, $http, $q, coreService);
    }
    factory.$inject = ["$rootScope", "$http", "$q", "coreService"];

    angular
        .module("insite")
        .factory("userExchangeService", factory);
}
  