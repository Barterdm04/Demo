var insite;
(function (insite) {
    var catalog;
    (function (catalog) {
        "use strict";
        angular.module("insite").directive("iscPagerCustomControls", ["coreService", function (coreService) {
            return {
                restrict: "E",
                scope: {
                    customContext: "=",
                    bottom: "="
                },
                templateUrl: coreService.getApiUri("/Directives/PagerCustomControls")
            };
        }]);
        function productlistimageonload() {
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
        angular.module("insite").directive("productlistimageonload", productlistimageonload);
    })(catalog = insite.catalog || (insite.catalog = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.productlist.directives.js.map