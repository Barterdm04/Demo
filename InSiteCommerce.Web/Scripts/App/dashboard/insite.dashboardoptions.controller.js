var insite;
(function (insite) {
    var dashboard;
    (function (dashboard) {
        "use strict";
        var DashboardOptionsController = (function () {
            function DashboardOptionsController($scope, sessionService) {
                this.$scope = $scope;
                this.sessionService = sessionService;
                this.init();
            }
            DashboardOptionsController.prototype.init = function () {
                var _this = this;
                this.$scope.$on("sessionLoaded", function (event, session) {
                    _this.dashboardIsHomepage = session.dashboardIsHomepage;
                });
            };
            DashboardOptionsController.prototype.changeDashboardHomepage = function ($event) {
                var _this = this;
                var checkbox = $event.target;
                var session = {};
                session.dashboardIsHomepage = checkbox.checked;
                this.sessionService.updateSession(session).success(function (result) {
                    _this.dashboardIsHomepage = result.dashboardIsHomepage;
                });
            };
            DashboardOptionsController.$inject = ["$scope", "sessionService"];
            return DashboardOptionsController;
        })();
        dashboard.DashboardOptionsController = DashboardOptionsController;
        angular.module("insite").controller("DashboardOptionsController", DashboardOptionsController);
    })(dashboard = insite.dashboard || (insite.dashboard = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.dashboardoptions.controller.js.map