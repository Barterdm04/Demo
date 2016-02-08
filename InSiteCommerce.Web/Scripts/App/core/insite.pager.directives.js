var insite;
(function (insite) {
    var core;
    (function (core) {
        "use strict";
        angular.module("insite").directive("iscPager", ["coreService", function (coreService) {
            var directive = {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/Core/Pager"),
                scope: {
                    pagination: "=",
                    bottom: "@",
                    updateData: "&",
                    customContext: "=",
                    storageKey: "=",
                    pageChanged: "&"
                },
                controller: "PagerController",
                controllerAs: "vm",
                bindToController: true
            };
            return directive;
        }]);
    })(core = insite.core || (insite.core = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.pager.directives.js.map