var insite;
(function (insite) {
    var quickorder;
    (function (quickorder) {
        angular.module("insite").directive("iscQuickOrder", ["coreService", function (coreService) {
            var widgetDirective = {
                controller: "QuickOrderController",
                controllerAs: "vm",
                replace: true,
                restrict: "E",
                scope: {},
                templateUrl: coreService.getApiUri("/Directives/QuickOrder/QuickOrder")
            };
            return widgetDirective;
        }]).directive("iscQuickOrderView", ["coreService", function (coreService) {
            var pageDirective = {
                controller: "QuickOrderPageController",
                controllerAs: "vm",
                replace: true,
                restrict: "E",
                scope: {},
                templateUrl: coreService.getApiUri("/Directives/QuickOrder/QuickOrderView")
            };
            return pageDirective;
        }]).directive("iscOrderUploadView", ["coreService", function (coreService) {
            var widgetDirective = {
                controller: "OrderUploadController",
                controllerAs: "vm",
                replace: true,
                restrict: "E",
                scope: {},
                templateUrl: coreService.getApiUri("/Directives/QuickOrder/OrderUploadView"),
                link: function () {
                    $('#buttonFileUpload').click(function (event) {
                        $('#hiddenFileUpload').val(null).click();
                    });
                }
            };
            return widgetDirective;
        }]).directive("iscOrderUploadingPopup", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/QuickOrder/OrderUploadingPopup")
            };
        }]).directive("iscOrderUploadSuccessPopup", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/QuickOrder/OrderUploadSuccessPopup"),
                scope: {
                    itemsCount: "@"
                }
            };
        }]).directive("iscOrderUploadingIssuesPopup", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/QuickOrder/OrderUploadingIssuesPopup")
            };
        }]);
    })(quickorder = insite.quickorder || (insite.quickorder = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.quickorder.directives.js.map