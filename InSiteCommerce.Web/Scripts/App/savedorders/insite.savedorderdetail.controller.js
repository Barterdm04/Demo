var insite;
(function (insite) {
    var savedorders;
    (function (savedorders) {
        "use strict";
        var SavedOrderDetailController = (function () {
            function SavedOrderDetailController($scope, $window, cartService, coreService, spinnerService) {
                this.$scope = $scope;
                this.$window = $window;
                this.cartService = cartService;
                this.coreService = coreService;
                this.spinnerService = spinnerService;
                this.cart = null;
                this.canAddToCart = false;
                this.canAddAllToCart = false;
                this.showInventoryAvailability = false;
                this.init();
            }
            SavedOrderDetailController.prototype.init = function () {
                var _this = this;
                this.$scope.$on("settingsLoaded", function (event, data) {
                    data.productSettings.showAddToCartConfirmationDialog = false; //We do not need a popups for this page
                    _this.showInventoryAvailability = data.productSettings.showInventoryAvailability;
                });
                var cartId = this.coreService.getQueryStringParameter("cartid", true);
                this.cartService.expand = "cartlines,costcodes";
                this.cartService.getCart(cartId).then(function (cart) {
                    _this.cart = cart;
                    var addToCartCount = _this.cart.cartLines.filter(function (l) { return l.canAddToCart; }).length;
                    _this.canAddToCart = addToCartCount >= 1;
                    _this.canAddAllToCart = addToCartCount >= _this.cart.cartLines.length;
                });
            };
            SavedOrderDetailController.prototype.placeSavedOrder = function (cartUri) {
                var _this = this;
                var availableLines = this.cart.cartLines.filter(function (l) { return l.canAddToCart; });
                if (availableLines.length > 0) {
                    this.spinnerService.show();
                    this.cartService.addLineCollection(availableLines, true).then(function () {
                        _this.deleteSavedOrder(cartUri);
                    });
                }
            };
            SavedOrderDetailController.prototype.deleteSavedOrder = function (redirectUri) {
                var _this = this;
                this.cartService.removeCart(this.cart).then(function () {
                    _this.$window.location.href = redirectUri;
                });
            };
            SavedOrderDetailController.$inject = [
                "$scope",
                "$window",
                "cartService",
                "coreService",
                "spinnerService"
            ];
            return SavedOrderDetailController;
        })();
        savedorders.SavedOrderDetailController = SavedOrderDetailController;
        angular.module("insite").controller("SavedOrderDetailController", SavedOrderDetailController);
    })(savedorders = insite.savedorders || (insite.savedorders = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.savedorderdetail.controller.js.map