var insite;
(function (insite) {
    var dashboard;
    (function (dashboard) {
        "use strict";
        var DashboardMyListsController = (function () {
            function DashboardMyListsController($scope, wishListService) {
                this.$scope = $scope;
                this.wishListService = wishListService;
                this.wishListCollection = [];
                this.init();
            }
            DashboardMyListsController.prototype.init = function () {
                var _this = this;
                this.wishListService.getWishListCollection().then(function (result) {
                    _this.mapData(result);
                });
            };
            DashboardMyListsController.prototype.mapData = function (data) {
                var wishListCount = data.wishListCollection.length;
                if (wishListCount > 0) {
                    this.wishListCollection = data.wishListCollection;
                }
            };
            DashboardMyListsController.$inject = ["$scope", "WishListService"];
            return DashboardMyListsController;
        })();
        dashboard.DashboardMyListsController = DashboardMyListsController;
        angular.module("insite").controller("DashboardMyListsController", DashboardMyListsController);
    })(dashboard = insite.dashboard || (insite.dashboard = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.dashboardmylists.controller.js.map