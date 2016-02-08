var insite;
(function (insite) {
    var cart;
    (function (cart) {
        "use strict";
        var CartLinesController = (function () {
            function CartLinesController($scope, cartService, spinnerService) {
                this.$scope = $scope;
                this.cartService = cartService;
                this.spinnerService = spinnerService;
                this.openLineNoteId = "";
                this.isUpdateInProgress = false;
                this.init();
            }
            CartLinesController.prototype.init = function () {
                var _this = this;
                this.$scope.$on("cartLoaded", function () {
                    _this.isUpdateInProgress = false;
                });
            };
            CartLinesController.prototype.updateLine = function (cartLine, refresh) {
                if (refresh) {
                    this.isUpdateInProgress = true;
                }
                if (parseFloat(cartLine.qtyOrdered.toString()) === 0) {
                    this.cartService.removeLine(cartLine);
                }
                else {
                    this.cartService.updateLine(cartLine, refresh);
                    this.spinnerService.show();
                }
            };
            CartLinesController.prototype.removeLine = function (cartLine) {
                this.spinnerService.show();
                this.cartService.removeLine(cartLine);
            };
            CartLinesController.prototype.quantityKeyPress = function (keyEvent, cartLine) {
                if (keyEvent.which === 13) {
                    this.updateLine(cartLine, true);
                }
            };
            CartLinesController.prototype.notesKeyPress = function (keyEvent, cartLine) {
                if (keyEvent.which === 13) {
                    this.updateLine(cartLine, false);
                }
            };
            CartLinesController.prototype.notePanelClicked = function (lineId) {
                if (this.openLineNoteId === lineId)
                    this.openLineNoteId = "";
                else
                    this.openLineNoteId = lineId;
            };
            CartLinesController.$inject = [
                "$scope",
                "cartService",
                "spinnerService"
            ];
            return CartLinesController;
        })();
        cart.CartLinesController = CartLinesController;
        angular.module("insite").controller("CartLinesController", CartLinesController);
    })(cart = insite.cart || (insite.cart = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.cartlines.controller.js.map