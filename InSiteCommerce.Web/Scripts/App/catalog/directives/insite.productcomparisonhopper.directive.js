var insite;
(function (insite) {
    var catalog;
    (function (catalog) {
        angular.module("insite").directive("iscProductComparisonHopper", ["coreService", function (coreService) {
            var directive = {
                controller: "ProductComparisonHopperController",
                controllerAs: "vm",
                replace: true,
                restrict: "E",
                templateUrl: coreService.getApiUri("/Directives/Catalog/ProductComparisonHopper"),
                bindToController: true
            };
            return directive;
        }]);
    })(catalog = insite.catalog || (insite.catalog = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.productcomparisonhopper.directive.js.map