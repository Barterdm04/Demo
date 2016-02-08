var insite;
(function (insite) {
    var rfq;
    (function (rfq) {
        "use strict";
        var RfqController = (function () {
            function RfqController($window, $scope, cartService, rfqService, accountService, sessionService) {
                this.$window = $window;
                this.$scope = $scope;
                this.cartService = cartService;
                this.rfqService = rfqService;
                this.accountService = accountService;
                this.sessionService = sessionService;
                this.init();
            }
            RfqController.prototype.init = function () {
                this.initEvents();
                this.cartService.expand = "cartlines,costcodes";
            };
            RfqController.prototype.initEvents = function () {
                var _this = this;
                this.$scope.$on("cartLoaded", function (event, cart) {
                    if (!_this.cart) {
                        _this.mapData(cart);
                    }
                    _this.cart = cart;
                });
                this.$scope.$on("sessionLoaded", function (event, session) {
                    _this.session = session;
                });
                this.$scope.$on("settingsLoaded", function (event, data) {
                    _this.quoteSettings = data.quoteSettings;
                });
            };
            RfqController.prototype.mapData = function (cart) {
                var _this = this;
                this.notes = cart.notes;
                this.isSalesRep = cart.isSalesperson;
                if (this.isSalesRep) {
                    this.accountService.getAccounts().success(function (result) {
                        _this.filterCurrentUser(result.accounts);
                    });
                }
            };
            RfqController.prototype.filterCurrentUser = function (userCollection) {
                var _this = this;
                this.users = userCollection.filter(function (user) {
                    return user.userName !== _this.session.userName;
                });
            };
            RfqController.prototype.submitQuote = function (submitSuccessUri) {
                var _this = this;
                var valid = angular.element("#submitQuoteForm").validate().form();
                if (!valid) {
                    return;
                }
                var parameters = {
                    quoteId: this.cart.id,
                    userId: this.selectedUser,
                    note: this.notes,
                    jobName: this.jobName,
                    isJobQuote: this.isJobQuote
                };
                this.rfqService.submitQuote(parameters).then(function (result) {
                    _this.$window.location.href = submitSuccessUri + "?cartid=" + result.id;
                });
            };
            RfqController.$inject = ["$window", "$scope", "cartService", "rfqService", "accountService", "sessionService"];
            return RfqController;
        })();
        rfq.RfqController = RfqController;
        angular.module("insite").controller("RfqController", RfqController);
    })(rfq = insite.rfq || (insite.rfq = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.rfq.controller.js.map