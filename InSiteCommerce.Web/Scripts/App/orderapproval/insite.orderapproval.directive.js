var insite;
(function (insite) {
    var orderapproval;
    (function (orderapproval) {
        angular.module("insite").directive("iscOrderApprovalListView", ["coreService", function (coreService) {
            var directive = {
                controller: "OrderApprovalListController",
                controllerAs: "vm",
                replace: true,
                restrict: "E",
                scope: {},
                templateUrl: coreService.getApiUri("/Directives/OrderApproval/OrderApprovalListView")
            };
            return directive;
        }]).directive("iscOrderApprovalDetailView", ["coreService", function (coreService) {
            var directive = {
                controller: "OrderApprovalDetailController",
                controllerAs: "vm",
                replace: true,
                restrict: "E",
                scope: {},
                templateUrl: coreService.getApiUri("/Directives/OrderApproval/OrderApprovalDetailView")
            };
            return directive;
        }]);
    })(orderapproval = insite.orderapproval || (insite.orderapproval = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.orderapproval.directive.js.map