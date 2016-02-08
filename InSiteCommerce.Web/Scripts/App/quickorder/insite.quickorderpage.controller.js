// controller for the quickorder full page widget
var insite;
(function (insite) {
    var quickorder;
    (function (quickorder) {
        "use strict";
        var QuickOrderPageController = (function () {
            function QuickOrderPageController($scope, coreService, cartService, productService, sessionService, $q, $window, $compile) {
                this.$scope = $scope;
                this.coreService = coreService;
                this.cartService = cartService;
                this.productService = productService;
                this.sessionService = sessionService;
                this.$q = $q;
                this.$window = $window;
                this.$compile = $compile;
                this.suggestions = [];
                this.init();
            }
            QuickOrderPageController.prototype.init = function () {
                var _this = this;
                this.products = [];
                this.$scope.$on("settingsLoaded", function (event, data) {
                    _this.settings = data.productSettings;
                    _this.orderSettings = data.orderSettings;
                });
                this.onSuggestionClick = (function (suggestion) { return _this.addProduct(suggestion.data); }).bind(this);
                this.transformResult = (function (response) { return _this.autoCompleteTransformResult(response); }).bind(this);
            };
            // look up and add a product by extended name
            QuickOrderPageController.prototype.addProduct = function (name) {
                var _this = this;
                if (!name || name.length == 0) {
                    return;
                }
                var parameter = { extendedNames: [name] };
                var expandParameter = ["pricing"];
                this.productService.getProductCollectionData(parameter, expandParameter).then(function (result) {
                    // TODO we may need to refresh the foundation tooltip, used to be insite.core.refreshFoundationUI
                    var product = result.products[0];
                    if (_this.validateProduct(product)) {
                        product.qtyOrdered = 1;
                        _this.products.push(product);
                        _this.searchTerm = "";
                        _this.errorMessage = "";
                    }
                }, function (error) {
                    _this.errorMessage = angular.element("#messageNotFound").val();
                });
            };
            // returns true if the product is allowed to be quick ordered
            QuickOrderPageController.prototype.validateProduct = function (product) {
                if (product.canConfigure || (product.isConfigured && !product.isFixedConfiguration)) {
                    this.errorMessage = angular.element("#messageConfigurableProduct").val();
                    return false;
                }
                if (product.isStyleProductParent) {
                    this.errorMessage = angular.element("#messageStyledProduct").val();
                    return false;
                }
                if (!product.canAddToCart) {
                    this.errorMessage = angular.element("#messageUnavailable").val();
                    return false;
                }
                return true;
            };
            QuickOrderPageController.prototype.changeUnitOfMeasure = function (product) {
                if (!product.productUnitOfMeasures) {
                    return;
                }
                // this calls to get a new price and updates the product which updates the ui
                this.productService.changeUnitOfMeasure(product);
            };
            QuickOrderPageController.prototype.quantityInput = function (product) {
                this.productService.getProductPrice(product);
            };
            // add all lines to cart and redirect to cart page
            QuickOrderPageController.prototype.addAllToCart = function (redirectUrl) {
                var _this = this;
                this.cartService.addLineCollectionFromProducts(this.products).then(function (result) {
                    _this.$window.location.href = redirectUrl;
                });
            };
            QuickOrderPageController.prototype.allQtysIsValid = function () {
                return this.products.every(function (product) {
                    return product.qtyOrdered && parseFloat(product.qtyOrdered.toString()) > 0;
                });
            };
            QuickOrderPageController.prototype.removeProduct = function (product) {
                this.products.splice(this.products.indexOf(product), 1);
            };
            // returns the grand total of all lines prices, in the same currency format
            QuickOrderPageController.prototype.grandTotal = function () {
                var total = 0;
                var currencySymbol = "";
                var decimalSymbol = ".";
                angular.forEach(this.products, function (product) {
                    if (!product.quoteRequired) {
                        var fullPrice = product.pricing.extendedActualPriceDisplay;
                        // this code assumes decimal/thousands separators are either , or .
                        decimalSymbol = fullPrice[fullPrice.length - 3];
                        currencySymbol = fullPrice.substring(0, 1);
                        if (decimalSymbol === ".") {
                            total += parseFloat(fullPrice.substring(1).replace(/,/g, ""));
                        }
                        else {
                            total += parseFloat(fullPrice.substring(1).replace(/\./g, "").replace(",", "."));
                        }
                    }
                });
                var formattedTotal = currencySymbol + total.toFixed(2);
                if (decimalSymbol === ".") {
                    formattedTotal = formattedTotal.replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
                }
                else {
                    formattedTotal = formattedTotal.replace(".", ",");
                    formattedTotal = formattedTotal.replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
                }
                return formattedTotal;
            };
            QuickOrderPageController.prototype.autoCompleteTransformResult = function (response) {
                return {
                    suggestions: $.map($.parseJSON(response).products, function (item, index) {
                        return {
                            value: item.shortDescription,
                            name: item.name,
                            data: item.name,
                            imagePath: item.smallImagePath,
                            shortDescription: item.shortDescription,
                            index: index
                        };
                    })
                };
            };
            QuickOrderPageController.$inject = [
                "$scope",
                "coreService",
                "cartService",
                "productService",
                "sessionService",
                "$q",
                "$window",
                "$compile"
            ];
            return QuickOrderPageController;
        })();
        quickorder.QuickOrderPageController = QuickOrderPageController;
        angular.module("insite").controller("QuickOrderPageController", QuickOrderPageController);
    })(quickorder = insite.quickorder || (insite.quickorder = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.quickorderpage.controller.js.map