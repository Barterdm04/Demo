var insite;
(function (insite) {
    var wishlist;
    (function (wishlist) {
        "use strict";
        var WishListController = (function () {
            function WishListController($scope, coreService, wishListService, productService, cartService, paginationService) {
                this.$scope = $scope;
                this.coreService = coreService;
                this.wishListService = wishListService;
                this.productService = productService;
                this.cartService = cartService;
                this.paginationService = paginationService;
                this.wishListCollection = [];
                this.paginationStorageKey = "DefaultPagination-WishList";
                this.init();
            }
            WishListController.prototype.init = function () {
                var _this = this;
                this.getWishListCollection();
                this.$scope.$on("settingsLoaded", function (event, data) {
                    _this.productSettings = data.productSettings;
                    _this.wishListSettings = data.wishListSettings;
                });
            };
            WishListController.prototype.mapData = function (data) {
                this.wishListCount = data.wishListCollection.length;
                if (this.wishListCount > 0) {
                    this.wishListCollection = data.wishListCollection;
                    var wishListId = this.coreService.getQueryStringParameter("wishListId");
                    if (wishListId.length > 0) {
                        this.selectedWishList = this.wishListCollection.filter(function (x) { return x.id === wishListId; })[0];
                    }
                    else {
                        this.selectedWishList = this.wishListCollection[0];
                    }
                    this.getSelectedWishListDetails();
                }
            };
            WishListController.prototype.getWishListCollection = function () {
                var _this = this;
                this.wishListService.getWishListCollection().then(function (result) {
                    _this.mapData(result);
                });
            };
            WishListController.prototype.getSelectedWishListDetails = function () {
                var _this = this;
                this.selectedWishList.pagination = this.paginationService.getDefaultPagination(this.paginationStorageKey, this.selectedWishList.pagination);
                this.wishListService.getWishListDetails(this.selectedWishList).success(function (result) {
                    _this.selectedWishList = result;
                });
            };
            WishListController.prototype.deleteWishList = function () {
                var _this = this;
                this.wishListService.deleteWishList(this.selectedWishList).then(function () {
                    _this.coreService.displayModal(angular.element("#popup-deletewishlist"));
                    _this.getWishListCollection();
                });
            };
            WishListController.prototype.deleteLine = function (line) {
                var _this = this;
                this.wishListService.deleteLine(line).then(function () {
                    _this.getSelectedWishListDetails();
                });
            };
            WishListController.prototype.updateLine = function (line) {
                if (line.qtyOrdered == 0) {
                    this.deleteLine(line);
                }
                else {
                    this.wishListService.patchLine(line);
                }
            };
            WishListController.prototype.quantityKeyPress = function (line) {
                this.updateLine(line);
            };
            WishListController.prototype.addLineToCart = function (line) {
                this.cartService.addLine(line);
            };
            WishListController.prototype.addAllToCart = function () {
                this.cartService.addLineCollection(this.selectedWishList.wishListLineCollection);
            };
            WishListController.prototype.allQtysIsValid = function () {
                if (!this.selectedWishList || !this.selectedWishList.wishListLineCollection) {
                    return false;
                }
                return this.selectedWishList.wishListLineCollection.every(function (wishListLine) {
                    return wishListLine.qtyOrdered && parseFloat(wishListLine.qtyOrdered.toString()) > 0;
                });
            };
            WishListController.prototype.changeUnitOfMeasure = function (line) {
                var product = this.mapWishlistLineToProduct(line);
                product = this.productService.changeUnitOfMeasure(product, false);
                line = this.mapProductToWishlistLine(product, line);
                if (!product.quoteRequired) {
                    this.productService.getProductPrice(product).then(function (result) {
                        line.pricing = result;
                    });
                }
                this.updateLine(line);
            };
            WishListController.prototype.mapProductToWishlistLine = function (product, line) {
                line.productUnitOfMeasures = product.productUnitOfMeasures;
                line.unitOfMeasureDisplay = product.unitOfMeasureDisplay;
                line.unitOfMeasure = product.unitOfMeasure;
                line.canShowUnitOfMeasure = product.canShowUnitOfMeasure;
                line.selectedUnitOfMeasure = product.selectedUnitOfMeasure;
                return line;
            };
            WishListController.prototype.mapWishlistLineToProduct = function (line) {
                return {
                    id: line.productId,
                    productUnitOfMeasures: line.productUnitOfMeasures,
                    unitOfMeasure: line.unitOfMeasure,
                    selectedUnitOfMeasure: line.selectedUnitOfMeasure,
                    quoteRequired: line.quoteRequired,
                };
            };
            WishListController.$inject = ["$scope", "coreService", "WishListService", "productService", "cartService", "paginationService"];
            return WishListController;
        })();
        wishlist.WishListController = WishListController;
        angular.module("insite").controller("WishListController", WishListController);
    })(wishlist = insite.wishlist || (insite.wishlist = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.wishlist.controller.js.map