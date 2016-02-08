var insite;
(function (insite) {
    var wishlist;
    (function (wishlist) {
        "use strict";
        var WishListService = (function () {
            function WishListService($http, $q, coreService) {
                this.$http = $http;
                this.$q = $q;
                this.coreService = coreService;
                this.serviceUri = this.coreService.getApiUri("/api/v1/wishlists");
                this.wishListSettingsUri = this.coreService.getApiUri("/api/v1/settings/wishlist");
                this.cacheKey = "addWishListLineProducts";
            }
            WishListService.prototype.getWishListCollection = function () {
                var deferred = this.$q.defer();
                this.$http.get(this.serviceUri, { bypassErrorInterceptor: true }).success(function (result) {
                    return deferred.resolve(result);
                }).error(deferred.reject);
                return deferred.promise;
            };
            WishListService.prototype.getWishListDetails = function (wishList) {
                var uri = wishList.uri;
                var query = uri + "?" + this.coreService.parseParameters(wishList.pagination);
                return this.$http.get(query);
            };
            WishListService.prototype.addWishList = function (wishListName) {
                var deferred = this.$q.defer();
                var wishList = angular.toJson({ name: wishListName });
                this.$http.post(this.serviceUri, wishList, { bypassErrorInterceptor: true }).success(function (result) {
                    return deferred.resolve(result);
                }).error(deferred.reject);
                return deferred.promise;
            };
            WishListService.prototype.deleteWishList = function (wishList) {
                var _this = this;
                var deferred = this.$q.defer();
                this.$http.delete(wishList.uri).success(function (result) {
                    _this.getWishListCollection();
                    return deferred.resolve(result);
                }).error(deferred.reject);
                return deferred.promise;
            };
            WishListService.prototype.addWishListLine = function (wishList, product) {
                var deferred = this.$q.defer();
                var wishlistLine = {};
                wishlistLine.productId = product.id;
                wishlistLine.qtyOrdered = product.qtyOrdered;
                wishlistLine.unitOfMeasure = product.selectedUnitOfMeasure;
                this.$http.post(wishList.wishListLinesUri, wishlistLine, { bypassErrorInterceptor: true }).success(function (result) {
                    return deferred.resolve(result);
                }).error(deferred.reject);
                return deferred.promise;
            };
            WishListService.prototype.deleteLine = function (line) {
                var deferred = this.$q.defer();
                this.$http.delete(line.uri).success(function (result) {
                    return deferred.resolve(result);
                }).error(deferred.reject);
                return deferred.promise;
            };
            WishListService.prototype.patchLine = function (line) {
                var deferred = this.$q.defer();
                var jsLine = angular.toJson(line);
                this.$http({ method: "PATCH", url: line.uri, data: jsLine }).success(function (result) {
                    return deferred.resolve(result);
                }).error(deferred.reject);
                return deferred.promise;
            };
            WishListService.prototype.addWishListLineCollection = function (wishList, products) {
                var wishListLineCollection = { wishListLines: this.getWishListLinesFromProducts(products) };
                var deferred = this.$q.defer();
                this.$http.post(wishList.wishListLinesUri + "/batch", wishListLineCollection).success(function (result) {
                    return deferred.resolve(result);
                }).error(deferred.reject);
                return deferred.promise;
            };
            WishListService.prototype.getWishListSettings = function () {
                var deferred = this.$q.defer();
                this.$http.get(this.wishListSettingsUri).success(function (result) { return deferred.resolve(result); }).error(deferred.reject);
                return deferred.promise;
            };
            WishListService.prototype.getWishListLinesFromProducts = function (products) {
                var wishListLineCollection = [];
                angular.forEach(products, function (product) {
                    wishListLineCollection.push({
                        productId: product.id,
                        qtyOrdered: product.qtyOrdered,
                        unitOfMeasure: product.selectedUnitOfMeasure
                    });
                });
                return wishListLineCollection;
            };
            WishListService.$inject = ["$http", "$q", "coreService", "$localStorage"];
            return WishListService;
        })();
        wishlist.WishListService = WishListService;
        angular.module("insite").service("WishListService", WishListService);
    })(wishlist = insite.wishlist || (insite.wishlist = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.wishlist.service.js.map