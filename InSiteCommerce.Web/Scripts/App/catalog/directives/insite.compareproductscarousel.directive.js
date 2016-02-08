var insite;
(function (insite) {
    var catalog;
    (function (catalog) {
        angular.module("insite").directive("iscCompareProductsCarousel", ["coreService", function (coreService) {
            var directive = {
                controller: "CompareProductsCarouselController",
                controllerAs: "vm",
                replace: true,
                restrict: "E",
                scope: {
                    addToCart: "&",
                    removeComparedProduct: "&",
                    productsToCompare: "=",
                    openWishListPopup: "&",
                    productSettings: "="
                },
                templateUrl: coreService.getApiUri("/Directives/Catalog/CompareProductsCarousel"),
                bindToController: true
            };
            return directive;
        }]);
        function comparecarouselimageonload() {
            var directive = {
                link: link,
                restrict: "A"
            };
            return directive;
            function link(scope, element) {
                element.on("load error", function () {
                    scope.vm.imagesLoaded++;
                });
            }
        }
        ;
        angular.module("insite").directive("comparecarouselimageonload", comparecarouselimageonload);
    })(catalog = insite.catalog || (insite.catalog = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.compareproductscarousel.directive.js.map