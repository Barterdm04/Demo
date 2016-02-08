var insite;
(function (insite) {
    var catalog;
    (function (catalog) {
        "use strict";
        var ProductComparisonHopperController = (function () {
            function ProductComparisonHopperController($rootScope, productService, compareProductsService) {
                this.$rootScope = $rootScope;
                this.productService = productService;
                this.compareProductsService = compareProductsService;
                this.init();
            }
            ProductComparisonHopperController.prototype.init = function () {
                var _this = this;
                this.productsToCompare = []; // full product objects
                // add product from product list controller
                this.$rootScope.$on("addProductToCompare", function (e, product) {
                    _this.addProductToCompare(product);
                });
                // remove product from product list controller
                this.$rootScope.$on("removeProductToCompare", function (e, productId) {
                    _this.removeProductToCompare(productId);
                });
                this.setProductData();
            };
            ProductComparisonHopperController.prototype.canShowCompareHopper = function () {
                return this.productsToCompare.length > 0;
            };
            ProductComparisonHopperController.prototype.setProductData = function () {
                var _this = this;
                var productIdsToCompare = this.compareProductsService.getProductIds();
                if (productIdsToCompare && productIdsToCompare.length > 0) {
                    var parameter = { productIds: productIdsToCompare };
                    this.productService.getProductCollectionData(parameter).then(function (result) {
                        _this.productsToCompare = result.products;
                    }, function (error) {
                    });
                }
            };
            ProductComparisonHopperController.prototype.addProductToCompare = function (product) {
                this.productsToCompare.push(product);
            };
            ProductComparisonHopperController.prototype.removeProductToCompare = function (productId) {
                lodash.remove(this.productsToCompare, function (p) { return (p.id === productId); });
            };
            ProductComparisonHopperController.prototype.clickRemove = function (product) {
                this.removeProductToCompare(product.id.toString());
                if (this.compareProductsService.removeProduct(product.id.toString())) {
                    this.updateProductList();
                }
            };
            ProductComparisonHopperController.prototype.removeAllProductsToCompare = function () {
                this.compareProductsService.removeAllProducts();
                this.productsToCompare = [];
                this.updateProductList();
            };
            // tell the product list page to clear compare check boxes
            ProductComparisonHopperController.prototype.updateProductList = function () {
                this.$rootScope.$broadcast("compareProductsUpdated");
            };
            ProductComparisonHopperController.$inject = [
                "$rootScope",
                "productService",
                "compareProductsService"
            ];
            return ProductComparisonHopperController;
        })();
        catalog.ProductComparisonHopperController = ProductComparisonHopperController;
        angular.module("insite").controller("ProductComparisonHopperController", ProductComparisonHopperController);
    })(catalog = insite.catalog || (insite.catalog = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.productcomparisonhopper.controller.js.map