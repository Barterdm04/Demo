module insite.order {
    "use strict";

    export class RecentOrdersController extends OrderDetailController {
        orderHistory: OrderCollectionModel;

        static $inject = [
            "$scope",
            "orderService",
            "cartService",
            "coreService",
            "paginationService"
        ];

        constructor(
            protected $scope: ng.IScope,
            protected orderService: order.IOrderService,
            protected cartService: cart.ICartService,
            protected coreService: core.ICoreService,
            protected paginationService: core.IPaginationService) {

            super($scope, orderService, cartService, coreService);
        }

        init() {
            var canReorderItems;
            this.$scope.$on("settingsLoaded", (event, data) => {
                canReorderItems = data.orderSettings.canReorderItems;
            });
            this.$scope.$on("cartLoaded", (event, cart: CartModel) => {
                if (cart.canRequestQuote) {
                    this.getRecentOrders(canReorderItems);
                }
            });
        }

        getRecentOrders(canReorderItems) {
            var filter = new OrderSearchFilter();
            filter.sort = "OrderDate DESC";
            filter.customerSequence = "-1";

            var pagination = new RecentOrdersPaginationModel();

            this.orderService.getOrders(filter, pagination).success(data => {
                this.orderHistory = data;

                for (var i = 0; i < this.orderHistory.orders.length; i ++) {
                    this.orderHistory.orders[i].canReorderItems = canReorderItems;
                }
            });
        }

        reorderAllProductsInOrder($event, order): void {
            $event.preventDefault();

            order.canReorderItems = false;

            this.orderService.getOrder(order.webOrderNumber, "orderlines").success(data => {
                this.order = data;
                super.reorderAllProducts($event);
            }).error(error => {
                return;
            });
        }
    }

    class RecentOrdersPaginationModel implements PaginationModel {
        currentPage: number;
        pageSize: number;
        defaultPageSize: number;
        totalItemCount: number;
        numberOfPages: number;
        pageSizeOptions: number[];
        sortOptions: Insite.Core.WebApi.SortOptionModel[];
        sortType: string;
        nextPageUri: string;
        prevPageUri: string;

        constructor() {
            this.numberOfPages = 1;
            this.pageSize = 5;
            this.currentPage = 1;
        }
    }

    angular
        .module("insite")
        .controller("RecentOrdersController", RecentOrdersController);
}