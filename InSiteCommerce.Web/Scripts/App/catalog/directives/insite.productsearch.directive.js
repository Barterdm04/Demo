var insite;
(function (insite) {
    var catalog;
    (function (catalog) {
        angular.module("insite").directive("iscProductSearch", [
            "coreService",
            function (coreService) {
                var widgetDirective = {
                    controller: "ProductSearchController",
                    controllerAs: "vm",
                    bindToController: true,
                    replace: true,
                    restrict: "E",
                    scope: {
                        listenForData: "="
                    },
                    templateUrl: coreService.getApiUri("/Directives/Catalog/ProductSearch")
                };
                return widgetDirective;
            }
        ]).directive("iscProductSearchAutocomplete", [function () {
            return {
                restrict: "A",
                replace: true,
                controller: "ProductSearchAutocompleteController",
                controllerAs: "vm",
                bindToController: true,
                scope: {
                    onsuggestionclick: "=",
                    transformresult: "=",
                    categoryselectorid: "@"
                }
            };
        }]);
    })(catalog = insite.catalog || (insite.catalog = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.productsearch.directive.js.map