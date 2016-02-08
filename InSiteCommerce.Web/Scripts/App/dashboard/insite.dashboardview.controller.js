var insite;
(function (insite) {
    var dashboard;
    (function (dashboard) {
        "use strict";
        var DashboardViewController = (function () {
            function DashboardViewController($scope) {
                this.$scope = $scope;
                this.init();
            }
            DashboardViewController.prototype.init = function () {
                var _this = this;
                this.$scope.$on("sessionLoaded", function (event, session) {
                    _this.isSalesPerson = session.isSalesPerson;
                });
                this.$scope.$on("cartLoaded", function (event, cart) {
                    _this.canRequestQuote = cart.canRequestQuote;
                });
            };
            DashboardViewController.$inject = ["$scope"];
            return DashboardViewController;
        })();
        dashboard.DashboardViewController = DashboardViewController;
        angular.module("insite").controller("DashboardViewController", DashboardViewController);
    })(dashboard = insite.dashboard || (insite.dashboard = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.dashboardview.controller.js.map