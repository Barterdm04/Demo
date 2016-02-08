var insite;
(function (insite) {
    var workflow;
    (function (workflow) {
        "use strict";
        var WorkflowService = (function () {
            function WorkflowService($http, $q) {
                this.$http = $http;
                this.$q = $q;
                this.serviceUri = "/api/v1/workflows";
            }
            WorkflowService.prototype.getWorkflow = function (serviceName) {
                var deferred = this.$q.defer();
                return this.$http.get(this.serviceUri + "/" + serviceName).success(function (result) { return deferred.resolve(result); }).error(deferred.reject);
            };
            WorkflowService.prototype.getWorkflows = function () {
                var deferred = this.$q.defer();
                return this.$http.get(this.serviceUri).success(function (result) { return deferred.resolve(result); }).error(deferred.reject);
                ;
            };
            WorkflowService.prototype.bootstrapService = function (url) {
                var deferred = this.$q.defer();
                return this.$http.get(url).success(function (result) { return deferred.resolve(result); }).error(deferred.reject);
            };
            WorkflowService.$inject = ["$http", "$q"];
            return WorkflowService;
        })();
        workflow.WorkflowService = WorkflowService;
        angular.module("insite").service("workflowService", WorkflowService);
    })(workflow = insite.workflow || (insite.workflow = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.workflow.service.js.map