var insite;
(function (insite) {
    var dashboard;
    (function (dashboard) {
        "use strict";
        var DashboardQuickLinksController = (function () {
            function DashboardQuickLinksController($scope) {
                this.$scope = $scope;
                this.init();
            }
            DashboardQuickLinksController.prototype.init = function () {
                var _this = this;
                this.$scope.$on("quickLinksLoaded", function (event, data) {
                    _this.quickLinks = data;
                });
            };
            DashboardQuickLinksController.$inject = ["$scope"];
            return DashboardQuickLinksController;
        })();
        dashboard.DashboardQuickLinksController = DashboardQuickLinksController;
        angular.module("insite").controller("DashboardQuickLinksController", DashboardQuickLinksController);
    })(dashboard = insite.dashboard || (insite.dashboard = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.dashboardquicklinks.controller.js.map