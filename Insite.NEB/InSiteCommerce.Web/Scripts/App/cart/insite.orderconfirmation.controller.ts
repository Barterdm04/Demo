module insite.cart {
    "use strict";

    export class OrderConfirmationController {

        cart: CartModel;
        promotions: PromotionModel[];
        showRfqMessage: boolean;

        static $inject = [
            "cartService"
            , "promotionService"
            , "coreService"
        ];

        constructor(
            protected cartService: ICartService,
            protected promotionService: promotions.IPromotionService,
            protected coreService: core.ICoreService)
        {
            this.init();
        }


        init() {
            // get the current cart to update the mini cart
            this.cartService.getCart().then(result => {
                this.showRfqMessage = result.canRequestQuote && result.quoteRequiredCount > 0;
            });

            var confirmedOrderId = this.coreService.getQueryStringParameter("cartid", true);

            this.cartService.expand = "cartlines,carriers";

            this.cartService.getCart(confirmedOrderId).then(cart => {
                this.cart = cart;

                this.promotionService.getCartPromotions(confirmedOrderId).success((result: PromotionCollectionModel) => {
                    this.promotions = result.promotions;
                });
            });
        }
    }

    angular
        .module("insite")
        .controller("OrderConfirmationController", OrderConfirmationController);
}
