var insite;
(function (insite) {
    var workflow;
    (function (workflow) {
        angular.module("insite").directive("iscWorkflowListView", ["coreService", function (coreService) {
            var directive = {
                controller: "WorkflowController",
                //controllerAs: "vm",
                replace: true,
                restrict: "E",
                scope: {},
                templateUrl: coreService.getApiUri("/Directives/Workflow/WorkflowListView")
            };
            return directive;
        }]).directive("iscWorkflowDetailView", ["coreService", function (coreService) {
            var directive = {
                controller: "WorkflowDetailController",
                //controllerAs: "vm",
                replace: true,
                restrict: "E",
                scope: {},
                templateUrl: coreService.getApiUri("/Directives/Workflow/WorkflowDetailView")
            };
            return directive;
        }]);
    })(workflow = insite.workflow || (insite.workflow = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.workflow.directives.js.map