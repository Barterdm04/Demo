var insite;
(function (insite) {
    var catalog;
    (function (catalog) {
        "use strict";
        var ProductSearchController = (function () {
            function ProductSearchController($window, $localStorage, productService, sessionService, base64, $scope, $rootScope, $compile) {
                this.$window = $window;
                this.$localStorage = $localStorage;
                this.productService = productService;
                this.sessionService = sessionService;
                this.base64 = base64;
                this.$scope = $scope;
                this.$rootScope = $rootScope;
                this.$compile = $compile;
                this.categories = [];
                this.products = [];
                this.init();
            }
            ProductSearchController.prototype.init = function () {
                var _this = this;
                if (this.listenForData) {
                    this.$scope.$on("categoryTreeLoaded", function (event, categories) {
                        _this.categories = categories;
                    });
                }
                else {
                    // delay this load since it is non essential data
                    setTimeout(function () { return _this.populateDropdown(); }, 500);
                }
                this.transformResult = (function (response) { return _this.autoCompleteTransformResult(response); }).bind(this);
            };
            ProductSearchController.prototype.populateDropdown = function () {
                var _this = this;
                if (this.categories.length === 0) {
                    this.productService.getCategoryTree(null, 1).success(function (result) {
                        _this.categories = result.categories;
                        _this.$rootScope.$broadcast("categoryTreeLoaded", _this.categories);
                    });
                }
            };
            ProductSearchController.prototype.search = function () {
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
            };
            ProductSearchController.prototype.autoCompleteTransformResult = function (response) {
                var _this = this;
                return {
                    suggestions: $.map($.parseJSON(response).products, function (item, index) {
                        var autoCompleteProduct = {
                            id: item.id,
                            productDetailUrl: item.productDetailUrl,
                            smallImagePath: item.smallImagePath,
                            shortDescription: item.shortDescription,
                            name: item.name,
                            erpNumber: item.erpNumber
                        };
                        var matchingProduct = $.grep(_this.products, function (prod) { return (prod.id === autoCompleteProduct.id); });
                        if (!matchingProduct || matchingProduct.length <= 0) {
                            _this.products.push(autoCompleteProduct);
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
            };
            ProductSearchController.prototype.onSuggestionClick = function (suggestion) {
                window.location.href = suggestion.data;
            };
            ProductSearchController.$inject = [
                "$window",
                "$localStorage",
                "productService",
                "sessionService",
                "base64",
                "$scope",
                "$rootScope",
                "$compile"
            ];
            return ProductSearchController;
        })();
        catalog.ProductSearchController = ProductSearchController;
        angular.module("insite").controller("ProductSearchController", ProductSearchController);
    })(catalog = insite.catalog || (insite.catalog = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.productsearch.controller.js.map