var insite;
(function (insite) {
    var useradministration;
    (function (useradministration) {
        "use strict";
        var UserDetailController = (function () {
            function UserDetailController($scope, accountService, coreService) {
                this.$scope = $scope;
                this.accountService = accountService;
                this.coreService = coreService;
                this.user = null;
                this.retrievalError = false;
                this.isSubmitted = false;
                this.isNewUser = true;
                this.generalError = "";
                this.init();
            }
            UserDetailController.prototype.init = function () {
                var _this = this;
                var id = this.coreService.getQueryStringParameter("userId", true);
                this.accountService.expand = "approvers,roles";
                this.accountService.getAccount(id).success(function (result) {
                    _this.user = result;
                    if (!id) {
                        _this.user.email = "";
                        _this.user.userName = "";
                        _this.user.firstName = "";
                        _this.user.lastName = "";
                        _this.user.role = "";
                        _this.user.approver = "";
                        _this.user.isApproved = true;
                    }
                    _this.coreService.refreshUiBindings();
                    if (_this.user.userName) {
                        _this.isNewUser = false;
                    }
                    _this.retrievalError = false;
                }).error(function () {
                    _this.retrievalError = true;
                });
            };
            UserDetailController.prototype.createUser = function (redirectUri) {
                var _this = this;
                if (this.$scope["usersetupform"].$valid) {
                    this.accountService.createAccount(this.user).success(function () {
                        window.location.href = redirectUri;
                    }).error(function (data) {
                        if (data.message) {
                            _this.generalError = data.message;
                        }
                    });
                }
                this.isSubmitted = true;
            };
            UserDetailController.prototype.updateUser = function (redirectUri) {
                var _this = this;
                if (this.$scope["usersetupform"].$valid) {
                    this.accountService.updateAccount(this.user, this.user.id).success(function () {
                        window.location.href = redirectUri;
                    }).error(function (data) {
                        if (data.message) {
                            _this.generalError = data.message;
                        }
                    });
                }
                this.isSubmitted = true;
            };
            UserDetailController.$inject = [
                "$scope",
                "accountService",
                "coreService"
            ];
            return UserDetailController;
        })();
        useradministration.UserDetailController = UserDetailController;
        angular.module("insite").controller("UserDetailController", UserDetailController);
    })(useradministration = insite.useradministration || (insite.useradministration = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.userdetail.controller.js.map