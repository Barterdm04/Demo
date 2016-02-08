var insite;
(function (insite) {
    var workflow;
    (function (workflow) {
        "use strict";
        var WorkflowController = (function () {
            function WorkflowController($scope, workflowService) {
                this.$scope = $scope;
                this.workflowService = workflowService;
                this.init();
            }
            WorkflowController.prototype.init = function () {
                this.getWorkflows();
            };
            WorkflowController.prototype.getWorkflows = function () {
                var _this = this;
                this.workflowService.getWorkflows().then(function (result) {
                    _this.$scope.workflows = result.data;
                    _this.$scope.noHandlerCount = 0;
                    result.data.modules.forEach(function (module) {
                        module.services.forEach(function (service) {
                            if (service.handlers.length > 1) {
                                _this.$scope.noHandlerCount++;
                            }
                        });
                    });
                });
            };
            WorkflowController.$inject = [
                "$scope",
                "workflowService"
            ];
            return WorkflowController;
        })();
        workflow.WorkflowController = WorkflowController;
        angular.module("insite").controller("WorkflowController", WorkflowController);
    })(workflow = insite.workflow || (insite.workflow = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.workflow.controller.js.map