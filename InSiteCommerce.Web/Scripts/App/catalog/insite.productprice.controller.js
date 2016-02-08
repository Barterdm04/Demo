var insite;
(function (insite) {
    var catalog;
    (function (catalog) {
        "use strict";
        // controller for isc-product-price directive
        var ProductPriceController = (function () {
            function ProductPriceController($scope) {
                this.$scope = $scope;
            }
            ProductPriceController.prototype.getActualPrice = function (product) {
                var priceBreak = this.getBreakPrice(product.pricing.actualBreakPrices, product.qtyOrdered);
                if (product.pricing.isOnSale && priceBreak && (product.pricing.actualPrice < priceBreak.breakPrice)) {
                    return product.pricing.actualPriceDisplay;
                }
                return this.getPrice(product.pricing.actualBreakPrices, product.pricing.actualPriceDisplay, product.qtyOrdered);
                ;
            };
            ProductPriceController.prototype.getRegularPrice = function (product) {
                return this.getPrice(product.pricing.regularBreakPrices, product.pricing.regularPriceDisplay, product.qtyOrdered);
            };
            ProductPriceController.prototype.getPrice = function (breaks, priceToDisplay, qty) {
                qty = !qty || qty === "0" ? 1 : qty;
                if (this.conditionBreakPrice(breaks, qty)) {
                    return priceToDisplay;
                }
                var breakPrice = this.getBreakPrice(breaks, qty);
                return breakPrice.breakPriceDisplay;
            };
            ProductPriceController.prototype.conditionBreakPrice = function (breaks, count) {
                return !breaks || breaks.length === 0 || count === 0;
            };
            ProductPriceController.prototype.getBreakPrice = function (breaks, count) {
                if (!breaks) {
                    return null;
                }
                var copyBreaks = breaks.slice();
                copyBreaks.sort(function (a, b) {
                    return b.breakQty - a.breakQty;
                });
                for (var i = 0; i < copyBreaks.length; i++) {
                    if (copyBreaks[i].breakQty <= count) {
                        return copyBreaks[i];
                    }
                }
                return copyBreaks[copyBreaks.length];
            };
            ProductPriceController.$inject = [
                "$scope"
            ];
            return ProductPriceController;
        })();
        catalog.ProductPriceController = ProductPriceController;
        ;
        angular.module("insite").controller("ProductPriceController", ProductPriceController);
    })(catalog = insite.catalog || (insite.catalog = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.productprice.controller.js.map