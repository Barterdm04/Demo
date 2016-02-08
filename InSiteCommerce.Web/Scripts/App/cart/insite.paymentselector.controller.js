var insite;
(function (insite) {
    var cart;
    (function (cart) {
        "use strict";
        var PaymentSelectorController = (function () {
            function PaymentSelectorController(promotionService) {
                this.promotionService = promotionService;
            }
            PaymentSelectorController.prototype.applyPromotion = function () {
                var _this = this;
                this.promotionAppliedMessage = "";
                this.promotionErrorMessage = "";
                var promotion = {
                    "promotionCode": this.promotionCode
                };
                this.promotionService.applyCartPromotion(this.cartId, promotion).success(function (result) {
                    if (result.promotionApplied) {
                        _this.promotionAppliedMessage = result.message;
                    }
                    else {
                        _this.promotionErrorMessage = result.message;
                    }
                }).error(function (error) {
                    _this.promotionErrorMessage = error.message;
                }).finally(this.applyPromotionCallback);
            };
            PaymentSelectorController.$inject = [
                "promotionService"
            ];
            return PaymentSelectorController;
        })();
        cart.PaymentSelectorController = PaymentSelectorController;
        angular.module("insite").controller("PaymentSelectorController", PaymentSelectorController);
    })(cart = insite.cart || (insite.cart = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.paymentselector.controller.js.map