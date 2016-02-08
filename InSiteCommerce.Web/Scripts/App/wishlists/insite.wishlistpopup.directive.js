var insite;
(function (insite) {
    var wishlist;
    (function (wishlist) {
        "use strict";
        angular.module("insite").directive("iscAddWishlistPopup", ["sessionService", "coreService", function (sessionService, coreService) {
            return {
                restrict: "E",
                replace: true,
                scope: {
                    popupId: "@"
                },
                templateUrl: coreService.getApiUri("/Directives/WishList/AddWishListPopup"),
                link: function ($scope) {
                    $scope.isAuthenticated = sessionService.isAuthenticated();
                },
                controller: "WishListPopupController",
                controllerAs: "vm",
                bindToController: true
            };
        }]);
    })(wishlist = insite.wishlist || (insite.wishlist = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.wishlistpopup.directive.js.map