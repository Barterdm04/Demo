var insite;
(function (insite) {
    var cart;
    (function (_cart) {
        "use strict";
        var CartService = (function () {
            function CartService($http, $rootScope, $q, coreService) {
                this.$http = $http;
                this.$rootScope = $rootScope;
                this.$q = $q;
                this.coreService = coreService;
                this.serviceUri = this.coreService.getApiUri("/api/v1/carts");
                this.cartSettingsUri = this.coreService.getApiUri("/api/v1/settings/cart");
                this.cartLinesUri = "";
                this.currentCartLinesUri = "";
                this.cartPopupTimeout = 3000;
                this.cartLoadCalled = false;
                this.preventCartLoad = false;
                this.expand = "";
                this.invalidAddressException = "Insite.Core.Exceptions.InvalidAddressException";
            }
            CartService.prototype.getCarts = function (filter, pagination) {
                var uri = this.serviceUri;
                if (filter) {
                    uri += "?";
                    for (var property in filter) {
                        if (filter[property]) {
                            uri += property + "=" + filter[property] + "&";
                        }
                    }
                }
                if (pagination) {
                    uri += "page=" + pagination.currentPage + "&pageSize=" + pagination.pageSize;
                }
                uri = uri.replace(/&$/, "");
                return this.$http.get(uri);
            };
            CartService.prototype.getCart = function (cartId) {
                var _this = this;
                if (this.preventCartLoad)
                    return null;
                if (!cartId) {
                    cartId = "current";
                }
                if (cartId === "current") {
                    this.cartLoadCalled = true;
                }
                var uri = this.serviceUri + "/" + cartId;
                if (this.expand) {
                    uri += "?expand=" + this.expand;
                }
                var deferred = this.$q.defer();
                this.$http({ method: "GET", url: uri, bypassErrorInterceptor: true }).success(function (cart) {
                    _this.cartLinesUri = cart.cartLinesUri;
                    if (cartId === "current") {
                        _this.$rootScope.$broadcast("cartLoaded", cart);
                        _this.currentCartLinesUri = cart.cartLinesUri;
                    }
                    deferred.resolve(cart);
                }).error(function (error) {
                    if (error.exceptionType === _this.invalidAddressException) {
                        _this.$rootScope.$broadcast("showAddressErrorPopup");
                    }
                    else {
                        _this.$rootScope.$broadcast("showApiErrorPopup", error);
                    }
                    return _this.$q.reject(error);
                });
                return deferred.promise;
            };
            CartService.prototype.updateCart = function (cart, suppressApiErrors) {
                var _this = this;
                if (suppressApiErrors === void 0) { suppressApiErrors = false; }
                var deferred = this.$q.defer();
                return this.$http({ method: "PATCH", url: cart.uri, data: cart, bypassErrorInterceptor: true }).success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                    if (error.exceptionType === _this.invalidAddressException) {
                        _this.$rootScope.$broadcast("showAddressErrorPopup");
                    }
                    else if (!suppressApiErrors) {
                        _this.$rootScope.$broadcast("showApiErrorPopup", error);
                    }
                    return _this.$q.reject(error);
                });
            };
            CartService.prototype.removeCart = function (cart) {
                return this.$http.delete(cart.uri);
            };
            CartService.prototype.addLine = function (cartLine) {
                var _this = this;
                var parsedQty = parseFloat(cartLine.qtyOrdered.toString());
                cartLine.qtyOrdered = parsedQty > 0 ? parsedQty : 1;
                var deferred = this.$q.defer();
                this.$http({ method: "POST", url: this.cartLinesUri, data: cartLine, bypassErrorInterceptor: true }).success(function (result) {
                    _this.$rootScope.$broadcast("showAddToCartPopup", { isQtyAdjusted: result.isQtyAdjusted });
                    cartLine.availability = result.availability;
                    _this.getCart();
                    deferred.resolve(result);
                }).error(function (error) {
                    _this.getCart();
                    if (error.exceptionType === _this.invalidAddressException) {
                        _this.$rootScope.$broadcast("showAddressErrorPopup");
                    }
                    else {
                        _this.$rootScope.$broadcast("showApiErrorPopup", error);
                    }
                    return _this.$q.reject(error);
                });
                return deferred.promise;
            };
            CartService.prototype.addLineFromProduct = function (product, configuration) {
                var cartLine = {};
                cartLine.productId = product.id;
                cartLine.qtyOrdered = product.qtyOrdered;
                cartLine.unitOfMeasure = product.unitOfMeasure;
                if (configuration) {
                    cartLine.sectionOptions = configuration; // both contain sectionOptionId
                }
                return this.addLine(cartLine);
            };
            CartService.prototype.addLineCollection = function (cartLines, toCurrentCart) {
                var _this = this;
                if (toCurrentCart === void 0) { toCurrentCart = false; }
                var cartLineCollection = { cartLines: cartLines };
                cartLineCollection.cartLines.forEach(function (line) {
                    var parsedQty = parseFloat(line.qtyOrdered.toString());
                    line.qtyOrdered = parsedQty > 0 ? parsedQty : 1;
                    ;
                });
                var deferred = this.$q.defer();
                var postUrl = toCurrentCart ? this.currentCartLinesUri : this.cartLinesUri;
                this.$http({ method: "POST", url: postUrl + "/batch", data: cartLineCollection, bypassErrorInterceptor: true }).success(function (result) {
                    var isQtyAdjusted = result.cartLines.some(function (line) {
                        return line.isQtyAdjusted;
                    });
                    _this.$rootScope.$broadcast("showAddToCartPopup", { isAddAll: true, isQtyAdjusted: isQtyAdjusted });
                    _this.getCart();
                    deferred.resolve(result);
                }).error(function (error) {
                    if (error.exceptionType === _this.invalidAddressException) {
                        // workaround for Avalara exception
                        _this.$rootScope.$broadcast("showAddressErrorPopup");
                        return _this.$q.reject(error);
                    }
                    deferred.resolve(error);
                });
                return deferred.promise;
            };
            CartService.prototype.addLineCollectionFromProducts = function (products) {
                var cartLineCollection = [];
                angular.forEach(products, function (product) {
                    cartLineCollection.push({
                        productId: product.id,
                        qtyOrdered: product.qtyOrdered,
                        unitOfMeasure: product.selectedUnitOfMeasure,
                    });
                });
                return this.addLineCollection(cartLineCollection);
            };
            CartService.prototype.updateLine = function (cartLine, refresh) {
                var _this = this;
                var deferred = this.$q.defer();
                this.$http({ method: "PATCH", url: cartLine.uri, data: cartLine }).success(function (result) {
                    if (refresh) {
                        _this.getCart();
                    }
                    deferred.resolve(result);
                }).error(deferred.reject);
                return deferred.promise;
            };
            CartService.prototype.removeLine = function (cartLine) {
                var _this = this;
                var deferred = this.$q.defer();
                this.$http.delete(cartLine.uri).success(function (result) {
                    _this.getCart();
                    deferred.resolve(result);
                }).error(deferred.reject);
                return deferred.promise;
            };
            CartService.prototype.getCartSettings = function () {
                var deferred = this.$q.defer();
                this.$http.get(this.cartSettingsUri).success(function (result) { return deferred.resolve(result); }).error(deferred.reject);
                return deferred.promise;
            };
            CartService.$inject = ["$http", "$rootScope", "$q", "coreService"];
            return CartService;
        })();
        _cart.CartService = CartService;
        angular.module("insite").service("cartService", CartService);
    })(cart = insite.cart || (insite.cart = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.cart.service.js.map