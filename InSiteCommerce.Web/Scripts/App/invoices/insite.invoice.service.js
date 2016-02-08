var insite;
(function (insite) {
    var invoice;
    (function (invoice) {
        "use strict";
        var InvoiceService = (function () {
            function InvoiceService($http, coreService) {
                this.$http = $http;
                this.coreService = coreService;
                this.serviceUri = this.coreService.getApiUri("/api/v1/invoices");
            }
            InvoiceService.prototype.getInvoices = function (filter, pagination) {
                var uri = this.serviceUri;
                if (filter) {
                    uri += "?";
                    for (var property in filter) {
                        if (filter[property]) {
                            uri += property + "=" + filter[property] + "&";
                        }
                    }
                }
                if (pagination) {
                    uri += "currentPage=" + pagination.currentPage + "&pageSize=" + pagination.pageSize;
                }
                uri = uri.replace(/&$/, "");
                return this.$http.get(uri, { bypassErrorInterceptor: true });
            };
            InvoiceService.prototype.getInvoice = function (invoiceId, expand) {
                var uri = this.serviceUri + "/" + invoiceId;
                if (expand) {
                    uri += "?expand=" + expand;
                }
                return this.$http.get(uri, { bypassErrorInterceptor: true });
            };
            return InvoiceService;
        })();
        invoice.InvoiceService = InvoiceService;
        function factory($http, coreService) {
            return new InvoiceService($http, coreService);
        }
        factory.$inject = ["$http", "coreService"];
        angular.module("insite").factory("invoiceService", factory);
    })(invoice = insite.invoice || (insite.invoice = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.invoice.service.js.map