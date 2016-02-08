var insite;
(function (insite) {
    var catalog;
    (function (catalog) {
        "use strict";
        var CompareProductsService = (function () {
            function CompareProductsService($localStorage, $rootScope) {
                this.$rootScope = $rootScope;
                this.cacheKey = "compareProducts";
                this.localStorage = $localStorage;
            }
            CompareProductsService.prototype.getProductIds = function () {
                return this.localStorage.getObject(this.cacheKey, []);
            };
            CompareProductsService.prototype.addProduct = function (product) {
                var productIds = this.localStorage.getObject(this.cacheKey, []);
                if (!lodash.contains(productIds, product.id)) {
                    productIds.push(product.id);
                    this.localStorage.setObject(this.cacheKey, productIds);
                    this.$rootScope.$broadcast("addProductToCompare", product);
                    return true;
                }
                return false;
            };
            CompareProductsService.prototype.removeProduct = function (productId) {
                var productIds = this.localStorage.getObject(this.cacheKey, []);
                if (lodash.contains(productIds, productId)) {
                    lodash.pull(productIds, productId);
                    this.localStorage.setObject(this.cacheKey, productIds);
                    this.$rootScope.$broadcast("removeProductToCompare", productId);
                    return true;
                }
                return false;
            };
            CompareProductsService.prototype.removeAllProducts = function () {
                this.localStorage.setObject("compareProducts", []);
            };
            return CompareProductsService;
        })();
        catalog.CompareProductsService = CompareProductsService;
        factory.$inject = ["$localStorage", "$rootScope"];
        function factory($localStorage, $rootScope) {
            return new CompareProductsService($localStorage, $rootScope);
        }
        angular.module("insite").factory("compareProductsService", factory);
    })(catalog = insite.catalog || (insite.catalog = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.compareproducts.service.js.map