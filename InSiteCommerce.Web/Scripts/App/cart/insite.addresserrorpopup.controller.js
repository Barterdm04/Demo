var insite;
(function (insite) {
    var cart;
    (function (cart) {
        "use strict";
        var AddressErrorPopupController = (function () {
            function AddressErrorPopupController($scope, coreService) {
                this.$scope = $scope;
                this.coreService = coreService;
                this.init();
            }
            AddressErrorPopupController.prototype.init = function () {
                var _this = this;
                this.$scope.$on("settingsLoaded", function (event, data) {
                    _this.isAddressEditAllowed = data.customerSettings.allowBillToAddressEdit && data.customerSettings.allowShipToAddressEdit;
                });
                this.$scope.$on("showAddressErrorPopup", function () {
                    var $popup = angular.element("#cartAddressErrorPopup");
                    if ($popup.length > 0) {
                        _this.coreService.displayModal($popup);
                    }
                });
            };
            AddressErrorPopupController.$inject = [
                "$scope",
                "coreService"
            ];
            return AddressErrorPopupController;
        })();
        cart.AddressErrorPopupController = AddressErrorPopupController;
        angular.module("insite").controller("AddressErrorPopupController", AddressErrorPopupController);
    })(cart = insite.cart || (insite.cart = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.addresserrorpopup.controller.js.map