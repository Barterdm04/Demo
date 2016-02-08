var insite;
(function (insite) {
    var wishlist;
    (function (wishlist) {
        "use strict";
        var WishListPopupController = (function () {
            function WishListPopupController($scope, wishListService, coreService) {
                this.$scope = $scope;
                this.wishListService = wishListService;
                this.coreService = coreService;
                this.init();
            }
            WishListPopupController.prototype.init = function () {
                var _this = this;
                this.productsToAdd = [];
                var settingsLoaded = false;
                this.$scope.$on("settingsLoaded", function (event, data) {
                    _this.wishListSettings = data.wishListSettings;
                    settingsLoaded = true;
                });
                this.$scope.$on("addToWishList", function (event, data) {
                    if (settingsLoaded) {
                        if (!_this.popupId) {
                            _this.popupId = data.popupId != undefined ? "#" + data.popupId : "#popup-add-wishlist";
                        }
                        else {
                            if (!_this.popupId.match("^#")) {
                                _this.popupId = "#" + _this.popupId;
                            }
                        }
                        _this.productsToAdd = data.products;
                        _this.initialize();
                        _this.showPopup();
                    }
                });
            };
            WishListPopupController.prototype.initialize = function () {
                var _this = this;
                if (this.$scope["isAuthenticated"]) {
                    this.clearMessages();
                    this.newWishListName = "";
                    if (this.wishListSettings.allowMultipleWishLists) {
                        // show dialog with wishlist options
                        this.wishListService.getWishListCollection().then(function (result) {
                            _this.wishListCollection = result.wishListCollection;
                        }, function (error) {
                            _this.errorMessage = error.message;
                        });
                    }
                    else {
                        // just add to wishlist selected product
                        this.addWishList(this.newWishListName);
                    }
                }
            };
            WishListPopupController.prototype.clearMessages = function () {
                this.successMessage = false;
                this.errorMessage = "";
                this.wishlistNameErrorMessage = false;
            };
            WishListPopupController.prototype.showPopup = function () {
                this.coreService.displayModal(angular.element(this.popupId));
            };
            WishListPopupController.prototype.changeWishList = function () {
                this.newWishListName = "";
                this.clearMessages();
            };
            WishListPopupController.prototype.addWishList = function (wishListName) {
                var _this = this;
                this.wishListService.addWishList(wishListName).then(function (newWishList) {
                    _this.addProductsToWishList(newWishList);
                }, function (error) {
                    _this.errorMessage = error.message;
                });
            };
            WishListPopupController.prototype.addLineToWishList = function (wishList) {
                var _this = this;
                this.wishListService.addWishListLine(wishList, this.productsToAdd[0]).then(function () {
                    _this.successMessage = true;
                }, function (error) {
                    _this.errorMessage = error.message;
                });
            };
            WishListPopupController.prototype.addLineCollectionToWishList = function (wishList) {
                var _this = this;
                this.wishListService.addWishListLineCollection(wishList, this.productsToAdd).then(function () {
                    _this.successMessage = true;
                }, function (error) {
                    _this.errorMessage = error.message;
                });
            };
            WishListPopupController.prototype.addToWishList = function () {
                this.clearMessages();
                if (this.selectedWishList) {
                    this.addProductsToWishList(this.selectedWishList);
                }
                else {
                    if (this.newWishListName && this.newWishListName.trim().length > 0) {
                        this.addWishList(this.newWishListName);
                    }
                    else {
                        this.wishlistNameErrorMessage = true;
                    }
                }
            };
            WishListPopupController.prototype.addProductsToWishList = function (wishList) {
                if (this.productsToAdd.length === 1) {
                    this.addLineToWishList(wishList);
                }
                else {
                    this.addLineCollectionToWishList(wishList);
                }
            };
            WishListPopupController.$inject = [
                "$scope",
                "WishListService",
                "coreService"
            ];
            return WishListPopupController;
        })();
        wishlist.WishListPopupController = WishListPopupController;
        angular.module("insite").controller("WishListPopupController", WishListPopupController);
    })(wishlist = insite.wishlist || (insite.wishlist = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.wishlistpopup.controller.js.map