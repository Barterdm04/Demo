var insite;
(function (insite) {
    var catalog;
    (function (catalog) {
        "use strict";
        angular.module("insite").directive("iscCrossSellCarousel", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                scope: {
                    productCrossSell: "@",
                    product: "=",
                    maxTries: "@"
                },
                templateUrl: coreService.getApiUri("/Directives/Catalog/CrossSellCarousel"),
                controller: "CrossSellCarouselController",
                controllerAs: "vm",
                bindToController: true
            };
        }]);
        var carouselimageonload = function () {
            var directive = {
                link: link,
                restrict: "A",
                require: "^iscCrossSellCarousel"
            };
            return directive;
            function link(scope, element) {
                element.on("load error", function () {
                    scope.vm.imagesLoaded++;
                });
            }
        };
        angular.module("insite").directive("carouselimageonload", carouselimageonload);
    })(catalog = insite.catalog || (insite.catalog = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.crosssellcarousel.directive.js.map