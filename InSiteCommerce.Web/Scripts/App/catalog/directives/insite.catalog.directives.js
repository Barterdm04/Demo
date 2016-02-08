///<reference path="../../../typings/angularjs/angular.d.ts"/>
var insite;
(function (insite) {
    var catalog;
    (function (catalog) {
        "use strict";
        angular.module("insite").directive("iscProductListView", ["coreService", function (coreService) {
            return {
                controller: "ProductListController",
                controllerAs: "vm",
                restrict: "E",
                replace: true,
                scope: {},
                templateUrl: coreService.getApiUri("/Directives/Catalog/ProductListView")
            };
        }]).directive("iscProductDetailView", ["coreService", function (coreService) {
            return {
                controller: "ProductDetailController",
                controllerAs: "vm",
                restrict: "E",
                replace: true,
                scope: {},
                templateUrl: coreService.getApiUri("/Directives/Catalog/ProductDetailView")
            };
        }]).directive("iscProductName", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                scope: {
                    product: "=",
                    noLink: "@"
                },
                templateUrl: coreService.getApiUri("/Directives/Catalog/ProductName")
            };
        }]).directive("iscProductThumb", ["coreService", function (coreService) {
            return {
                restrict: "E",
                scope: {
                    product: "="
                },
                templateUrl: coreService.getApiUri("/Directives/Catalog/ProductThumb")
            };
        }]).directive("iscAvailabilityMessage", ["coreService", function (coreService) {
            return {
                restrict: "E",
                scope: {
                    availability: "="
                },
                templateUrl: coreService.getApiUri("/Directives/Catalog/AvailabilityMessage")
            };
        }]).directive("iscProductPrice", ["coreService", function (coreService) {
            return {
                controller: "ProductPriceController",
                controllerAs: "vm",
                restrict: "E",
                scope: {
                    product: "=",
                    idKey: "@"
                },
                templateUrl: coreService.getApiUri("/Directives/Catalog/ProductPrice")
            };
        }]).directive("iscQuantityBreakPricing", ["coreService", function (coreService) {
            return {
                restrict: "E",
                scope: {
                    productId: "=",
                    breakPrices: "=",
                    block: "@"
                },
                templateUrl: coreService.getApiUri("/Directives/Catalog/QuantityBreakPricing")
            };
        }]).directive("iscSortedAttributeValueList", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                scope: {
                    attributeTypes: "=",
                    maximumNumber: "@"
                },
                templateUrl: coreService.getApiUri("/Directives/Catalog/SortedAttributeValueList")
            };
        }]).directive("iscUnitOfMeasureSelectList", ["coreService", function (coreService) {
            return {
                restrict: "E",
                templateUrl: coreService.getApiUri("/Directives/Catalog/UnitOfMeasureSelectList"),
                scope: {
                    product: "=",
                    alternateUnitsOfMeasure: "@",
                    displayPack: "@",
                    changeUnitOfMeasure: "&"
                }
            };
        }]).directive("iscUnitOfMeasureDisplay", ["coreService", function (coreService) {
            return {
                restrict: "E",
                templateUrl: coreService.getApiUri("/Directives/Catalog/UnitOfMeasureDisplay"),
                scope: {
                    product: "="
                }
            };
        }]);
    })(catalog = insite.catalog || (insite.catalog = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.catalog.directives.js.map