var insite;
(function (insite) {
    var cart;
    (function (cart) {
        "use strict";
        var UserExchangeService = (function () {
            function UserExchangeService($rootScope, $http, $q, coreService) {
                this.$rootScope = $rootScope;
                this.$http = $http;
                this.$q = $q;
                this.coreService = coreService;
                this.serviceUri = this.coreService.getApiUri("/api/NEB/userexchange");
            }
            UserExchangeService.prototype.getUsers = function () {
                var uri = this.serviceUri;
                return this.$http.get(uri, { bypassErrorInterceptor: true });
            };
            return UserExchangeService;
        })();
        cart.UserExchangeService = UserExchangeService;
        function factory($rootScope, $http, $q, coreService) {
            return new UserExchangeService($rootScope, $http, $q, coreService);
        }
        factory.$inject = ["$rootScope", "$http", "$q", "coreService"];
        angular.module("insite").factory("userExchangeService", factory);
    })(cart = insite.cart || (insite.cart = {}));
})(insite || (insite = {}));
//# sourceMappingURL=custom.userexchange.js.map