var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var insite;
(function (insite) {
    var order;
    (function (_order) {
        "use strict";
        var RecentOrdersController = (function (_super) {
            __extends(RecentOrdersController, _super);
            function RecentOrdersController($scope, orderService, cartService, coreService, paginationService) {
                _super.call(this, $scope, orderService, cartService, coreService);
                this.$scope = $scope;
                this.orderService = orderService;
                this.cartService = cartService;
                this.coreService = coreService;
                this.paginationService = paginationService;
            }
            RecentOrdersController.prototype.init = function () {
                var _this = this;
                var canReorderItems;
                this.$scope.$on("settingsLoaded", function (event, data) {
                    canReorderItems = data.orderSettings.canReorderItems;
                });
                this.$scope.$on("cartLoaded", function (event, cart) {
                    if (cart.canRequestQuote) {
                        _this.getRecentOrders(canReorderItems);
                    }
                });
            };
            RecentOrdersController.prototype.getRecentOrders = function (canReorderItems) {
                var _this = this;
                var filter = new _order.OrderSearchFilter();
                filter.sort = "OrderDate DESC";
                filter.customerSequence = "-1";
                var pagination = new RecentOrdersPaginationModel();
                this.orderService.getOrders(filter, pagination).success(function (data) {
                    _this.orderHistory = data;
                    for (var i = 0; i < _this.orderHistory.orders.length; i++) {
                        _this.orderHistory.orders[i].canReorderItems = canReorderItems;
                    }
                });
            };
            RecentOrdersController.prototype.reorderAllProductsInOrder = function ($event, order) {
                var _this = this;
                $event.preventDefault();
                order.canReorderItems = false;
                this.orderService.getOrder(order.webOrderNumber, "orderlines").success(function (data) {
                    _this.order = data;
                    _super.prototype.reorderAllProducts.call(_this, $event);
                }).error(function (error) {
                    return;
                });
            };
            RecentOrdersController.$inject = [
                "$scope",
                "orderService",
                "cartService",
                "coreService",
                "paginationService"
            ];
            return RecentOrdersController;
        })(_order.OrderDetailController);
        _order.RecentOrdersController = RecentOrdersController;
        var RecentOrdersPaginationModel = (function () {
            function RecentOrdersPaginationModel() {
                this.numberOfPages = 1;
                this.pageSize = 5;
                this.currentPage = 1;
            }
            return RecentOrdersPaginationModel;
        })();
        angular.module("insite").controller("RecentOrdersController", RecentOrdersController);
    })(order = insite.order || (insite.order = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.recentorders.controller.js.map