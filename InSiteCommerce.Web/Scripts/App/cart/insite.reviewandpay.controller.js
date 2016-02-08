var insite;
(function (insite) {
    var cart;
    (function (_cart) {
        "use strict";
        var ReviewAndPayController = (function () {
            function ReviewAndPayController($window, cartService, promotionService, sessionService, coreService, spinnerService) {
                this.$window = $window;
                this.cartService = cartService;
                this.promotionService = promotionService;
                this.sessionService = sessionService;
                this.coreService = coreService;
                this.spinnerService = spinnerService;
                this.init();
            }
            ReviewAndPayController.prototype.init = function () {
                this.cartId = this.coreService.getQueryStringParameter("cartId", true) || "current";
                this.get(true);
            };
            ReviewAndPayController.prototype.get = function (isInit) {
                var _this = this;
                // save transients
                if (this.cart && this.cart.paymentOptions) {
                    var saveCardType = this.cart.paymentOptions.creditCard.cardType;
                    var saveCardHolderName = this.cart.paymentOptions.creditCard.cardHolderName;
                    var saveCardNumber = this.cart.paymentOptions.creditCard.cardNumber;
                    var saveExpirationMonth = this.cart.paymentOptions.creditCard.expirationMonth;
                    var saveExpirationYear = this.cart.paymentOptions.creditCard.expirationYear;
                    var saveSecurityCode = this.cart.paymentOptions.creditCard.securityCode;
                }
                this.cartService.expand = "cartlines,shipping,tax,carriers,paymentoptions";
                this.cartService.getCart(this.cartId).then(function (cart) {
                    _this.cart = cart;
                    // if cart does not have OrderLines, go to Cart page
                    if (!_this.cart.cartLines || _this.cart.cartLines.length === 0) {
                        _this.$window.location.href = _this.cartUrl;
                    }
                    _this.cartIdParam = _this.cart.id === "current" ? "" : "?cartId=" + _this.cart.id;
                    // restore transients
                    if (saveCardType) {
                        _this.cart.paymentOptions.creditCard.cardType = saveCardType;
                        _this.cart.paymentOptions.creditCard.cardHolderName = saveCardHolderName;
                        _this.cart.paymentOptions.creditCard.cardNumber = saveCardNumber;
                        _this.cart.paymentOptions.creditCard.expirationMonth = saveExpirationMonth;
                        _this.cart.paymentOptions.creditCard.expirationYear = saveExpirationYear;
                        _this.cart.paymentOptions.creditCard.securityCode = saveSecurityCode;
                    }
                    _this.cart.carriers.forEach(function (carrier) {
                        if (carrier.id === _this.cart.carrier.id) {
                            _this.cart.carrier = carrier;
                            if (isInit) {
                                _this.updateCarrier();
                            }
                        }
                    });
                    if (_this.cart.carrier && _this.cart.carrier.shipVias) {
                        _this.cart.carrier.shipVias.forEach(function (shipVia) {
                            if (shipVia.id === _this.cart.shipVia.id) {
                                _this.cart.shipVia = shipVia;
                            }
                        });
                    }
                    if (_this.cart.paymentMethod) {
                        _this.cart.paymentOptions.paymentMethods.forEach(function (paymentMethod) {
                            if (paymentMethod.name === _this.cart.paymentMethod.name) {
                                _this.cart.paymentMethod = paymentMethod;
                            }
                        });
                    }
                    _this.promotionService.getCartPromotions("current").success(function (result) {
                        _this.promotions = result.promotions;
                    });
                });
            };
            ReviewAndPayController.prototype.updateShipVia = function () {
                var _this = this;
                this.cartService.updateCart(this.cart).then(function () {
                    _this.get();
                });
            };
            ReviewAndPayController.prototype.updateCarrier = function () {
                if (this.cart.carrier && this.cart.carrier.shipVias && this.cart.carrier.shipVias.length === 1 && this.cart.shipVia !== this.cart.carrier.shipVias[0]) {
                    this.cart.shipVia = this.cart.carrier.shipVias[0];
                    this.updateShipVia();
                }
            };
            ReviewAndPayController.prototype.submit = function (submitSuccessUri, signInUri) {
                var _this = this;
                this.submitErrorMessage = "";
                // TODO: use angular validation
                var valid = $("#reviewAndPayForm").validate().form();
                if (!valid) {
                    $("html, body").animate({
                        scrollTop: $("#reviewAndPayForm").offset().top
                    }, 300);
                    return;
                }
                this.sessionService.getIsAuthenticated().then(function (isAuthenticated) {
                    if (isAuthenticated) {
                        _this.submitting = true;
                        if (_this.cart.requiresApproval) {
                            _this.cart.status = "AwaitingApproval";
                        }
                        else {
                            _this.cart.status = "Submitted";
                        }
                        _this.spinnerService.show("mainLayout", true);
                        _this.cartService.updateCart(_this.cart, true).success(function (result) {
                            _this.cart.id = result.id;
                            _this.$window.location.href = submitSuccessUri + "?cartid=" + _this.cart.id;
                        }).error(function (error) {
                            _this.submitting = false;
                            _this.spinnerService.hide();
                            _this.submitErrorMessage = error.message;
                        });
                    }
                    else {
                        _this.$window.location.href = signInUri + "?returnUrl=" + _this.$window.location.href;
                    }
                });
            };
            ReviewAndPayController.$inject = [
                "$window",
                "cartService",
                "promotionService",
                "sessionService",
                "coreService",
                "spinnerService"
            ];
            return ReviewAndPayController;
        })();
        _cart.ReviewAndPayController = ReviewAndPayController;
        angular.module("insite").controller("ReviewAndPayController", ReviewAndPayController);
    })(cart = insite.cart || (insite.cart = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.reviewandpay.controller.js.map