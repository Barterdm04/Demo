// controller for the quickorder cms small widget

///<reference path="../../typings/jquery/jquery.d.ts"/>
///<reference path="../../typings/angularjs/angular.d.ts"/>
///<reference path="../catalog/insite.product.service.ts"/>
///<reference path="../cart/insite.cart.service.ts"/>

module insite.quickorder {
    "use strict";

    export class QuickOrderController {
        product: ProductDto;
        alternateUnitsOfMeasure: boolean;
        canAddToCart: boolean;        
        errorMessage: string;
        searchTerm: string;
        selectedUnitOfMeasure: string;
        selectedQty: number;
        onSuggestionClick: (suggestion: { data: string }) => any;
        transformResult: (response) => any;
        orderSettings: Insite.Order.WebApi.V1.ApiModels.OrderSettingsModel;

        public static $inject = ["cartService", "productService", "sessionService", "$q", "$compile", "$scope"];

        constructor(
            protected cartService: cart.ICartService,
            protected productService: IProductService,
            protected sessionService: ISessionService,
            protected $q: ng.IQService,
            protected $compile: ng.ICompileService,
            protected $scope: ng.IScope) {
            this.init();
        }

        init() {
            this.product = null;
            this.alternateUnitsOfMeasure = true; // ??
            this.canAddToCart = true; // ?
            this.selectedUnitOfMeasure = "EA";
            this.selectedQty = 1;
            this.onSuggestionClick = ((suggestion) => this.addProduct(suggestion.data)).bind(this);
            this.transformResult = ((response) => this.autoCompleteTransformResult(response)).bind(this);
            this.$scope.$on("settingsLoaded",(event, data) => {
                this.orderSettings = data.orderSettings;
            });
        }

        addProduct(name: string) {
            if (!name || name.length == 0) {
                return;
            }
            this.findProduct(name);
        }

        findProduct(name: string) {
            var deferred = this.$q.defer();
            var parameter: insite.catalog.IProductCollectionParameters = { extendedNames: [name] };
            var expandParameter = ["pricing"];
            this.productService.getProductCollectionData(parameter, expandParameter).then(
                (result: ProductCollectionModel) => {
                    var product = result.products[0];
                    if (this.validateProduct(product)) {
                        product.qtyOrdered = 1;
                        this.product = product;
                        this.errorMessage = "";
                        deferred.resolve(result);
                    } else {
                        deferred.reject();
                    }
                },
                (result) => {
                    this.errorMessage = angular.element("#messageNotFound").val();
                    deferred.reject();
                });
            return deferred.promise;
        }

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
            product.selectedUnitOfMeasure = this.selectedUnitOfMeasure;
            this.productService.changeUnitOfMeasure(product);
        }

        addToCart(product: ProductDto) {
            if (!product) {
                if (!this.searchTerm) {
                    this.errorMessage = angular.element("#messageEnterProduct").val();
                    return;
                }
                // get the product and add it all at once
                this.findProduct(this.searchTerm).then(
                    () => {
                        this.product.qtyOrdered = this.selectedQty;
                        this.addToCartAndClearInput(this.product);
                    });
            } else {
                this.product.qtyOrdered = this.selectedQty;
                this.addToCartAndClearInput(this.product);
            }
        }

        addToCartAndClearInput(product: ProductDto) {
            if (product.qtyOrdered == 0) {
                product.qtyOrdered = 1;
            }

            this.cartService.addLineFromProduct(product).then(
                () => {
                    this.searchTerm = "";
                    this.selectedUnitOfMeasure = "EA";
                    this.product = null;
                    this.selectedQty = 1;
                });
        }

        autoCompleteTransformResult(response) {
            this.product = null;
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

    angular.module("insite")
        .controller("QuickOrderController", QuickOrderController);
}