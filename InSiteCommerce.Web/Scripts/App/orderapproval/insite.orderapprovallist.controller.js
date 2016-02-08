var insite;
(function (insite) {
    var orderapproval;
    (function (orderapproval) {
        "use strict";
        var OrderApprovalListController = (function () {
            function OrderApprovalListController($scope, orderApprovalService, customerService, coreService, paginationService) {
                this.$scope = $scope;
                this.orderApprovalService = orderApprovalService;
                this.customerService = customerService;
                this.coreService = coreService;
                this.paginationService = paginationService;
                this.paginationStorageKey = "DefaultPagination-OrderApprovalList";
                this.init();
            }
            OrderApprovalListController.prototype.init = function () {
                var _this = this;
                this.pagination = this.paginationService.getDefaultPagination(this.paginationStorageKey);
                this.$scope.$on("cartLoaded", function (event, cart) {
                    _this.cart = cart;
                    _this.searchFilter = {
                        shipToId: "",
                        sort: "OrderDate DESC"
                    };
                    _this.getCarts();
                    _this.customerService.getShipTos("approvals").success(function (data) {
                        _this.shipTos = data.shipTos;
                    });
                });
            };
            OrderApprovalListController.prototype.clear = function () {
                this.pagination.currentPage = 1;
                this.searchFilter = {
                    shipToId: "",
                    sort: "OrderDate"
                };
                this.getCarts();
            };
            OrderApprovalListController.prototype.changeSort = function (sort) {
                if (this.searchFilter.sort === sort && this.searchFilter.sort.indexOf(" DESC") < 0) {
                    this.searchFilter.sort = sort + " DESC";
                }
                else {
                    this.searchFilter.sort = sort;
                }
                this.getCarts();
            };
            OrderApprovalListController.prototype.search = function () {
                if (this.pagination) {
                    this.pagination.currentPage = 1;
                }
                this.getCarts();
            };
            OrderApprovalListController.prototype.getCarts = function () {
                var _this = this;
                this.orderApprovalService.getCarts(this.searchFilter, this.pagination).success(function (data) {
                    _this.approvalCarts = data.cartCollection;
                    _this.properties = data.properties;
                    _this.pagination = data.pagination;
                });
            };
            OrderApprovalListController.$inject = [
                "$scope",
                "orderApprovalService",
                "customerService",
                "coreService",
                "paginationService"
            ];
            return OrderApprovalListController;
        })();
        orderapproval.OrderApprovalListController = OrderApprovalListController;
        angular.module("insite").controller("OrderApprovalListController", OrderApprovalListController);
    })(orderapproval = insite.orderapproval || (insite.orderapproval = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.orderapprovallist.controller.js.map