var insite;
(function (insite) {
    var core;
    (function (core) {
        "use strict";
        var ApiErrorPopupController = (function () {
            function ApiErrorPopupController($scope, coreService) {
                this.$scope = $scope;
                this.coreService = coreService;
                this.init();
            }
            ApiErrorPopupController.prototype.init = function () {
                var _this = this;
                this.$scope.$on("showApiErrorPopup", function (event, message) {
                    var $popup = angular.element("#apiErrorPopup");
                    if ($popup.length > 0) {
                        _this.errorMessage = JSON.stringify(message, null, "<br/>");
                        _this.coreService.displayModal($popup);
                    }
                });
            };
            ApiErrorPopupController.$inject = [
                "$scope",
                "coreService"
            ];
            return ApiErrorPopupController;
        })();
        core.ApiErrorPopupController = ApiErrorPopupController;
        angular.module("insite").controller("ApiErrorPopupController", ApiErrorPopupController);
    })(core = insite.core || (insite.core = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.apierror.controller.js.map