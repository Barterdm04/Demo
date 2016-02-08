var insite;
(function (insite) {
    var rfq;
    (function (rfq) {
        "use strict";
        var MyQuotesController = (function () {
            function MyQuotesController($scope, rfqService, coreService, accountService, customerService, paginationService) {
                this.$scope = $scope;
                this.rfqService = rfqService;
                this.coreService = coreService;
                this.accountService = accountService;
                this.customerService = customerService;
                this.paginationService = paginationService;
                this.paginationStorageKey = "DefaultPagination-MyQuotes";
                this.isSalesRep = true;
                this.init();
            }
            MyQuotesController.prototype.init = function () {
                this.pagination = this.paginationService.getDefaultPagination(this.paginationStorageKey);
                this.initEvents();
            };
            MyQuotesController.prototype.initEvents = function () {
                var _this = this;
                this.$scope.$on("cartLoaded", function (event, cart) {
                    _this.mapData(cart);
                });
                this.$scope.$on("settingsLoaded", function (event, data) {
                    _this.quoteSettings = data.quoteSettings;
                });
            };
            MyQuotesController.prototype.mapData = function (cart) {
                var _this = this;
                this.cart = cart;
                this.isSalesRep = cart.isSalesperson;
                this.setDefaultSearchFilter();
                if (this.isSalesRep) {
                    this.rfqService.expand = "saleslist";
                    this.accountService.getAccounts().success(function (result) {
                        _this.userList = result.accounts;
                    });
                    this.customerService.getBillTos().success(function (result) {
                        _this.customerList = result.billTos;
                    });
                }
                this.getQuotes();
            };
            MyQuotesController.prototype.setDefaultSearchFilter = function () {
                this.searchFilter = {};
                this.searchFilter.statuses = [];
                this.searchFilter.types = [];
                this.selectedStatus = "";
                this.selectedSalesRep = null;
                this.selectedUser = null;
                this.selectedCustomer = null;
                this.selectedType = "";
            };
            MyQuotesController.prototype.getQuotes = function () {
                var _this = this;
                this.rfqService.getQuotes(this.searchFilter, this.pagination).success(function (result) {
                    _this.quotes = result.quotes;
                    _this.pagination = result.pagination;
                    if (result.salespersonList) {
                        _this.salesRepList = result.salespersonList;
                    }
                });
            };
            MyQuotesController.prototype.clear = function () {
                this.pagination.currentPage = 1;
                this.setDefaultSearchFilter();
                this.getQuotes();
            };
            MyQuotesController.prototype.search = function () {
                this.pagination.currentPage = 1;
                this.searchFilter.statuses = [];
                this.searchFilter.types = [];
                if (this.selectedStatus) {
                    this.searchFilter.statuses.push(this.selectedStatus);
                }
                if (this.selectedUser) {
                    this.searchFilter.userId = this.selectedUser.id;
                }
                else {
                    this.searchFilter.userId = "";
                }
                if (this.selectedCustomer) {
                    this.searchFilter.customerId = this.selectedCustomer.id;
                }
                else {
                    this.searchFilter.customerId = "";
                }
                if (this.selectedSalesRep) {
                    this.searchFilter.salesRepNumber = this.selectedSalesRep.salespersonNumber;
                }
                else {
                    this.searchFilter.salesRepNumber = "";
                }
                if (this.selectedType) {
                    this.searchFilter.types.push(this.selectedType);
                }
                this.getQuotes();
            };
            MyQuotesController.$inject = ["$scope", "rfqService", "coreService", "accountService", "customerService", "paginationService"];
            return MyQuotesController;
        })();
        rfq.MyQuotesController = MyQuotesController;
        angular.module("insite").controller("MyQuotesController", MyQuotesController);
    })(rfq = insite.rfq || (insite.rfq = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.myquotes.controller.js.map