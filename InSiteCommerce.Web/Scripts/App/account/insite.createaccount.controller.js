var insite;
(function (insite) {
    var account;
    (function (_account) {
        "use strict";
        var CreateAccountController = (function () {
            function CreateAccountController($scope, $window, accountService, sessionService, coreService) {
                this.$scope = $scope;
                this.$window = $window;
                this.accountService = accountService;
                this.sessionService = sessionService;
                this.coreService = coreService;
                this.init();
            }
            CreateAccountController.prototype.init = function () {
                var _this = this;
                this.returnUrl = this.coreService.getQueryStringParameter("returnUrl", true);
                this.$scope.$on("settingsLoaded", function (event, data) {
                    _this.settings = data.accountSettings;
                });
            };
            CreateAccountController.prototype.createAccount = function () {
                var _this = this;
                this.createError = "";
                var valid = $("#createAccountForm").validate().form();
                if (!valid) {
                    return;
                }
                var account = {
                    email: this.email,
                    userName: this.userName,
                    password: this.password,
                    isSubscribed: this.isSubscribed
                };
                this.accountService.createAccount(account).success(function (account) {
                    _this.sessionService.getAccessToken(_this.userName, _this.password).success(function (result) {
                        _this.sessionService.setAccessToken(result.access_token);
                        var currentContext = _this.sessionService.getContext();
                        currentContext.billToId = account.billToId;
                        currentContext.shipToId = account.shipToId;
                        _this.sessionService.setContext(currentContext);
                        _this.$window.location.href = _this.returnUrl;
                    }).error(function (error) {
                        _this.createError = error.message;
                    });
                }).error(function (error) {
                    _this.createError = error.message;
                });
            };
            CreateAccountController.$inject = [
                "$scope",
                "$window",
                "accountService",
                "sessionService",
                "coreService"
            ];
            return CreateAccountController;
        })();
        _account.CreateAccountController = CreateAccountController;
        angular.module("insite").controller("CreateAccountController", CreateAccountController);
    })(account = insite.account || (insite.account = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.createaccount.controller.js.map