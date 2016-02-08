var insite;
(function (insite) {
    var account;
    (function (account) {
        "use strict";
        var SelectCustomerController = (function () {
            function SelectCustomerController($scope, $window, accountService, sessionService, customerService, coreService) {
                this.$scope = $scope;
                this.$window = $window;
                this.accountService = accountService;
                this.sessionService = sessionService;
                this.customerService = customerService;
                this.coreService = coreService;
                this.errorMessage = "";
                this.init();
            }
            SelectCustomerController.prototype.init = function () {
                var _this = this;
                this.returnUrl = this.coreService.getQueryStringParameter("returnUrl", true);
                if (!this.returnUrl) {
                    this.returnUrl = this.homePageUrl;
                }
                this.$scope.$on("cartLoaded", function (event, cart) {
                    _this.cart = cart;
                });
                this.$scope.$on("settingsLoaded", function (event, settings) {
                    var customerSettings = settings.customerSettings;
                    _this.customerService.getBillTos("shiptos").success(function (billToResult) {
                        _this.billTos = billToResult.billTos;
                        if (!customerSettings.allowCreateNewShipToAddress && !customerSettings.allowBillToForShipTo) {
                            _this.billTos = _this.billTos.filter(function (x) { return x.shipTos.length > 0; });
                        }
                        if (_this.billTos && _this.billTos.length === 1) {
                            _this.billTo = _this.billTos[0];
                            _this.changeBillTo();
                        }
                    });
                });
            };
            SelectCustomerController.prototype.cancel = function () {
                this.$window.location.href = this.returnUrl;
            };
            SelectCustomerController.prototype.setCustomer = function () {
                var _this = this;
                if (!this.billTo || !this.shipTo) {
                    return;
                }
                this.sessionService.setCustomer(this.billTo.id, this.shipTo.id).then(function (result) {
                    _this.sessionService.redirectAfterSelectCustomer(result, _this.cart.canBypassCheckoutAddress, _this.dashboardUrl, _this.returnUrl, _this.checkoutAddressUrl, _this.reviewAndPayUrl);
                }, function (error) {
                    _this.errorMessage = error.message;
                });
            };
            SelectCustomerController.prototype.changeBillTo = function () {
                if (this.billTo && this.billTo.shipTos && this.billTo.shipTos.length === 1) {
                    this.shipTo = this.billTo.shipTos[0];
                }
            };
            SelectCustomerController.$inject = ["$scope", "$window", "accountService", "sessionService", "customerService", "coreService"];
            return SelectCustomerController;
        })();
        account.SelectCustomerController = SelectCustomerController;
        angular.module("insite").controller("SelectCustomerController", SelectCustomerController);
    })(account = insite.account || (insite.account = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.selectcustomer.controller.js.map