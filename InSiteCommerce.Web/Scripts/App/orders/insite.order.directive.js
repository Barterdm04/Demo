var insite;
(function (insite) {
    var order;
    (function (order) {
        angular.module("insite").directive("iscOrderListView", ["coreService", function (coreService) {
            var directive = {
                controller: "OrderListController",
                controllerAs: "vm",
                replace: true,
                restrict: "E",
                scope: {},
                templateUrl: coreService.getApiUri("/Directives/History/OrderListView")
            };
            return directive;
        }]).directive("iscRecentOrders", ["coreService", function (coreService) {
            var directive = {
                controller: "RecentOrdersController",
                controllerAs: "vm",
                replace: true,
                restrict: "E",
                scope: {},
                templateUrl: coreService.getApiUri("/Directives/History/RecentOrders")
            };
            return directive;
        }]).directive("iscOrderDetailView", ["coreService", function (coreService) {
            var directive = {
                controller: "OrderDetailController",
                controllerAs: "vm",
                replace: true,
                restrict: "E",
                scope: {},
                templateUrl: coreService.getApiUri("/Directives/History/OrderDetailView")
            };
            return directive;
        }]);
    })(order = insite.order || (insite.order = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.order.directive.js.map