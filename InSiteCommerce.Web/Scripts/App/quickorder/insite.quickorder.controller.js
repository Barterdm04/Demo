// controller for the quickorder cms small widget
///<reference path="../../typings/jquery/jquery.d.ts"/>
///<reference path="../../typings/angularjs/angular.d.ts"/>
///<reference path="../catalog/insite.product.service.ts"/>
///<reference path="../cart/insite.cart.service.ts"/>
var insite;
(function (insite) {
    var quickorder;
    (function (quickorder) {
        "use strict";
        var QuickOrderController = (function () {
            function QuickOrderController(cartService, productService, sessionService, $q, $compile, $scope) {
                this.cartService = cartService;
                this.productService = productService;
                this.sessionService = sessionService;
                this.$q = $q;
                this.$compile = $compile;
                this.$scope = $scope;
                this.init();
            }
            QuickOrderController.prototype.init = function () {
                var _this = this;
                this.product = null;
                this.alternateUnitsOfMeasure = true; // ??
                this.canAddToCart = true; // ?
                this.selectedUnitOfMeasure = "EA";
                this.selectedQty = 1;
                this.onSuggestionClick = (function (suggestion) { return _this.addProduct(suggestion.data); }).bind(this);
                this.transformResult = (function (response) { return _this.autoCompleteTransformResult(response); }).bind(this);
                this.$scope.$on("settingsLoaded", function (event, data) {
                    _this.orderSettings = data.orderSettings;
                });
            };
            QuickOrderController.prototype.addProduct = function (name) {
                if (!name || name.length == 0) {
                    return;
                }
                this.findProduct(name);
            };
            QuickOrderController.prototype.findProduct = function (name) {
                var _this = this;
                var deferred = this.$q.defer();
                var parameter = { extendedNames: [name] };
                var expandParameter = ["pricing"];
                this.productService.getProductCollectionData(parameter, expandParameter).then(function (result) {
                    var product = result.products[0];
                    if (_this.validateProduct(product)) {
                        product.qtyOrdered = 1;
                        _this.product = product;
                        _this.errorMessage = "";
                        deferred.resolve(result);
                    }
                    else {
                        deferred.reject();
                    }
                }, function (result) {
                    _this.errorMessage = angular.element("#messageNotFound").val();
                    deferred.reject();
                });
                return deferred.promise;
            };
            QuickOrderController.prototype.validateProduct = function (product) {
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
            QuickOrderController.prototype.changeUnitOfMeasure = function (product) {
                if (!product.productUnitOfMeasures) {
                    return;
                }
                // this calls to get a new price and updates the product which updates the ui
                product.selectedUnitOfMeasure = this.selectedUnitOfMeasure;
                this.productService.changeUnitOfMeasure(product);
            };
            QuickOrderController.prototype.addToCart = function (product) {
                var _this = this;
                if (!product) {
                    if (!this.searchTerm) {
                        this.errorMessage = angular.element("#messageEnterProduct").val();
                        return;
                    }
                    // get the product and add it all at once
                    this.findProduct(this.searchTerm).then(function () {
                        _this.product.qtyOrdered = _this.selectedQty;
                        _this.addToCartAndClearInput(_this.product);
                    });
                }
                else {
                    this.product.qtyOrdered = this.selectedQty;
                    this.addToCartAndClearInput(this.product);
                }
            };
            QuickOrderController.prototype.addToCartAndClearInput = function (product) {
                var _this = this;
                if (product.qtyOrdered == 0) {
                    product.qtyOrdered = 1;
                }
                this.cartService.addLineFromProduct(product).then(function () {
                    _this.searchTerm = "";
                    _this.selectedUnitOfMeasure = "EA";
                    _this.product = null;
                    _this.selectedQty = 1;
                });
            };
            QuickOrderController.prototype.autoCompleteTransformResult = function (response) {
                this.product = null;
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
            QuickOrderController.$inject = ["cartService", "productService", "sessionService", "$q", "$compile", "$scope"];
            return QuickOrderController;
        })();
        quickorder.QuickOrderController = QuickOrderController;
        angular.module("insite").controller("QuickOrderController", QuickOrderController);
    })(quickorder = insite.quickorder || (insite.quickorder = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.quickorder.controller.js.map