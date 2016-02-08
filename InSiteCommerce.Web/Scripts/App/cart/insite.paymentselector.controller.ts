module insite.cart {
    "use strict";

    export class PaymentSelectorController {

        cart: CartModel;
        cartId: string;
        promotionAppliedMessage: string;
        promotionCode: string;
        promotionErrorMessage: string;
        applyPromotionCallback: () => void;

        static $inject = [
            "promotionService"
        ];

        constructor(protected promotionService: promotions.IPromotionService) {
        }


        applyPromotion() {
            this.promotionAppliedMessage = "";
            this.promotionErrorMessage = "";

            var promotion = {
                "promotionCode": this.promotionCode
            };

            this.promotionService.applyCartPromotion(this.cartId, promotion).success(result => {
                if (result.promotionApplied) {
                    this.promotionAppliedMessage = result.message;
                } else {
                    this.promotionErrorMessage = result.message;
                }
            }).error(error => {
                this.promotionErrorMessage = error.message;
            }).finally(this.applyPromotionCallback);
        }
    }

    angular
        .module("insite")
        .controller("PaymentSelectorController", PaymentSelectorController);
}
