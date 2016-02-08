var insite;
(function (insite) {
    var invoice;
    (function (invoice) {
        "use strict";
        var InvoiceListController = (function () {
            function InvoiceListController(invoiceService, customerService, coreService, paginationService) {
                this.invoiceService = invoiceService;
                this.customerService = customerService;
                this.coreService = coreService;
                this.paginationService = paginationService;
                this.paginationStorageKey = "DefaultPagination-InvoiceList";
                this.searchFilter = {
                    customerSequence: "-1",
                    sort: "InvoiceDate DESC"
                };
                this.init();
            }
            InvoiceListController.prototype.init = function () {
                var _this = this;
                this.pagination = this.paginationService.getDefaultPagination(this.paginationStorageKey);
                this.getInvoices();
                this.customerService.getShipTos().success(function (data) {
                    _this.shipTos = data.shipTos;
                });
            };
            InvoiceListController.prototype.clear = function () {
                this.pagination.currentPage = 1;
                this.searchFilter = {
                    customerSequence: "-1",
                    sort: "InvoiceDate"
                };
                this.getInvoices();
            };
            InvoiceListController.prototype.changeSort = function (sort) {
                if (this.searchFilter.sort === sort && this.searchFilter.sort.indexOf(" DESC") < 0) {
                    this.searchFilter.sort = sort + " DESC";
                }
                else {
                    this.searchFilter.sort = sort;
                }
                this.getInvoices();
            };
            InvoiceListController.prototype.search = function () {
                if (this.pagination)
                    this.pagination.currentPage = 1;
                this.getInvoices();
            };
            InvoiceListController.prototype.getInvoices = function () {
                var _this = this;
                this.invoiceService.getInvoices(this.searchFilter, this.pagination).success(function (data) {
                    _this.invoiceHistory = data;
                    _this.pagination = data.pagination;
                }).error(function (error) {
                    _this.validationMessage = error.exceptionMessage;
                });
            };
            InvoiceListController.$inject = [
                "invoiceService",
                "customerService",
                "coreService",
                "paginationService"
            ];
            return InvoiceListController;
        })();
        invoice.InvoiceListController = InvoiceListController;
        angular.module("insite").controller("InvoiceListController", InvoiceListController);
    })(invoice = insite.invoice || (insite.invoice = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.invoicelist.controller.js.map