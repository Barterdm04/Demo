var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var insite;
(function (insite) {
    var cart;
    (function (_cart) {
        "use strict";
        var CustomCheckoutAddressController = (function (_super) {
            __extends(CustomCheckoutAddressController, _super);
            function CustomCheckoutAddressController($scope, $window, cartService, customerService, websiteService, coreService, userExchangeService, sessionService) {
                _super.call(this, $scope, $window, cartService, customerService, websiteService, coreService);
                this.$scope = $scope;
                this.$window = $window;
                this.cartService = cartService;
                this.customerService = customerService;
                this.websiteService = websiteService;
                this.coreService = coreService;
                this.userExchangeService = userExchangeService;
                this.sessionService = sessionService;
                this.isReadOnly = false;
            }
            CustomCheckoutAddressController.prototype.init = function () {
                var _this = this;
                this.cartId = this.coreService.getQueryStringParameter("cartId");
                this.cartService.expand = "shiptos,validation";
                var self = this;
                this.cartService.getCart(this.cartId).then(function (cart) {
                    _this.cart = cart;
                    _this.websiteService.getCountries("states").success(function (result) {
                        _this.countries = result.countries;
                        self.userExchangeService.getUsers().success(function (result) {
                            self.users = result.users;
                        }).error(function (data) {
                            self.users = [];
                        });
                        var billTo = _this.cart.billTo;
                        _this.setObjectToReference(_this.countries, billTo, "country");
                        if (billTo.country) {
                            _this.setObjectToReference(billTo.country.states, billTo, "state");
                        }
                        _this.shipTos = angular.copy(billTo.shipTos);
                        var shipToBillTo;
                        _this.shipTos.forEach(function (shipTo) {
                            if (shipTo.country && shipTo.country.states) {
                                _this.setObjectToReference(_this.countries, shipTo, "country");
                                _this.setObjectToReference(shipTo.country.states, shipTo, "state");
                            }
                            if (shipTo.id === billTo.id) {
                                shipToBillTo = shipTo;
                            }
                        });
                        _this.selectedShipTo = _this.cart.shipTo;
                        // if allow ship to billing address, remove the billto returned in the shipTos array and put in the actual billto object
                        // so that updating one side updates the other side
                        if (shipToBillTo) {
                            billTo.label = shipToBillTo.label;
                            _this.shipTos.splice(_this.shipTos.indexOf(shipToBillTo), 1); // remove the billto that's in the shiptos array
                            _this.shipTos.unshift(billTo); // add the actual billto to top of array
                        }
                        _this.shipTos.forEach(function (shipTo) {
                            if (_this.cart.shipTo && shipTo.id === _this.cart.shipTo.id || !_this.selectedShipTo && shipTo.isNew) {
                                _this.selectedShipTo = shipTo;
                            }
                        });
                    });
                });
            };
            CustomCheckoutAddressController.prototype.continueCheckout = function (continueUri) {
                var _this = this;
                var valid = $("#addressForm").validate().form();
                if (!valid) {
                    return;
                }
                if (this.cartId) {
                    continueUri += "?cartId=" + this.cartId;
                }
                this.updateCartModel();
                if (this.$scope.addressForm.$pristine) {
                    this.updateCart(this.cart, continueUri);
                }
                this.customerService.updateBillTo(this.cart.billTo).success(function () {
                    var shipToMatches = _this.cart.billTo.shipTos.filter(function (shipTo) {
                        return shipTo.id === _this.selectedShipTo.id;
                    });
                    if (shipToMatches.length === 1) {
                        _this.cart.shipTo = _this.selectedShipTo;
                    }
                    if (_this.cart.shipTo.id !== _this.cart.billTo.id) {
                        _this.customerService.addOrUpdateShipTo(_this.cart.shipTo).success(function (shipTo) {
                            if (_this.cart.shipTo.isNew) {
                                _this.cart.shipTo = shipTo;
                            }
                            _this.updateCart(_this.cart, continueUri);
                        });
                    }
                    else {
                        _this.updateCart(_this.cart, continueUri);
                    }
                });
            };
            CustomCheckoutAddressController.prototype.updateCart = function (cart, continueUri) {
                var _this = this;
                this.cartService.updateCart(cart).then(function () {
                    _this.$window.location.href = continueUri;
                });
            };
            CustomCheckoutAddressController.prototype.updateCartModel = function () {
                if (this.selectedUser != null) {
                    this.cart.properties = { purchasedFor: this.selectedUser.name };
                }
                else if (this.cart.properties.hasOwnProperty('purchasedFor')) {
                    this.cart.properties = { purchasedFor: "Self" };
                }
            };
            CustomCheckoutAddressController.$inject = [
                "$scope",
                "$window",
                "cartService",
                "customerService",
                "websiteService",
                "coreService",
                "userExchangeService",
                "sessionService"
            ];
            return CustomCheckoutAddressController;
        })(_cart.CheckoutAddressController);
        _cart.CustomCheckoutAddressController = CustomCheckoutAddressController;
        angular.module("insite").controller("CheckoutAddressController", CustomCheckoutAddressController);
    })(cart = insite.cart || (insite.cart = {}));
})(insite || (insite = {}));
//# sourceMappingURL=custom.checkoutaddress.controller.js.map