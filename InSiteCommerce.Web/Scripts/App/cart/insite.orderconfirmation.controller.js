var insite;
(function (insite) {
    var cart;
    (function (_cart) {
        "use strict";
        var OrderConfirmationController = (function () {
            function OrderConfirmationController(cartService, promotionService, coreService) {
                this.cartService = cartService;
                this.promotionService = promotionService;
                this.coreService = coreService;
                this.init();
            }
            OrderConfirmationController.prototype.init = function () {
                var _this = this;
                // get the current cart to update the mini cart
                this.cartService.getCart().then(function (result) {
                    _this.showRfqMessage = result.canRequestQuote && result.quoteRequiredCount > 0;
                });
                var confirmedOrderId = this.coreService.getQueryStringParameter("cartid", true);
                this.cartService.expand = "cartlines,carriers";
                this.cartService.getCart(confirmedOrderId).then(function (cart) {
                    _this.cart = cart;
                    _this.promotionService.getCartPromotions(confirmedOrderId).success(function (result) {
                        _this.promotions = result.promotions;
                    });
                });
            };
            OrderConfirmationController.$inject = [
                "cartService",
                "promotionService",
                "coreService"
            ];
            return OrderConfirmationController;
        })();
        _cart.OrderConfirmationController = OrderConfirmationController;
        angular.module("insite").controller("OrderConfirmationController", OrderConfirmationController);
    })(cart = insite.cart || (insite.cart = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.orderconfirmation.controller.js.map