var insite;
(function (insite) {
    var core;
    (function (core) {
        "use strict";
        function httpErrorsInterceptor($q, $rootScope, spinnerService) {
            var xhrCreations = 0;
            var xhrResolutions = 0;
            function UpdateLoadingStatus() {
                if (xhrResolutions >= xhrCreations) {
                    spinnerService.hideAll();
                }
            }
            return {
                request: function (config) {
                    xhrCreations++;
                    return config;
                },
                requestEror: function (rejection) {
                    xhrResolutions++;
                    UpdateLoadingStatus();
                    return $q.reject(rejection);
                },
                response: function (response) {
                    xhrResolutions++;
                    UpdateLoadingStatus();
                    return response;
                },
                responseError: function (response) {
                    xhrResolutions++;
                    UpdateLoadingStatus();
                    var config = response.config;
                    // TODO ditch bypassError completely?
                    if (config["bypassErrorInterceptor"]) {
                        return $q.reject(response);
                    }
                    if (response.status === 500) {
                        $rootScope.$broadcast("showApiErrorPopup", response.data);
                    }
                    return $q.reject(response);
                }
            };
        }
        httpErrorsInterceptor.$inject = ["$q", "$rootScope", "spinnerService"];
        angular.module("insite").factory("insite.core.httpErrorsInterceptor", httpErrorsInterceptor);
    })(core = insite.core || (insite.core = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.core.httpErrorsInterceptor.factory.js.map