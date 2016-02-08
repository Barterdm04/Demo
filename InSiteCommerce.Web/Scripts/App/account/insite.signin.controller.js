var insite;
(function (insite) {
    var account;
    (function (_account) {
        "use strict";
        var SignInController = (function () {
            function SignInController($scope, $window, accountService, sessionService, customerService, coreService, spinnerService) {
                this.$scope = $scope;
                this.$window = $window;
                this.accountService = accountService;
                this.sessionService = sessionService;
                this.customerService = customerService;
                this.coreService = coreService;
                this.spinnerService = spinnerService;
                this.accessToken = "";
                this.signInError = "";
                this.disableSignIn = false;
                this.init();
            }
            SignInController.prototype.init = function () {
                var _this = this;
                this.returnUrl = this.coreService.getQueryStringParameter("returnUrl", true);
                if (!this.returnUrl) {
                    this.returnUrl = this.homePageUrl;
                }
                this.$scope.$on("sessionLoaded", function (event, data) {
                    if (data.isAuthenticated) {
                        _this.$window.location.href = _this.dashboardUrl;
                    }
                });
                this.$scope.$on("settingsLoaded", function (event, data) {
                    _this.settings = data.accountSettings;
                    _this.allowBillToForShipTo = data.customerSettings.allowBillToForShipTo;
                });
                this.$scope.$on("cartLoaded", function (event, cart) {
                    _this.cart = cart;
                });
                if (this.returnUrl.toLowerCase().indexOf("reviewandpay") > -1) {
                    this.isFromReviewAndPay = true;
                }
            };
            SignInController.prototype.signIn = function (errorMessage) {
                var _this = this;
                this.signInError = "";
                if (this.signInForm.$invalid) {
                    return;
                }
                this.disableSignIn = true;
                this.spinnerService.show("mainLayout", true);
                this.sessionService.getAccessToken(this.userName, this.password).success(function (result) {
                    _this.accessToken = result.access_token;
                    _this.signUserIn();
                }).error(function (error) {
                    _this.signInError = errorMessage;
                    _this.disableSignIn = false;
                    _this.spinnerService.hide("mainLayout");
                });
            };
            SignInController.prototype.selectCustomer = function () {
                var _this = this;
                this.customerService.getBillTos("shiptos", this.accessToken).success(function (billToResult) {
                    if (!_this.settings.requireSelectCustomerOnSignIn) {
                        if (_this.allowBillToForShipTo && billToResult.billTos.some(function (x) { return x.isDefault; })) {
                            var defaultBillTo = billToResult.billTos.filter(function (x) { return x.isDefault; });
                            _this.sessionService.setCustomer(defaultBillTo[0].id, defaultBillTo[0].id).then(function (result) {
                                _this.sessionService.redirectAfterSelectCustomer(result, _this.cart.canBypassCheckoutAddress, _this.dashboardUrl, _this.returnUrl, _this.checkoutAddressUrl, _this.reviewAndPayUrl);
                            });
                        }
                        else {
                            _this.$window.location.href = _this.returnUrl;
                        }
                    }
                    else if (billToResult.billTos.length === 1 && billToResult.billTos[0].shipTos.length === 1) {
                        var billTo = billToResult.billTos[0];
                        var shipTo = billToResult.billTos[0].shipTos[0];
                        _this.sessionService.setCustomer(billTo.id, shipTo.id).then(function (result) {
                            _this.sessionService.redirectAfterSelectCustomer(result, _this.cart.canBypassCheckoutAddress, _this.dashboardUrl, _this.returnUrl, _this.checkoutAddressUrl, _this.reviewAndPayUrl);
                        });
                    }
                    else {
                        _this.$window.location.href = _this.changeCustomerPageUrl + "?returnUrl=" + _this.returnUrl;
                    }
                }).error(function (error) {
                    _this.$window.location.href = _this.changeCustomerPageUrl + "?returnUrl=" + _this.returnUrl;
                });
            };
            SignInController.prototype.guestCheckout = function () {
                var _this = this;
                var account = { isGuest: true };
                this.accountService.createAccount(account).success(function (result) {
                    _this.sessionService.getAccessToken(result.userName, result.password).success(function (token) {
                        _this.sessionService.setAccessToken(token.access_token);
                        _this.$window.location.href = _this.returnUrl;
                    }).error(function (error) {
                        _this.signInError = error.message;
                    });
                }).error(function (error) {
                    _this.signInError = error.message;
                });
            };
            SignInController.prototype.changePassword = function () {
                var _this = this;
                this.changePasswordError = "";
                var valid = $("#changePasswordForm").validate().form();
                if (!valid) {
                    return;
                }
                var session = {
                    userName: this.userName,
                    password: this.password,
                    newPassword: this.newPassword
                };
                this.sessionService.changePassword(session, this.accessToken).then(function () {
                    _this.password = _this.newPassword;
                    _this.signUserIn();
                }, function (error) {
                    _this.changePasswordError = error.message;
                });
            };
            SignInController.prototype.resetPassword = function () {
                var _this = this;
                this.resetPasswordError = "";
                var valid = $("#resetPasswordForm").validate().form();
                if (!valid) {
                    return;
                }
                var session = {
                    email: this.email,
                    resetPassword: true
                };
                this.sessionService.resetPassword(session).success(function () {
                    _this.resetPasswordSuccess = true;
                }).error(function (error) {
                    _this.resetPasswordError = error.message;
                });
            };
            SignInController.prototype.signUserIn = function () {
                var _this = this;
                this.sessionService.signIn(this.accessToken, this.userName, this.password).then(function (result) {
                    _this.sessionService.setContextFromSession(result);
                    _this.selectCustomer();
                }, function (error) {
                    _this.disableSignIn = false;
                    if (error.status === 422) {
                        _this.coreService.displayModal(angular.element("#changePasswordPopup"));
                    }
                    else {
                        if (error.data.message) {
                            _this.signInError = error.data.message;
                        }
                        else {
                            _this.signInError = error.data;
                        }
                    }
                });
            };
            SignInController.$inject = ["$scope", "$window", "accountService", "sessionService", "customerService", "coreService", "spinnerService"];
            return SignInController;
        })();
        _account.SignInController = SignInController;
        angular.module("insite").controller("SignInController", SignInController);
    })(account = insite.account || (insite.account = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.signin.controller.js.map