/// <reference path="../_typelite/insite.models.d.ts" />
/// <reference path="../core/insite.core.service.ts"/>
var insite;
(function (insite) {
    var catalog;
    (function (catalog) {
        "use strict";
        var ProductService = (function () {
            function ProductService($http, $q, coreService) {
                this.$http = $http;
                this.$q = $q;
                this.coreService = coreService;
                this.productServiceUri = this.coreService.getApiUri("/api/v1/products/");
                this.categoryServiceUri = this.coreService.getApiUri("/api/v1/categories");
                this.catalogPageServiceUri = this.coreService.getApiUri("/api/v1/catalogpages");
                this.productPriceUri = this.coreService.getApiUri("/api/v1/products/{productId}/price");
                this.productCrossSellUri = this.coreService.getApiUri("/api/v1/products/{productId}/crosssells");
                this.webCrossSellUri = this.coreService.getApiUri("/api/v1/websites/current/crosssells");
                this.productSettingsUri = this.coreService.getApiUri("/api/v1/settings/products");
            }
            ProductService.prototype.changeUnitOfMeasure = function (product, refreshPrice) {
                if (refreshPrice === void 0) { refreshPrice = true; }
                // update unit of measure
                product.unitOfMeasure = product.selectedUnitOfMeasure;
                var selectedUofMObject = this.coreService.getObjectByPropertyValue(product.productUnitOfMeasures, { unitOfMeasure: product.selectedUnitOfMeasure });
                product.unitOfMeasureDisplay = selectedUofMObject.unitOfMeasureDisplay;
                // update price
                if (!product.quoteRequired && refreshPrice) {
                    this.getProductPrice(product);
                }
                return product;
            };
            // updates the pricing on a product object based on the qtyOrdered, selectedUnitOfMeasure and array of configuration guids
            ProductService.prototype.getProductPrice = function (product, configuration) {
                var parameters = {
                    unitOfMeasure: product.selectedUnitOfMeasure,
                    qtyOrdered: product.qtyOrdered
                };
                var query = "?" + this.coreService.parseParameters(parameters);
                if (configuration) {
                    angular.forEach(configuration, function (value) {
                        query += "configuration=" + value + "&";
                    });
                }
                var uri = this.productPriceUri.replace("{productId}", product.id.toString()) + query;
                var deferred = this.$q.defer();
                this.$http.get(uri).success(function (result) {
                    product.pricing = result; // pricing result is the same format
                    return deferred.resolve(result);
                }).error(deferred.reject);
                return deferred.promise;
            };
            ProductService.prototype.getCatalogPage = function (path) {
                // check for server side data
                if (insite.catalog.catalogPageGlobal) {
                    var deferred = this.$q.defer();
                    deferred.resolve(insite.catalog.catalogPageGlobal);
                    return deferred.promise;
                }
                var uri = this.catalogPageServiceUri + "?path=" + path;
                var deferred = this.$q.defer();
                this.$http.get(uri).success(function (result) {
                    return deferred.resolve(result);
                }).error(deferred.reject);
                return deferred.promise;
            };
            ProductService.prototype.getCategoryTree = function (startCategoryId, maxDepth) {
                var uri = this.categoryServiceUri;
                if (startCategoryId || maxDepth) {
                    uri += "?startCategoryId=" + startCategoryId + "&maxDepth=" + maxDepth;
                }
                return this.$http.get(uri);
            };
            ProductService.prototype.getCategory = function (categoryId) {
                var uri = this.categoryServiceUri + "/" + categoryId;
                return this.$http.get(uri);
            };
            ProductService.prototype.getProductData = function (categoryId, productId, expand) {
                var query = "?";
                if (expand)
                    query += ("expand=" + expand.join()) + "&";
                if (categoryId)
                    query += "categoryid=" + categoryId + "&";
                var uri = this.productServiceUri + productId + query;
                var deferred = this.$q.defer();
                this.$http.get(uri, { bypassErrorInterceptor: true }).success(function (result) {
                    return deferred.resolve(result);
                }).error(deferred.reject);
                return deferred.promise;
            };
            ProductService.prototype.getProductCollectionData = function (parameters, expand) {
                var query = "?" + this.coreService.parseParameters(parameters);
                if (expand)
                    query += ("expand=" + expand.join());
                var uri = this.productServiceUri + query;
                var deferred = this.$q.defer();
                this.$http.get(uri, { timeout: deferred.promise }).success(function (result) { return deferred.resolve(result); }).error(function (data, status) {
                    var error = { data: data, status: status };
                    deferred.reject(error);
                });
                deferred.promise.cancel = function () {
                    deferred.resolve("cancelled");
                };
                return deferred.promise;
            };
            ProductService.prototype.getProductSettings = function () {
                var deferred = this.$q.defer();
                this.$http.get(this.productSettingsUri).success(function (result) {
                    return deferred.resolve(result);
                }).error(deferred.reject);
                return deferred.promise;
            };
            // get cross sells for a product or pass no parameter to get web cross sells
            ProductService.prototype.getCrossSells = function (productId) {
                var uri;
                if (productId) {
                    uri = this.productCrossSellUri.replace("{productId}", productId);
                }
                else {
                    uri = this.webCrossSellUri;
                }
                var deferred = this.$q.defer();
                this.$http.get(uri).success(function (result) {
                    return deferred.resolve(result);
                }).error(deferred.reject);
                return deferred.promise;
            };
            return ProductService;
        })();
        catalog.ProductService = ProductService;
        factory.$inject = ["$http", "$q", "coreService"];
        function factory($http, $q, coreService) {
            return new ProductService($http, $q, coreService);
        }
        angular.module("insite").factory("productService", factory);
    })(catalog = insite.catalog || (insite.catalog = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.product.service.js.map