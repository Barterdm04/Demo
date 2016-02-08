var insite;
(function (insite) {
    var requisitions;
    (function (requisitions) {
        "use strict";
        var RequisitionService = (function () {
            function RequisitionService($http, $q, coreService) {
                this.$http = $http;
                this.$q = $q;
                this.coreService = coreService;
                this.serviceUri = this.coreService.getApiUri("/api/v1/requisitions");
            }
            RequisitionService.prototype.getRequisitionCollection = function (pagination) {
                var uri = this.serviceUri;
                if (pagination) {
                    uri += "?currentPage=" + pagination.currentPage + "&pageSize=" + pagination.pageSize;
                }
                uri = uri.replace(/&$/, "");
                return this.$http.get(uri);
            };
            RequisitionService.prototype.getRequisition = function (requisitionId) {
                return this.$http.get(this.serviceUri + "/" + requisitionId + "?expand=requisitionlines");
            };
            RequisitionService.prototype.getRequisitionCount = function () {
                var uri = this.serviceUri + "?pageSize=1";
                return this.$http.get(uri);
            };
            RequisitionService.prototype.patchRequisition = function (requisition) {
                return this.$http({ method: "PATCH", url: requisition.uri, data: requisition });
            };
            RequisitionService.prototype.patchRequisitionLine = function (requisitionLine) {
                return this.$http({ method: "PATCH", url: requisitionLine.uri, data: requisitionLine });
            };
            RequisitionService.prototype.deleteRequisitionLine = function (requisitionLine) {
                return this.$http.delete(requisitionLine.uri);
            };
            return RequisitionService;
        })();
        requisitions.RequisitionService = RequisitionService;
        function factory($http, $q, coreService) {
            return new RequisitionService($http, $q, coreService);
        }
        factory.$inject = ["$http", "$q", "coreService"];
        angular.module("insite").factory("requisitionService", factory);
    })(requisitions = insite.requisitions || (insite.requisitions = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.requisitions.service.js.map