/// <reference path="../../../typings/angularjs/angular.d.ts" />
var insite;
(function (insite) {
    var catalog;
    (function (catalog) {
        angular.module("insite").directive("iscCategoryLeftNav", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                scope: {
                    products: "=",
                    breadCrumbs: "=",
                    attributeValueIds: "=",
                    filterCategory: "=",
                    priceFilterMinimums: "=",
                    updateProductData: "&",
                    quickSearchTerm: "="
                },
                templateUrl: coreService.getApiUri("/Directives/Catalog/CategoryLeftNav"),
                controller: "CategoryLeftNavController",
                controllerAs: "vm",
                bindToController: true
            };
        }]);
    })(catalog = insite.catalog || (insite.catalog = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.categoryleftnav.directive.js.map