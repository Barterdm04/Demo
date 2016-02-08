var insite;
(function (insite) {
    var cart;
    (function (cart) {
        "use strict";
        var AddToCartPopupController = (function () {
            function AddToCartPopupController($scope, coreService) {
                this.$scope = $scope;
                this.coreService = coreService;
                //TODO: HP: Global valiable - should be set from settings
                this.cartPopupTimeout = 3000;
                this.init();
            }
            AddToCartPopupController.prototype.init = function () {
                var _this = this;
                this.$scope.$on("settingsLoaded", function (event, data) {
                    _this.productSettings = data.productSettings;
                });
                this.$scope.$on("showAddToCartPopup", function (event, data) {
                    _this.isAddAll = false;
                    if (data && data.isAddAll) {
                        _this.isAddAll = data.isAddAll;
                    }
                    _this.isQtyAdjusted = false;
                    if (data && data.isQtyAdjusted) {
                        _this.isQtyAdjusted = data.isQtyAdjusted;
                    }
                    var showPopup = _this.productSettings.showAddToCartConfirmationDialog || _this.isQtyAdjusted;
                    if (!showPopup) {
                        return;
                    }
                    var popupSelector = "#popup-productaddedtocart";
                    var $popup = angular.element(popupSelector);
                    if ($popup.length <= 0) {
                        return;
                    }
                    _this.coreService.displayModal($popup);
                    setTimeout(function () {
                        _this.coreService.closeModal(popupSelector);
                    }, _this.cartPopupTimeout);
                });
            };
            AddToCartPopupController.$inject = [
                "$scope",
                "coreService"
            ];
            return AddToCartPopupController;
        })();
        cart.AddToCartPopupController = AddToCartPopupController;
        angular.module("insite").controller("AddToCartPopupController", AddToCartPopupController);
    })(cart = insite.cart || (insite.cart = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.addtocartpopup.controller.js.map