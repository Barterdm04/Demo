var insite;
(function (insite) {
    var savedorders;
    (function (savedorders) {
        "use strict";
        angular.module("insite").directive("iscSavedOrdersListView", ["coreService", function (coreService) {
            var directive = {
                replace: true,
                restrict: "E",
                templateUrl: coreService.getApiUri("/Directives/SavedOrders/SavedOrdersListView"),
                controller: "SavedOrderListController",
                controllerAs: "vm"
            };
            return directive;
        }]).directive("iscSavedOrderDetailView", ["coreService", function (coreService) {
            var directive = {
                replace: true,
                restrict: "E",
                templateUrl: coreService.getApiUri("/Directives/SavedOrders/SavedOrderDetailView"),
                controller: "SavedOrderDetailController",
                controllerAs: "vm"
            };
            return directive;
        }]);
    })(savedorders = insite.savedorders || (insite.savedorders = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.savedorders.directives.js.map