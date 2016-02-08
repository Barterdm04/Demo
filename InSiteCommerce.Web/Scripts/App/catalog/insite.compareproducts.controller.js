var insite;
(function (insite) {
    var catalog;
    (function (catalog) {
        "use strict";
        var CompareProductsController = (function () {
            function CompareProductsController($scope, $window, cartService, coreService, productService, compareProductsService) {
                this.$scope = $scope;
                this.$window = $window;
                this.cartService = cartService;
                this.coreService = coreService;
                this.productService = productService;
                this.compareProductsService = compareProductsService;
                this.ready = false;
                this.init();
            }
            CompareProductsController.prototype.init = function () {
                var _this = this;
                this.productsToCompare = [];
                this.relevantAttributeTypes = [];
                var productsToCompare = this.compareProductsService.getProductIds();
                var expandParameter = ["styledproducts", "attributes", "pricing"];
                var parameter = { productIds: productsToCompare };
                this.productService.getProductCollectionData(parameter, expandParameter).then(function (result) {
                    _this.productsToCompare = result.products;
                    if (_this.productsToCompare.length > 0) {
                        var allAttributeTypes = lodash.chain(_this.productsToCompare).pluck("attributeTypes").flatten(true).where({ "isComparable": true }).sortBy("label").value();
                        _this.relevantAttributeTypes = [];
                        allAttributeTypes.forEach(function (attributeType) {
                            if (!lodash.some(_this.relevantAttributeTypes, function (relevantAttributeType) { return relevantAttributeType.id === attributeType.id; })) {
                                _this.relevantAttributeTypes.push(attributeType);
                            }
                        });
                    }
                    _this.ready = true;
                }, function (error) {
                });
                this.$scope.$on("settingsLoaded", function (event, data) {
                    _this.productSettings = data.productSettings;
                });
            };
            // gets all attribute value display strings available for a given attribute type
            CompareProductsController.prototype.getAttributeTypeValuesForAllProducts = function (attributeTypeId) {
                if (!attributeTypeId) {
                    return [];
                }
                return lodash.chain(this.productsToCompare).pluck("attributeTypes").flatten(true).where({ "id": attributeTypeId }).pluck("attributeValues").flatten(true).pluck("valueDisplay").value();
            };
            // returns all attribute value display strings belonging to products for a given attribute type
            CompareProductsController.prototype.getUniqueAttributeTypeValuesForAllProducts = function (attributeTypeId) {
                var _this = this;
                var attributeValues = [];
                this.productsToCompare.forEach(function (product) {
                    attributeValues = attributeValues.concat(_this.getAttributeValuesForProduct(product, attributeTypeId));
                });
                return lodash.uniq(attributeValues);
            };
            // returns the attribute value display string for a given product and attribute type
            CompareProductsController.prototype.getAttributeValuesForProduct = function (product, attributeTypeId) {
                if (!product || !attributeTypeId) {
                    return [];
                }
                return lodash.chain(product.attributeTypes).where({ "id": attributeTypeId }).pluck("attributeValues").flatten(true).pluck("valueDisplay").value();
            };
            // returns a list of products with a given attribute value
            CompareProductsController.prototype.getProductsThatContainAttributeTypeIdAndAttributeValue = function (attributeTypeId, attributeValue) {
                var _this = this;
                if (!attributeTypeId || !attributeValue) {
                    return [];
                }
                var productsThatContainsAttributeTypeIdAndAttributeValue = [];
                this.productsToCompare.forEach(function (product) {
                    var attributeValues = _this.getAttributeValuesForProduct(product, attributeTypeId);
                    var hasAttributeTypeIdAndAttributeValue = attributeValues.length > 0 && lodash.indexOf(attributeValues, attributeValue) > -1;
                    hasAttributeTypeIdAndAttributeValue && productsThatContainsAttributeTypeIdAndAttributeValue.push(product);
                });
                return productsThatContainsAttributeTypeIdAndAttributeValue;
            };
            CompareProductsController.prototype.addToCart = function (product) {
                this.cartService.addLineFromProduct(product);
            };
            CompareProductsController.prototype.removeComparedProduct = function (productId) {
                this.compareProductsService.removeProduct(productId);
            };
            CompareProductsController.prototype.openWishListPopup = function (product) {
                var products = [];
                products.push(product);
                this.coreService.openWishListPopup(products);
            };
            CompareProductsController.prototype.removeAllComparedProducts = function () {
                this.compareProductsService.removeAllProducts();
                this.productsToCompare = [];
                this.goBack();
            };
            CompareProductsController.prototype.goBack = function () {
                this.$window.history.back();
            };
            CompareProductsController.$inject = [
                "$scope",
                "$window",
                "cartService",
                "coreService",
                "productService",
                "compareProductsService"
            ];
            return CompareProductsController;
        })();
        catalog.CompareProductsController = CompareProductsController;
        angular.module("insite").controller("CompareProductsController", CompareProductsController);
    })(catalog = insite.catalog || (insite.catalog = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.compareproducts.controller.js.map