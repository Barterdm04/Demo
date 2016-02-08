var insite;
(function (insite) {
    var orderapproval;
    (function (orderapproval) {
        "use strict";
        var OrderApprovalDetailController = (function () {
            function OrderApprovalDetailController($scope, orderApprovalService, $window, cartService, accountService, coreService) {
                this.$scope = $scope;
                this.orderApprovalService = orderApprovalService;
                this.$window = $window;
                this.cartService = cartService;
                this.accountService = accountService;
                this.coreService = coreService;
                this.init();
            }
            OrderApprovalDetailController.prototype.init = function () {
                var _this = this;
                var cartId = this.coreService.getQueryStringParameter("cartid");
                this.initEvents();
                this.accountService.getAccount().success(function (account) {
                    _this.account = account;
                });
                this.orderApprovalService.getCart(cartId).then(function (cart) {
                    _this.cart = cart;
                });
            };
            OrderApprovalDetailController.prototype.initEvents = function () {
                var _this = this;
                this.$scope.$on("cartLoaded", function (event, cart) {
                    _this.currentCart = cart;
                });
            };
            OrderApprovalDetailController.prototype.approveOrder = function (cartUri) {
                var _this = this;
                this.approveOrderErrorMessage = "";
                this.cart.status = "Cart";
                this.cartService.updateCart(this.cart).success(function () {
                    _this.$window.location.href = cartUri;
                }).error(function (error) {
                    _this.approveOrderErrorMessage = error.message;
                });
            };
            OrderApprovalDetailController.$inject = [
                "$scope",
                "orderApprovalService",
                "$window",
                "cartService",
                "accountService",
                "coreService"
            ];
            return OrderApprovalDetailController;
        })();
        orderapproval.OrderApprovalDetailController = OrderApprovalDetailController;
        angular.module("insite").controller("OrderApprovalDetailController", OrderApprovalDetailController);
    })(orderapproval = insite.orderapproval || (insite.orderapproval = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.orderapprovaldetail.controller.js.map