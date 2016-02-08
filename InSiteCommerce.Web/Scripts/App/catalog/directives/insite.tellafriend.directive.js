///<reference path="../../../typings/angularjs/angular.d.ts"/>
var insite;
(function (insite) {
    var catalog;
    (function (catalog) {
        angular.module("insite").directive("iscTellAFriendPopup", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                scope: {
                    product: "="
                },
                templateUrl: coreService.getApiUri("/Directives/Catalog/TellAFriend"),
                controller: "TellAFriendController",
                controllerAs: "vm",
                bindToController: true
            };
        }]);
    })(catalog = insite.catalog || (insite.catalog = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.tellafriend.directive.js.map