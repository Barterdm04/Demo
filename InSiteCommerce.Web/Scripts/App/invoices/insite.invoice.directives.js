var insite;
(function (insite) {
    var invoice;
    (function (invoice) {
        angular.module("insite").directive("iscInvoiceListView", ["coreService", function (coreService) {
            var directive = {
                controller: "InvoiceListController",
                controllerAs: "vm",
                replace: true,
                restrict: "E",
                scope: {},
                templateUrl: coreService.getApiUri("/Directives/History/InvoiceListView")
            };
            return directive;
        }]).directive("iscInvoiceDetailView", ["coreService", function (coreService) {
            var directive = {
                controller: "InvoiceDetailController",
                controllerAs: "vm",
                replace: true,
                restrict: "E",
                scope: {},
                templateUrl: coreService.getApiUri("/Directives/History/InvoiceDetailView")
            };
            return directive;
        }]);
    })(invoice = insite.invoice || (insite.invoice = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.invoice.directives.js.map