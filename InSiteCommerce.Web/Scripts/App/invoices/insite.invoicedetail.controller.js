var insite;
(function (insite) {
    var invoice;
    (function (invoice) {
        "use strict";
        var InvoiceDetailController = (function () {
            function InvoiceDetailController(invoiceService, coreService) {
                this.invoiceService = invoiceService;
                this.coreService = coreService;
                this.init();
            }
            InvoiceDetailController.prototype.init = function () {
                this.invoiceNumber = this.coreService.getQueryStringParameter("invoiceNumber", true);
                if (typeof this.invoiceNumber === "undefined") {
                    // handle "clean urls" 
                    var pathArray = window.location.pathname.split("/");
                    var pathInvoiceNumber = pathArray[pathArray.length - 1];
                    if (pathInvoiceNumber !== "InvoiceHistoryDetail") {
                        this.invoiceNumber = pathInvoiceNumber;
                    }
                }
                this.getInvoice(this.invoiceNumber);
            };
            /* mimics the functionality in the html helper extension */
            InvoiceDetailController.prototype.formatCityCommaStateZip = function (city, state, zip) {
                var formattedString = "";
                if (city) {
                    formattedString += city;
                }
                if (city && state) {
                    formattedString += ", " + state + " " + zip;
                }
                return formattedString;
            };
            InvoiceDetailController.prototype.getInvoice = function (invoiceNumber) {
                var _this = this;
                this.invoiceService.getInvoice(invoiceNumber, "invoicelines,shipments").success(function (data) {
                    _this.invoice = data;
                    _this.btFormat = _this.formatCityCommaStateZip(_this.invoice.billToCity, _this.invoice.billToState, _this.invoice.billToPostalCode);
                    _this.stFormat = _this.formatCityCommaStateZip(_this.invoice.shipToCity, _this.invoice.shipToState, _this.invoice.shipToPostalCode);
                }).error(function (error) {
                    _this.validationMessage = error.exceptionMessage;
                });
            };
            InvoiceDetailController.$inject = [
                "invoiceService",
                "coreService"
            ];
            return InvoiceDetailController;
        })();
        invoice.InvoiceDetailController = InvoiceDetailController;
        angular.module("insite").controller("InvoiceDetailController", InvoiceDetailController);
    })(invoice = insite.invoice || (insite.invoice = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.invoicedetail.controller.js.map