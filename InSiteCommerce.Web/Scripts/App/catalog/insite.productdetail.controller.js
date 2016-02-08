var cart = insite.cart;
var insite;
(function (insite) {
    var catalog;
    (function (catalog) {
        "use strict";
        var ProductDetailController = (function () {
            function ProductDetailController($scope, $filter, coreService, cartService, productService) {
                this.$scope = $scope;
                this.$filter = $filter;
                this.coreService = coreService;
                this.cartService = cartService;
                this.productService = productService;
                this.configurationSelection = [];
                this.configurationCompleted = false;
                this.styleSelection = [];
                this.styleSelectionCompleted = false;
                this.parentProduct = null;
                this.initialStyleTraits = [];
                this.initialStyledProducts = [];
                this.styleTraitFiltered = [];
                this.init();
            }
            ProductDetailController.prototype.init = function () {
                var _this = this;
                this.cartService.preventCartLoad = true;
                this.$scope.$on("settingsLoaded", function (event, data) {
                    _this.settings = data.productSettings;
                });
                this.resolvePage();
            };
            ProductDetailController.prototype.resolvePage = function () {
                var _this = this;
                var path = window.location.pathname;
                this.productService.getCatalogPage(path).then(function (result) {
                    var productId = result.productId; // this url is already known to map to a single product so productId should always be non null.
                    _this.category = result.category;
                    _this.breadCrumbs = result.breadCrumbs;
                    _this.getProductData(productId.toString());
                }, function (error) {
                });
            };
            ProductDetailController.prototype.getProductData = function (productId) {
                var _this = this;
                var expandParameter = ["documents", "specifications", "styledproducts", "htmlcontent", "attributes", "crosssells", "pricing"];
                this.productService.getProductData(this.category != null ? this.category.id.toString() : null, productId, expandParameter).then(function (result) {
                    _this.product = result.product;
                    _this.product.qtyOrdered = 1;
                    if (_this.product.isConfigured && _this.product.configurationDto && _this.product.configurationDto.sections)
                        _this.initConfigurationSelection(_this.product.configurationDto.sections);
                    if (_this.product.styleTraits.length > 0) {
                        _this.initialStyledProducts = _this.product.styledProducts.slice();
                        _this.styleTraitFiltered = _this.product.styleTraits.slice();
                        _this.initialStyleTraits = _this.product.styleTraits.slice();
                        if (_this.product.isStyleProductParent) {
                            _this.parentProduct = angular.copy(_this.product);
                        }
                        _this.initStyleSelection(_this.product.styleTraits);
                    }
                    ;
                    setTimeout(function () {
                        $(".easy-resp-tabs").easyResponsiveTabs();
                    }, 10);
                    _this.cartService.preventCartLoad = false;
                    _this.cartService.getCart();
                }, function (error) {
                });
            };
            ProductDetailController.prototype.initConfigurationSelection = function (sections) {
                var _this = this;
                angular.forEach(sections, function (section) {
                    var result = _this.coreService.getObjectByPropertyValue(section.options, { selected: "true" });
                    _this.configurationSelection.push(result);
                });
                this.configurationCompleted = this.isConfigurationCompleted();
            };
            ProductDetailController.prototype.initStyleSelection = function (styleTraits) {
                var _this = this;
                angular.forEach(styleTraits, function (styleTrait) {
                    var result = _this.coreService.getObjectByPropertyValue(styleTrait.styleValues, { isDefault: "true" });
                    _this.styleSelection.push(result);
                });
                this.styleChange();
            };
            ProductDetailController.prototype.addToCart = function (product) {
                var sectionOptions = null;
                if (this.configurationCompleted && product.configurationDto && product.configurationDto.sections) {
                    sectionOptions = this.configurationSelection;
                }
                this.cartService.addLineFromProduct(product, sectionOptions);
            };
            ProductDetailController.prototype.openWishListPopup = function (product) {
                var products = [];
                products.push(product);
                this.coreService.openWishListPopup(products);
            };
            ProductDetailController.prototype.changeUnitOfMeasure = function (product) {
                this.product = this.productService.changeUnitOfMeasure(product);
                if (this.parentProduct) {
                    this.parentProduct.selectedUnitOfMeasure = product.selectedUnitOfMeasure;
                    this.parentProduct.unitOfMeasureDisplay = product.unitOfMeasureDisplay;
                }
            };
            ProductDetailController.prototype.styleChange = function () {
                var _this = this;
                var styledProductsFiltered = [];
                angular.copy(this.initialStyleTraits, this.styleTraitFiltered); // init styleTraitFiltered to display
                // loop trough every trait and compose values
                this.styleTraitFiltered.forEach(function (styleTrait) {
                    if (styleTrait) {
                        styledProductsFiltered = _this.initialStyledProducts.slice();
                        // iteratively filter products for selected traits (except current)
                        _this.styleSelection.forEach(function (styleValue) {
                            if (styleValue && styleValue.styleTraitId != styleTrait.styleTraitId) {
                                styledProductsFiltered = _this.getProductsByStyleTraitValueId(styledProductsFiltered, styleValue.styleTraitValueId);
                            }
                        });
                        // for current trait get all distinct values in filtered products
                        var filteredValues = [];
                        styledProductsFiltered.forEach(function (product) {
                            var currentProduct = _this.coreService.getObjectByPropertyValue(product.styleValues, { styleTraitId: styleTrait.styleTraitId }); // get values for current product
                            var isProductInFilteredList = currentProduct && filteredValues.some(function (item) {
                                return item.styleTraitValueId == currentProduct.styleTraitValueId;
                            }); // check if value already selected
                            if (currentProduct && !isProductInFilteredList) {
                                filteredValues.push(currentProduct);
                            }
                        });
                        styleTrait.styleValues = filteredValues.slice();
                    }
                });
                this.styleSelectionCompleted = this.isStyleSelectionCompleted();
                if (this.styleSelectionCompleted) {
                    var selectedProduct = this.getSelectedStyleProduct(styledProductsFiltered);
                    if (selectedProduct) {
                        this.defineCompletedStyleProduct(selectedProduct);
                        this.product.isStyleProductParent = false;
                    }
                }
                else {
                    if (!this.product.isStyleProductParent) {
                        // displaying parent product when style selection is not completed and completed product was displayed
                        if (this.parentProduct.productUnitOfMeasures && this.parentProduct.productUnitOfMeasures.length > 1) {
                            this.parentProduct.selectedUnitOfMeasure = this.product.selectedUnitOfMeasure ? this.product.selectedUnitOfMeasure : this.parentProduct.selectedUnitOfMeasure;
                            this.productService.getProductPrice(this.parentProduct).then(function () {
                                _this.product = angular.copy(_this.parentProduct);
                            });
                        }
                        else {
                            this.product = angular.copy(this.parentProduct);
                        }
                    }
                }
            };
            ProductDetailController.prototype.getSelectedStyleProduct = function (styledProducts) {
                var _this = this;
                var finalProductList;
                this.styleSelection.forEach(function (styleValue) {
                    finalProductList = _this.getProductsByStyleTraitValueId(styledProducts, styleValue.styleTraitValueId);
                });
                return (finalProductList && finalProductList.length > 0) ? finalProductList[0] : null;
            };
            ProductDetailController.prototype.getProductsByStyleTraitValueId = function (styledProducts, styleTraitValueId) {
                return styledProducts.filter(function (product) {
                    return product.styleValues.some(function (value) {
                        return value.styleTraitValueId == styleTraitValueId;
                    });
                });
            };
            //TODO: HP: Do we need to copy all values?
            ProductDetailController.prototype.defineCompletedStyleProduct = function (styledProduct) {
                this.product.erpNumber = styledProduct.erpNumber;
                this.product.largeImagePath = styledProduct.largeImagePath;
                this.product.name = styledProduct.name;
                this.product.id = styledProduct.productId;
                this.product.qtyOnHand = styledProduct.qtyOnHand;
                this.product.quoteRequired = styledProduct.quoteRequired;
                this.product.shortDescription = styledProduct.shortDescription;
                this.product.smallImagePath = styledProduct.smallImagePath;
                this.product.availability = styledProduct.availability;
                if (this.product.productUnitOfMeasures && this.product.productUnitOfMeasures.length > 1) {
                    this.productService.getProductPrice(this.product);
                }
                else {
                    this.product.pricing = styledProduct.pricing;
                    this.product.quoteRequired = styledProduct.quoteRequired;
                }
            };
            ProductDetailController.prototype.isStyleSelectionCompleted = function () {
                if (!this.product.styleTraits)
                    return true;
                return this.styleSelection.every(function (item) {
                    return item != null;
                });
            };
            ProductDetailController.prototype.isConfigurationCompleted = function () {
                if (!this.product.isConfigured)
                    return true;
                return this.configurationSelection.every(function (item) {
                    return item != null;
                });
            };
            ProductDetailController.prototype.configChanged = function () {
                this.configurationCompleted = this.isConfigurationCompleted();
                this.getConfigurablePrice(this.product);
            };
            ProductDetailController.prototype.getConfigurablePrice = function (product) {
                var configuration = [];
                angular.forEach(this.configurationSelection, function (selection) {
                    configuration.push(selection ? selection.sectionOptionId.toString() : "");
                });
                this.productService.getProductPrice(product, configuration);
            };
            ProductDetailController.$inject = ["$scope", "$filter", "coreService", "cartService", "productService"];
            return ProductDetailController;
        })();
        catalog.ProductDetailController = ProductDetailController;
        angular.module("insite").controller("ProductDetailController", ProductDetailController);
    })(catalog = insite.catalog || (insite.catalog = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.productdetail.controller.js.map