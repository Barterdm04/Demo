module insite.cart {
    "use strict";

    export class ReviewAndPayController {

        cart: CartModel;
        cartId: string;
        cartIdParam: string;
        promotions: PromotionModel[];
        promotionAppliedMessage: string;
        promotionErrorMessage: string;
        submitErrorMessage: string;
        submitting: boolean;
        cartUrl: string;

        static $inject = [
            "$window"
            , "cartService"
            , "promotionService"
            , "sessionService"
            , "coreService"
            , "spinnerService"
        ];

        constructor(
            protected $window: ng.IWindowService,
            protected cartService: ICartService,
            protected promotionService: promotions.IPromotionService,
            protected sessionService: ISessionService,
            protected coreService: core.ICoreService,
            protected spinnerService: core.ISpinnerService) {

            this.init();
        }

        init() {
            this.cartId = this.coreService.getQueryStringParameter("cartId", true) || "current";
            this.get(true);
        }

        get(isInit?: boolean) {

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
            this.cartService.getCart(this.cartId).then(cart => {

                this.cart = cart;

                // if cart does not have OrderLines, go to Cart page
                if (!this.cart.cartLines || this.cart.cartLines.length === 0 ) {
                    this.$window.location.href = this.cartUrl;
                }

                this.cartIdParam = this.cart.id === "current" ? "" : "?cartId=" + this.cart.id;

                // restore transients
                if (saveCardType) {
                    this.cart.paymentOptions.creditCard.cardType = saveCardType;
                    this.cart.paymentOptions.creditCard.cardHolderName = saveCardHolderName;
                    this.cart.paymentOptions.creditCard.cardNumber = saveCardNumber;
                    this.cart.paymentOptions.creditCard.expirationMonth = saveExpirationMonth;
                    this.cart.paymentOptions.creditCard.expirationYear = saveExpirationYear;
                    this.cart.paymentOptions.creditCard.securityCode = saveSecurityCode;
                }

                this.cart.carriers.forEach(carrier => {
                    if (carrier.id === this.cart.carrier.id) {
                        this.cart.carrier = carrier;
                        if (isInit) {
                             this.updateCarrier();
                        }
                    }
                });
                if (this.cart.carrier && this.cart.carrier.shipVias) {
                    this.cart.carrier.shipVias.forEach(shipVia => {
                        if (shipVia.id === this.cart.shipVia.id) {
                            this.cart.shipVia = shipVia;
                        }
                    });
                }
                if (this.cart.paymentMethod) {
                    this.cart.paymentOptions.paymentMethods.forEach(paymentMethod => {
                        if (paymentMethod.name === this.cart.paymentMethod.name) {
                            this.cart.paymentMethod = paymentMethod;
                        }
                    });
                }

                this.promotionService.getCartPromotions("current").success((result: PromotionCollectionModel) => {
                    this.promotions = result.promotions;
                });
            });
        }

        updateShipVia() {
            this.cartService.updateCart(this.cart).then(
                () => {
                    this.get();
                }
            );
        }

        updateCarrier(): void {
            if (this.cart.carrier && this.cart.carrier.shipVias && this.cart.carrier.shipVias.length === 1 &&
                this.cart.shipVia !== this.cart.carrier.shipVias[0])
            {
                this.cart.shipVia = this.cart.carrier.shipVias[0];
                this.updateShipVia();
            }
        }

        submit(submitSuccessUri: string, signInUri: string) {
            this.submitErrorMessage = "";
            // TODO: use angular validation
            var valid = $("#reviewAndPayForm").validate().form();
            if (!valid) {
                $("html, body").animate({
                    scrollTop: $("#reviewAndPayForm").offset().top
                }, 300);
                return;
            }

            this.sessionService.getIsAuthenticated()
                .then((isAuthenticated: boolean) => {
                    if (isAuthenticated) {
                        this.submitting = true;

                        if (this.cart.requiresApproval) {
                            this.cart.status = "AwaitingApproval";
                        } else {
                            this.cart.status = "Submitted";
                        }

                        this.spinnerService.show("mainLayout", true);
                        this.cartService.updateCart(this.cart, true).success(result => {
                            this.cart.id = result.id;
                            this.$window.location.href = submitSuccessUri + "?cartid=" + this.cart.id;
                        }).error(error => {
                            this.submitting = false;
                            this.spinnerService.hide();
                            this.submitErrorMessage = error.message;
                        });
                    } else {
                        this.$window.location.href = signInUri + "?returnUrl=" + this.$window.location.href;
                    }
                });
        }
    }

    angular
        .module("insite")
        .controller("ReviewAndPayController", ReviewAndPayController);
}
