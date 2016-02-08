var insite;
(function (insite) {
    var cart;
    (function (_cart) {
        "use strict";
        var CheckoutAddressController = (function () {
            function CheckoutAddressController($scope, $window, cartService, customerService, websiteService, coreService) {
                this.$scope = $scope;
                this.$window = $window;
                this.cartService = cartService;
                this.customerService = customerService;
                this.websiteService = websiteService;
                this.coreService = coreService;
                this.isReadOnly = false;
                this.init();
            }
            CheckoutAddressController.prototype.init = function () {
                var _this = this;
                this.cartId = this.coreService.getQueryStringParameter("cartId");
                this.cartService.expand = "shiptos,validation";
                this.cartService.getCart(this.cartId).then(function (cart) {
                    _this.cart = cart;
                    _this.websiteService.getCountries("states").success(function (result) {
                        _this.countries = result.countries;
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
                                // Don't allow editing the Bill To from the Ship To column.  Only allow
                                // editing of Bill To from the Bill To column. So, if ship to is the bill to change
                                // the ship to fields to readonly.
                                _this.isReadOnly = true;
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
            CheckoutAddressController.prototype.checkSelectedShipTo = function () {
                if (this.selectedShipTo.id === this.cart.billTo.id) {
                    this.isReadOnly = true;
                }
                else {
                    this.isReadOnly = false;
                }
            };
            CheckoutAddressController.prototype.continueCheckout = function (continueUri) {
                var _this = this;
                var valid = $("#addressForm").validate().form();
                if (!valid) {
                    return;
                }
                if (this.cartId) {
                    continueUri += "?cartId=" + this.cartId;
                }
                if (this.$scope.addressForm.$pristine) {
                    this.$window.location.href = continueUri;
                    return;
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
            CheckoutAddressController.prototype.setObjectToReference = function (references, object, objectPropertyName) {
                references.forEach(function (reference) {
                    if (object[objectPropertyName] && reference.id === object[objectPropertyName].id) {
                        object[objectPropertyName] = reference;
                    }
                });
            };
            CheckoutAddressController.prototype.updateCart = function (cart, continueUri) {
                var _this = this;
                this.cartService.updateCart(cart).then(function () {
                    _this.$window.location.href = continueUri;
                });
            };
            CheckoutAddressController.$inject = [
                "$scope",
                "$window",
                "cartService",
                "customerService",
                "websiteService",
                "coreService"
            ];
            return CheckoutAddressController;
        })();
        _cart.CheckoutAddressController = CheckoutAddressController;
        angular.module("insite").controller("CheckoutAddressController", CheckoutAddressController);
    })(cart = insite.cart || (insite.cart = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.checkoutaddress.controller.js.map