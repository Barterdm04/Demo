var insite;
(function (insite) {
    var promotions;
    (function (promotions) {
        "use strict";
        var PromotionService = (function () {
            function PromotionService($http, coreService) {
                this.$http = $http;
                this.coreService = coreService;
            }
            PromotionService.prototype.getCartPromotions = function (cartId) {
                var promotionsUri = this.coreService.getApiUri("/api/v1/carts/" + cartId + "/promotions");
                return this.$http.get(promotionsUri);
            };
            PromotionService.prototype.applyCartPromotion = function (cartId, promotion) {
                var promotionsUri = this.coreService.getApiUri("/api/v1/carts/" + cartId + "/promotions");
                return this.$http.post(promotionsUri, promotion);
            };
            PromotionService.$inject = ["$http", "coreService"];
            return PromotionService;
        })();
        promotions.PromotionService = PromotionService;
        angular.module("insite").service("promotionService", PromotionService);
    })(promotions = insite.promotions || (insite.promotions = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.promotion.service.js.map