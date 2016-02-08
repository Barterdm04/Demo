var insite;
(function (insite) {
    var dealers;
    (function (dealers) {
        "use strict";
        angular.module("insite").directive("iscDealerLocatorView", ["coreService", function (coreService) {
            var directive = {
                replace: true,
                restrict: "E",
                templateUrl: coreService.getApiUri("/Directives/Dealers/DealerLocatorView"),
                controller: "DealerCollectionController",
                controllerAs: "vm"
            };
            return directive;
        }]).directive("iscDealerDirectionsView", ["coreService", function (coreService) {
            var directive = {
                replace: true,
                restrict: "E",
                templateUrl: coreService.getApiUri("/Directives/Dealers/DealerDirectionsView"),
                controller: "DealerDirectionsController",
                controllerAs: "vm"
            };
            return directive;
        }]).directive("iscDealerView", ["coreService", function (coreService) {
            var directive = {
                replace: true,
                restrict: "E",
                templateUrl: coreService.getApiUri("/Directives/Dealers/DealerView"),
                controller: "DealerController",
                controllerAs: "vm"
            };
            return directive;
        }]);
    })(dealers = insite.dealers || (insite.dealers = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.dealers.directives.js.map