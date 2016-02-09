module insite.catalog {

    angular.module("insite")
        .directive("iscProductSearch", [
        "coreService", (coreService: core.ICoreService) => {
            var widgetDirective: ng.IDirective = {
                controller: "ProductSearchController",
                controllerAs: "vm",
                bindToController: true,
                replace: true,
                restrict: "E",
                scope: {
                    listenForData: "="
                },
                templateUrl: coreService.getApiUri("/Directives/Catalog/ProductSearch")
            }
            return widgetDirective;
        }
    ])
        .directive("iscProductSearchAutocomplete", [function () {
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
        }
    }]);
} 