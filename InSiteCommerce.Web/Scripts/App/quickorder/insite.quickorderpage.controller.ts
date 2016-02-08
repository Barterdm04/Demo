// controller for the quickorder full page widget

///<reference path="../_typelite/insite.models.d.ts"/>
///<reference path="../catalog/insite.product.service.ts"/>
///<reference path="../../typings/angularjs/angular.d.ts"/>
///<reference path="../cart/insite.cart.service.ts"/>

import OrderSettingsModel = Insite.Order.WebApi.V1.ApiModels.OrderSettingsModel;

module insite.quickorder {
    "use strict";

    export class QuickOrderPageController {

        products: ProductDto[];
        searchTerm: string;
        errorMessage: string;
        settings: ProductSettingsModel;
        orderSettings: OrderSettingsModel;
        suggestions: any[] = [];
        onSuggestionClick: (suggestion: { data: string }) => any;
        transformResult: (response) => any;

        public static $inject = [
            "$scope",
            "coreService",
            "cartService",
            "productService",
            "sessionService", 
            "$q",
            "$window",
            "$compile"];

        constructor(
            protected $scope: ng.IScope,
            protected coreService: core.ICoreService,
            protected cartService: cart.ICartService,
            protected productService: catalog.IProductService,
            protected sessionService: ISessionService,
            protected $q: ng.IQService,
            protected $window: ng.IWindowService,
            protected $compile: ng.ICompileService) {

            this.init();
        }

        init() {
            this.products = [];
            this.$scope.$on("settingsLoaded",(event, data) => {
                this.settings = data.productSettings;
                this.orderSettings = data.orderSettings;
            });
            this.onSuggestionClick = ((suggestion) => this.addProduct(suggestion.data)).bind(this);
            this.transformResult = ((response) => this.autoCompleteTransformResult(response)).bind(this);
        }

        // look up and add a product by extended name
        addProduct(name: string) {
            if (!name || name.length == 0) {
                return;
            }
            var parameter: insite.catalog.IProductCollectionParameters = { extendedNames: [name] };
            var expandParameter = ["pricing"];
            this.productService.getProductCollectionData(parameter, expandParameter).then(
                result => {
                    // TODO we may need to refresh the foundation tooltip, used to be insite.core.refreshFoundationUI
                    var product = result.products[0];
                    if (this.validateProduct(product)) {
                        product.qtyOrdered = 1;
                        this.products.push(product);
                        this.searchTerm = "";
                        this.errorMessage = "";
                    }
                },
                error => {
                    this.errorMessage = angular.element("#messageNotFound").val();
                });
        }

        // returns true if the product is allowed to be quick ordered
        validateProduct(product: ProductDto) {

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
        }

        changeUnitOfMeasure(product: ProductDto) {
            if (!product.productUnitOfMeasures) {
                return;
            }
            // this calls to get a new price and updates the product which updates the ui
            this.productService.changeUnitOfMeasure(product);
        }

        quantityInput(product: ProductDto) {
            this.productService.getProductPrice(product);
        }

        // add all lines to cart and redirect to cart page
        addAllToCart(redirectUrl: string) {
            this.cartService.addLineCollectionFromProducts(this.products).then(result => {
                this.$window.location.href = redirectUrl;
            });
        }

        allQtysIsValid() {
            return this.products.every((product: ProductDto) => {
                return product.qtyOrdered && parseFloat(product.qtyOrdered.toString()) > 0;
            });
        }

        removeProduct(product: ProductDto) {
            this.products.splice(this.products.indexOf(product), 1);
        }

        // returns the grand total of all lines prices, in the same currency format
        grandTotal() {
            var total = 0;
            var currencySymbol = "";
            var decimalSymbol = ".";
            angular.forEach(this.products, product => {
                if (!product.quoteRequired) {
                    var fullPrice = product.pricing.extendedActualPriceDisplay;
                    // this code assumes decimal/thousands separators are either , or .
                    decimalSymbol = fullPrice[fullPrice.length - 3];
                    currencySymbol = fullPrice.substring(0, 1);
                    if (decimalSymbol === ".") {
                        total += parseFloat(fullPrice.substring(1).replace(/,/g, ""));
                    } else {
                        total += parseFloat(fullPrice.substring(1).replace(/\./g, "").replace(",", "."));
                    }
                }
            });
            var formattedTotal = currencySymbol + total.toFixed(2);
            if (decimalSymbol === ".") {
                formattedTotal = formattedTotal.replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            } else {
                formattedTotal = formattedTotal.replace(".", ",");
                formattedTotal = formattedTotal.replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
            }
            return formattedTotal;
        }

        autoCompleteTransformResult(response) {
            return {
                suggestions: $.map($.parseJSON(response).products,(item, index) => {
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
        }
    }

    angular
        .module("insite")
        .controller("QuickOrderPageController", QuickOrderPageController);
}
