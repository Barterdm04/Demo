var insite;
(function (insite) {
    var cart;
    (function (cart) {
        "use strict";
        var CartLineNoteController = (function () {
            function CartLineNoteController($scope, cartService) {
                this.$scope = $scope;
                this.cartService = cartService;
            }
            CartLineNoteController.prototype.updateLine = function (cartLine, refresh) {
                this.cartService.updateLine(cartLine, refresh);
            };
            CartLineNoteController.prototype.notesKeyPress = function (keyEvent, cartLine) {
                if (keyEvent.which === 13) {
                    this.updateLine(cartLine, false);
                }
            };
            CartLineNoteController.prototype.notePanelClicked = function (lineId) {
                if (this.openLineNoteId === lineId)
                    this.openLineNoteId = "";
                else
                    this.openLineNoteId = lineId;
            };
            CartLineNoteController.$inject = [
                "$scope",
                "cartService"
            ];
            return CartLineNoteController;
        })();
        cart.CartLineNoteController = CartLineNoteController;
        angular.module("insite").controller("CartLineNoteController", CartLineNoteController);
    })(cart = insite.cart || (insite.cart = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.cartlinenote.controller.js.map