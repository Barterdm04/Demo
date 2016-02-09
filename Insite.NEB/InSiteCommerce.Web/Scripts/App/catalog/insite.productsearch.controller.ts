import AutocompleteProductModel = Insite.Catalog.WebApi.V1.ApiModels.AutocompleteProductModel;
import ISessionService = insite.account.ISessionService;

module insite.catalog {

    "use strict";

    export class ProductSearchController {
        criteria: string;
        category: CategoryModel; // selected category if any
        categories: CategoryModel[] = [];
        listenForData: boolean;
        products: AutocompleteProductModel[] = [];
        transformResult: (response) => any;

        public static $inject = [
            "$window",
            "$localStorage",
            "productService",
            "sessionService",
            "base64",
            "$scope",
            "$rootScope",
            "$compile"
        ];

        constructor(
            protected $window: ng.IWindowService,
            protected $localStorage: core.IWindowStorage,
            protected productService: IProductService,
            protected sessionService: ISessionService,
            protected base64: any,
            protected $scope: ng.IScope,
            protected $rootScope: ng.IRootScopeService,
            protected $compile: ng.ICompileService) {

            this.init();
        }

        init() {
            if (this.listenForData) {
                this.$scope.$on("categoryTreeLoaded",(event, categories: CategoryModel[]) => {
                    this.categories = categories;
                });
            } else {
                // delay this load since it is non essential data
                setTimeout(() => this.populateDropdown(), 500);
            }

            this.transformResult = ((response) => this.autoCompleteTransformResult(response)).bind(this);
        }

        populateDropdown() {
            if (this.categories.length === 0) {
                this.productService.getCategoryTree(null, 1).success((result) => {
                    this.categories = result.categories;
                    this.$rootScope.$broadcast("categoryTreeLoaded", this.categories);
                });
            }
        }

        search() {
           
            var searchTerm = encodeURIComponent(this.criteria.trim());
            searchTerm = searchTerm.replace(/%2B|%23|%26/, ""); // ignore + # &

            if (!searchTerm)
                return;

            var url = insiteMicrositeUriPrefix + "/search?criteria=" + searchTerm;           

            if (this.category) {
                url += "&categoryId=" + this.category.id;
            }
            
            // Redirect directly to detail page if only one product is found in the autocomplete list
            if (this.products && this.products.length === 1) {
                url = this.products[0].productDetailUrl;
            }

            this.$window.location.href = url;
        }

        autoCompleteTransformResult(response) {
            return {
                suggestions: $.map($.parseJSON(response).products,(item, index) => {
                    var autoCompleteProduct: AutocompleteProductModel = <any>{
                        id: item.id,
                        productDetailUrl: item.productDetailUrl,
                        smallImagePath: item.smallImagePath,
                        shortDescription: item.shortDescription,
                        name: item.name,
                        erpNumber: item.erpNumber
                    };

                    var matchingProduct = $.grep(this.products, prod => (prod.id === autoCompleteProduct.id));

                    if (!matchingProduct || matchingProduct.length <= 0) {
                        this.products.push(autoCompleteProduct);
                    }

                    return {
                        value: item.shortDescription,
                        data: item.productDetailUrl,
                        imagePath: item.smallImagePath,
                        shortDescription: item.shortDescription,
                        name: item.name,
                        index: index
                    };
                })
            };
        }

        onSuggestionClick(suggestion) {
            window.location.href = suggestion.data;
        }
    }

    angular
        .module("insite")
        .controller("ProductSearchController", ProductSearchController);
} 