var insite;
(function (insite) {
    var account;
    (function (_account) {
        "use strict";
        var AccountService = (function () {
            function AccountService($http, coreService, $window) {
                this.$http = $http;
                this.coreService = coreService;
                this.$window = $window;
                this.serviceUri = this.coreService.getApiUri("/api/v1/accounts");
                this.settingsUri = this.coreService.getApiUri("/api/v1/settings/account");
                this.expand = "";
            }
            AccountService.prototype.getAccountSettings = function () {
                return this.$http.get(this.settingsUri);
            };
            AccountService.prototype.getAccounts = function (searchText, pagination, sort) {
                var params = {
                    SearchText: searchText,
                    Sort: sort
                };
                if (this.expand) {
                    params.expand = this.expand;
                }
                if (pagination) {
                    params.StartPage = pagination.currentPage;
                    params.PageSize = pagination.pageSize;
                }
                return this.$http({
                    url: this.serviceUri,
                    method: "GET",
                    params: params
                });
            };
            AccountService.prototype.getAccount = function (accountId) {
                var params = {};
                if (this.expand) {
                    params.expand = this.expand;
                }
                return this.$http({
                    url: this.serviceUri + "/" + (!accountId ? "current" : accountId),
                    method: "GET",
                    params: params
                });
            };
            AccountService.prototype.getExternalProviders = function () {
                return this.$http.get("/identity/externalproviders" + this.$window.location.search);
            };
            AccountService.prototype.createAccount = function (account) {
                return this.$http.post(this.serviceUri, account, { bypassErrorInterceptor: true });
            };
            AccountService.prototype.updateAccount = function (account, accountId) {
                return this.$http({
                    method: "PATCH",
                    url: this.serviceUri + "/" + (!accountId ? "current" : accountId),
                    data: account,
                    bypassErrorInterceptor: true
                });
            };
            AccountService.$inject = ["$http", "coreService", "$window"];
            return AccountService;
        })();
        _account.AccountService = AccountService;
        angular.module("insite").service("accountService", AccountService);
    })(account = insite.account || (insite.account = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.account.service.js.map