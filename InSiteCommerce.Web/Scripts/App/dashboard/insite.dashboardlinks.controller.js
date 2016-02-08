var insite;
(function (insite) {
    var dashboard;
    (function (dashboard) {
        "use strict";
        var DashboardLinksController = (function () {
            function DashboardLinksController(dashboardService, $rootScope) {
                this.dashboardService = dashboardService;
                this.$rootScope = $rootScope;
                this.init();
            }
            DashboardLinksController.prototype.init = function () {
                this.getDashboardPanels();
            };
            DashboardLinksController.prototype.getDashboardPanels = function () {
                var _this = this;
                this.dashboardService.getDashboardPanels().success(function (result) {
                    _this.links = result.dashboardPanels.filter(function (x) {
                        return !x.isPanel;
                    });
                    _this.panels = result.dashboardPanels.filter(function (x) {
                        return x.isPanel;
                    });
                    var quickLinks = result.dashboardPanels.filter(function (x) {
                        return x.isQuickLink;
                    });
                    _this.$rootScope.$broadcast("quickLinksLoaded", quickLinks);
                });
            };
            DashboardLinksController.prototype.getCssClass = function (panelType) {
                if (panelType === this.orderKey) {
                    return "db-li-oapp";
                }
                if (panelType === this.requisitionKey) {
                    return "db-li-req";
                }
                if (panelType === this.quoteKey) {
                    return "db-li-quotes";
                }
                return "";
            };
            DashboardLinksController.$inject = ["dashboardService", "$rootScope"];
            return DashboardLinksController;
        })();
        dashboard.DashboardLinksController = DashboardLinksController;
        angular.module("insite").controller("DashboardLinksController", DashboardLinksController);
    })(dashboard = insite.dashboard || (insite.dashboard = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.dashboardlinks.controller.js.map