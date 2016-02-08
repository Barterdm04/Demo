var insite;
(function (insite) {
    var layout;
    (function (layout) {
        "use strict";
        var HeaderController = (function () {
            function HeaderController($scope, $timeout, cartService) {
                this.$scope = $scope;
                this.$timeout = $timeout;
                this.cartService = cartService;
                this.init();
            }
            HeaderController.prototype.init = function () {
                var _this = this;
                this.$scope.$on("cartLoaded", function (event, cart) {
                    _this.cart = cart;
                });
                // use a short timeout to wait for anything else on the page to call to load the cart
                this.$timeout(function () {
                    if (!_this.cartService.cartLoadCalled) {
                        _this.cartService.getCart();
                    }
                }, 20);
            };
            HeaderController.$inject = ["$scope", "$timeout", "cartService"];
            return HeaderController;
        })();
        layout.HeaderController = HeaderController;
        angular.module("insite").controller("HeaderController", HeaderController);
    })(layout = insite.layout || (insite.layout = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.header.controller.js.map