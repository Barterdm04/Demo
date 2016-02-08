/// <reference path="../../typings/angularjs/angular.d.ts" />
var insite;
(function (insite) {
    var core;
    (function (core) {
        "use strict";
        angular.module("insite").directive("iscBreadcrumb", [
            "coreService",
            function (coreService) {
                return {
                    restrict: "E",
                    replace: true,
                    scope: {
                        breadcrumbs: "=",
                        searchQuery: "="
                    },
                    templateUrl: coreService.getApiUri("/Directives/Core/BreadCrumb")
                };
            }
        ]).directive("iscRequiredField", [
            "coreService",
            function (coreService) {
                return {
                    restrict: "E",
                    replace: true,
                    templateUrl: coreService.getApiUri("/Directives/Core/RequiredField"),
                    scope: {
                        fieldLabel: "@",
                        fieldName: "@",
                        isRequired: "@",
                        isEmail: "@",
                        fieldValue: "="
                    }
                };
            }
        ]).directive("iscEnter", function () {
            return function (scope, element, attrs) {
                element.bind("keydown keypress", function (event) {
                    if (event.which === 13) {
                        scope.$apply(function () {
                            scope.$eval(attrs.iscEnter);
                        });
                        event.preventDefault();
                    }
                });
            };
        }).directive("iscNoElement", function () {
            return {
                restrict: "E",
                replace: true,
                template: ""
            };
        }).directive("iscCompareTo", function () {
            return {
                restrict: "A",
                scope: true,
                require: "ngModel",
                link: function (scope, elem, attrs, control) {
                    var checker = function () {
                        var e1 = scope.$eval(attrs.ngModel);
                        var e2 = scope.$eval(attrs.iscCompareTo);
                        // models can become undefined when other validation fails and give a false positive
                        return !e1 || !e2 || e1 === e2;
                    };
                    scope.$watch(checker, function (n) {
                        control.$setValidity("compareTo", n);
                    });
                }
            };
        }).directive("iscValidEmail", function () {
            var EMAIL_REGEXP = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i;
            return {
                require: "ngModel",
                restrict: "",
                link: function (scope, elm, attrs, ctrl) {
                    // only apply the validator if ngModel is present and Angular has added the email validator
                    if (ctrl && ctrl.$validators.email) {
                        // this will overwrite the default Angular email validator
                        ctrl.$validators.email = function (modelValue) {
                            return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
                        };
                    }
                }
            };
        }).directive('iscSpinner', ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                transclude: true,
                scope: {
                    name: "@?",
                    group: "@?",
                    show: "=?",
                    size: "@?",
                    replace: "@?",
                    register: "@?"
                },
                templateUrl: coreService.getApiUri("/Directives/Core/Spinner"),
                controller: "SpinnerController",
                controllerAs: "vm",
                bindToController: true
            };
        }]).directive("iscApiErrorPopup", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/Core/ApiErrorPopup"),
                scope: {},
                controller: "ApiErrorPopupController",
                controllerAs: "vm",
                bindToController: true
            };
        }]);
    })(core = insite.core || (insite.core = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.core.directives.js.map