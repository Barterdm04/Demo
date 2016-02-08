var insite;
(function (insite) {
    var account;
    (function (account) {
        "use strict";
        var ExternalProvidersController = (function () {
            function ExternalProvidersController(accountService) {
                this.accountService = accountService;
                this.init();
            }
            ExternalProvidersController.prototype.init = function () {
                var _this = this;
                this.accountService.getExternalProviders().success(function (externalProviderCollection) {
                    _this.externalProviders = externalProviderCollection.externalProviders;
                });
            };
            ExternalProvidersController.$inject = ["accountService"];
            return ExternalProvidersController;
        })();
        account.ExternalProvidersController = ExternalProvidersController;
        angular.module("insite").controller("ExternalProvidersController", ExternalProvidersController);
    })(account = insite.account || (insite.account = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.externalproviders.controller.js.map