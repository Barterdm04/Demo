module insite.order {
    "use strict";

    export class OrderListController {

        orderHistory: OrderCollectionModel;
        allowCancellationRequest = false;
        pagination: PaginationModel;
        paginationStorageKey = "DefaultPagination-OrderList";
        searchFilter: OrderSearchFilter = {
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
        shipTos: ShipToModel[];
        validationMessage: string;

        static $inject = [
            "$scope",
            "orderService",
            "customerService",
            "coreService",
            "paginationService"
        ];

        constructor(
            protected $scope: ng.IScope,
            protected orderService: order.IOrderService,
            protected customerService: customers.ICustomerService,
            protected coreService: core.ICoreService,
            protected paginationService: core.IPaginationService) {

            this.init();
        }

        init() {
            this.$scope.$on("settingsLoaded",(event, data) => {
                this.allowCancellationRequest = data.orderSettings.allowCancellationRequest;
            });

            this.pagination = this.paginationService.getDefaultPagination(this.paginationStorageKey);

            this.getOrders();

            this.customerService.getShipTos().success(data => {
                this.shipTos = data.shipTos;
            });   
        }

        clear() {
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
        }

        changeSort(sort: string) {
            if (this.searchFilter.sort === sort && this.searchFilter.sort.indexOf(" DESC") < 0) {
                this.searchFilter.sort = sort + " DESC";
            } else {
                this.searchFilter.sort = sort;
            }
            this.getOrders();
        }

        search() {
            if (this.pagination)
                this.pagination.currentPage = 1;

            this.getOrders();
        }

        getOrders() {
            var filter = this.prepareSearchFilter();
            this.orderService.getOrders(filter, this.pagination).success(data => {
                this.orderHistory = data;
                this.pagination = data.pagination;
            }).error(error => {
                this.validationMessage = error.exceptionMessage;
            });
        }

        prepareSearchFilter(): OrderSearchFilter {
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
        }
    }

    export class OrderSearchFilter implements order.ISearchFilter {
        customerSequence: string;
        sort: string;
        toDate: string;
        fromDate: string;
        ponumber: string;
        ordernumber: string;
        ordertotaloperator: string;
        ordertotal: string;
        status: string;
    }

    angular
        .module("insite")
        .controller("OrderListController", OrderListController);
}
