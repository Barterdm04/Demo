var insite;
(function (insite) {
    var cart;
    (function (_cart) {
        "use strict";
        var CartController = (function () {
            function CartController($scope, $window, cartService) {
                this.$scope = $scope;
                this.$window = $window;
                this.cartService = cartService;
                this.showInventoryAvailability = false;
                this.init();
            }
            CartController.prototype.init = function () {
                this.initEvents();
                this.cartService.cartLoadCalled = true; // prevents request race
            };
            CartController.prototype.initEvents = function () {
                var _this = this;
                this.$scope.$on("settingsLoaded", function (event, data) {
                    _this.settings = data.cartSettings;
                    _this.showInventoryAvailability = data.productSettings.showInventoryAvailability;
                    _this.cartService.expand = "cartlines,costcodes";
                    if (_this.settings.showTaxAndShipping) {
                        _this.cartService.expand += ",shipping,tax";
                    }
                    _this.cartService.getCart();
                });
                this.$scope.$on("cartLoaded", function (event, cart, expand) {
                    _this.cart = cart;
                });
            };
            CartController.prototype.continueCheckout = function (url) {
                window.location = url;
            };
            CartController.prototype.emptyCart = function (emptySuccessUri) {
                var _this = this;
                this.cartService.removeCart(this.cart).success(function (result) {
                    _this.$window.location.href = emptySuccessUri;
                });
            };
            CartController.prototype.saveCart = function (saveSuccessUri, signInUri) {
                var _this = this;
                if (!this.cart.isAuthenticated) {
                    this.$window.location.href = signInUri + "?returnUrl=" + this.$window.location.href;
                    return;
                }
                this.cart.status = "Saved";
                this.cartService.updateCart(this.cart).success(function (result) {
                    _this.$window.location.href = saveSuccessUri + "?cartid=" + result.id;
                });
            };
            CartController.prototype.submitRequisition = function (submitRequisitionSuccessUri) {
                var _this = this;
                this.cart.status = "RequisitionSubmitted";
                this.cartService.updateCart(this.cart).then(function () {
                    _this.$window.location.href = submitRequisitionSuccessUri;
                });
            };
            CartController.prototype.continueShopping = function ($event) {
                var host = this.$window.document.location.host;
                var referrer = this.$window.document.referrer.toLowerCase();
                if (referrer.indexOf(host + "/catalog/") !== -1 || referrer.indexOf(host + "/search?") !== -1) {
                    $event.preventDefault();
                    this.$window.document.location.href = this.$window.document.referrer;
                }
            };
            CartController.$inject = [
                "$scope",
                "$window",
                "cartService"
            ];
            return CartController;
        })();
        _cart.CartController = CartController;
        angular.module("insite").controller("CartController", CartController);
    })(cart = insite.cart || (insite.cart = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.cart.controller.js.map