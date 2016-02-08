var insite;
(function (insite) {
    var requisitions;
    (function (requisitions) {
        "use strict";
        angular.module("insite").directive("iscRequisitionLines", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/Requisitions/RequisitionLines")
            };
        }]).directive("iscRequisitionView", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/Requisitions/RequisitionView"),
                controller: "RequisitionsController",
                controllerAs: "vm",
                scope: {
                    updateItemMessage: "@",
                    deleteItemMessage: "@",
                    deleteOrderLineMessage: "@"
                },
                bindToController: true
            };
        }]);
    })(requisitions = insite.requisitions || (insite.requisitions = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.requisitions.directive.js.map