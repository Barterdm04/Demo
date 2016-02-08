var insite;
(function (insite) {
    var order;
    (function (order) {
        "use strict";
        var OrderListController = (function () {
            function OrderListController($scope, orderService, customerService, coreService, paginationService) {
                this.$scope = $scope;
                this.orderService = orderService;
                this.customerService = customerService;
                this.coreService = coreService;
                this.paginationService = paginationService;
                this.allowCancellationRequest = false;
                this.paginationStorageKey = "DefaultPagination-OrderList";
                this.searchFilter = {
                    customerSequence: "-1",
                    sort: "OrderDate DESC",
                    toDate: "",
                    fromDate: "",
                    ponumber: "",
                    ordernumber: "",
                    ordertotaloperator: "",
                    ordertotal: "",
                    status: ""
                };
                this.init();
            }
            OrderListController.prototype.init = function () {
                var _this = this;
                this.$scope.$on("settingsLoaded", function (event, data) {
                    _this.allowCancellationRequest = data.orderSettings.allowCancellationRequest;
                });
                this.pagination = this.paginationService.getDefaultPagination(this.paginationStorageKey);
                this.getOrders();
                this.customerService.getShipTos().success(function (data) {
                    _this.shipTos = data.shipTos;
                });
            };
            OrderListController.prototype.clear = function () {
                this.pagination.currentPage = 1;
                this.searchFilter.customerSequence = "-1";
                this.searchFilter.sort = "OrderDate";
                this.searchFilter.toDate = "";
                this.searchFilter.fromDate = "";
                this.searchFilter.fromDate = "";
                this.searchFilter.ponumber = "";
                this.searchFilter.ordernumber = "";
                this.searchFilter.ordertotaloperator = "";
                this.searchFilter.ordertotal = "";
                this.searchFilter.status = "";
                this.getOrders();
            };
            OrderListController.prototype.changeSort = function (sort) {
                if (this.searchFilter.sort === sort && this.searchFilter.sort.indexOf(" DESC") < 0) {
                    this.searchFilter.sort = sort + " DESC";
                }
                else {
                    this.searchFilter.sort = sort;
                }
                this.getOrders();
            };
            OrderListController.prototype.search = function () {
                if (this.pagination)
                    this.pagination.currentPage = 1;
                this.getOrders();
            };
            OrderListController.prototype.getOrders = function () {
                var _this = this;
                var filter = this.prepareSearchFilter();
                this.orderService.getOrders(filter, this.pagination).success(function (data) {
                    _this.orderHistory = data;
                    _this.pagination = data.pagination;
                }).error(function (error) {
                    _this.validationMessage = error.exceptionMessage;
                });
            };
            OrderListController.prototype.prepareSearchFilter = function () {
                var filter = new OrderSearchFilter();
                for (var property in this.searchFilter) {
                    if (this.searchFilter.hasOwnProperty(property)) {
                        if (this.searchFilter[property] === "")
                            filter[property] = null;
                        else
                            filter[property] = this.searchFilter[property];
                    }
                }
                return filter;
            };
            OrderListController.$inject = [
                "$scope",
                "orderService",
                "customerService",
                "coreService",
                "paginationService"
            ];
            return OrderListController;
        })();
        order.OrderListController = OrderListController;
        var OrderSearchFilter = (function () {
            function OrderSearchFilter() {
            }
            return OrderSearchFilter;
        })();
        order.OrderSearchFilter = OrderSearchFilter;
        angular.module("insite").controller("OrderListController", OrderListController);
    })(order = insite.order || (insite.order = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.orderlist.controller.js.map