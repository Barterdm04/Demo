var insite;
(function (insite) {
    var dashboard;
    (function (dashboard) {
        "use strict";
        angular.module("insite").directive("iscMakeDashboardHomepage", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/Dashboard/HomepageOption"),
                scope: {},
                controller: "DashboardOptionsController",
                controllerAs: "vm"
            };
        }]).directive("iscDashboardView", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/Dashboard/DashboardView"),
                scope: {},
                controller: "DashboardViewController",
                controllerAs: "vm"
            };
        }]).directive("iscQuickLinks", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/Dashboard/QuickLinks"),
                scope: {},
                controller: "DashboardQuickLinksController",
                controllerAs: "vm"
            };
        }]).directive("iscMyLists", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/Dashboard/MyLists"),
                scope: {},
                controller: "DashboardMyListsController",
                controllerAs: "vm"
            };
        }]).directive("iscDashboardLinks", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/Dashboard/DashboardLinks"),
                scope: {
                    orderKey: "@",
                    requisitionKey: "@",
                    quoteKey: "@"
                },
                controller: "DashboardLinksController",
                controllerAs: "vm",
                bindToController: true
            };
        }]);
    })(dashboard = insite.dashboard || (insite.dashboard = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.dashboard.directives.js.map