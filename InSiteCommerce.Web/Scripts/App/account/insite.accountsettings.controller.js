var insite;
(function (insite) {
    var account;
    (function (_account) {
        "use strict";
        var AccountSettingsController = (function () {
            function AccountSettingsController($scope, accountService, sessionService, coreService) {
                this.$scope = $scope;
                this.accountService = accountService;
                this.sessionService = sessionService;
                this.coreService = coreService;
                this.changePasswordError = "";
                this.password = "";
                this.newPassword = "";
                this.init();
            }
            AccountSettingsController.prototype.init = function () {
                var _this = this;
                this.$scope.$on("settingsLoaded", function (event, data) {
                    _this.settings = data.accountSettings;
                });
                this.accountService.getAccount().success(function (account) {
                    _this.account = account;
                });
            };
            AccountSettingsController.prototype.changePassword = function () {
                var _this = this;
                this.changePasswordError = "";
                if (!this.$scope["changePasswordForm"].$valid) {
                    return;
                }
                var session = {
                    password: this.password,
                    newPassword: this.newPassword
                };
                this.sessionService.changePassword(session).then(function () {
                    angular.element("#changePasswordSuccess").foundation("reveal", "open");
                }, function (error) {
                    _this.changePasswordError = error.message;
                });
            };
            AccountSettingsController.prototype.changeSubscription = function () {
                var _this = this;
                if (!this.$scope["manageSubscriptionsForm"].$valid) {
                    return;
                }
                this.accountService.updateAccount(this.account).success(function (result) {
                    angular.element("#manageSubscriptionSuccess").foundation("reveal", "open");
                }).error(function (result) {
                    _this.changePasswordError = result.message;
                });
            };
            AccountSettingsController.$inject = ["$scope", "accountService", "sessionService", "coreService"];
            return AccountSettingsController;
        })();
        _account.AccountSettingsController = AccountSettingsController;
        angular.module("insite").controller("AccountSettingsController", AccountSettingsController);
    })(account = insite.account || (insite.account = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.accountsettings.controller.js.map