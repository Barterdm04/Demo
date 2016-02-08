var insite;
(function (insite) {
    var useradministration;
    (function (useradministration) {
        angular.module("insite").directive("iscUserListView", ["coreService", function (coreService) {
            var directive = {
                controller: "UserListController",
                controllerAs: "vm",
                replace: true,
                restrict: "E",
                scope: {},
                templateUrl: coreService.getApiUri("/Directives/UserAdministration/UserListView")
            };
            return directive;
        }]).directive("iscUserSetupView", ["coreService", function (coreService) {
            var directive = {
                controller: "UserDetailController",
                controllerAs: "vm",
                replace: true,
                restrict: "E",
                scope: {},
                templateUrl: coreService.getApiUri("/Directives/UserAdministration/UserSetupView")
            };
            return directive;
        }]).directive("iscUserSetupShipToView", ["coreService", function (coreService) {
            var directive = {
                controller: "UserShipToController",
                controllerAs: "vm",
                replace: true,
                restrict: "E",
                scope: {},
                templateUrl: coreService.getApiUri("/Directives/UserAdministration/UserSetupShipToView")
            };
            return directive;
        }]);
    })(useradministration = insite.useradministration || (insite.useradministration = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.user.directive.js.map