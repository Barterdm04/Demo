var insite;
(function (insite) {
    var dashboard;
    (function (dashboard) {
        "use strict";
        var DashboardService = (function () {
            function DashboardService($http, coreService) {
                this.$http = $http;
                this.coreService = coreService;
                this.dashboardPanelsUri = this.coreService.getApiUri("/api/v1/dashboardpanels/");
            }
            DashboardService.prototype.getDashboardPanels = function () {
                return this.$http.get(this.dashboardPanelsUri);
            };
            DashboardService.$inject = ["$http", "coreService"];
            return DashboardService;
        })();
        dashboard.DashboardService = DashboardService;
        angular.module("insite").service("dashboardService", DashboardService);
    })(dashboard = insite.dashboard || (insite.dashboard = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.dashboard.service.js.map