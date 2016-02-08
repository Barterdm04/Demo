var insite;
(function (insite) {
    var wishlist;
    (function (wishlist) {
        "use strict";
        angular.module("insite").directive("iscWishListView", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/WishList/WishListView"),
                controller: "WishListController",
                controllerAs: "vm"
            };
        }]);
    })(wishlist = insite.wishlist || (insite.wishlist = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.wishlist.directives.js.map