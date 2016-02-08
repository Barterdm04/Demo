var insite;
(function (insite) {
    var catalog;
    (function (catalog) {
        "use strict";
        angular.module("insite").directive("iscProductComparisonView", [
            "coreService",
            function (coreService) {
                return {
                    controller: "CompareProductsController",
                    controllerAs: "vm",
                    restrict: "E",
                    replace: true,
                    scope: {},
                    templateUrl: coreService.getApiUri("/Directives/Catalog/ProductComparisonView")
                };
            }
        ]);
    })(catalog = insite.catalog || (insite.catalog = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.productcomparisonview.directive.js.map