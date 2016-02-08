var insite;
(function (insite) {
    var core;
    (function (core) {
        "use strict";
        authenticationInterceptor.$inject = ["$window", "$q", "base64", "spinnerService"];
        function authenticationInterceptor($window, $q, base64, spinnerService) {
            var _this = this;
            return {
                request: function (config) {
                    config.headers = config.headers || {};
                    if (config.url.indexOf("account/isauthenticated") === -1 && $window.localStorage.getItem("accessToken")) {
                        config.headers.Authorization = "Bearer " + $window.localStorage.getItem("accessToken");
                    }
                    return config;
                },
                responseError: function (response) {
                    spinnerService.hide();
                    if (response.status === 401) {
                        // If we got a 401, but do have a local access token, then our access token has expired, need to remove it
                        // Note: We can't use sessionService.isAuthenticated() because of circular dependency
                        if ($window.localStorage.getItem("accessToken") !== null) {
                            $window.localStorage.removeItem("accessToken");
                            // force reload the browser window to invalidate all the etags and not get any stale data
                            _this.$window.location.reload(true);
                        }
                    }
                    return $q.reject(response);
                }
            };
        }
        angular.module("insite").factory("insite.core.authenticationInterceptor", authenticationInterceptor);
    })(core = insite.core || (insite.core = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.authenticationinterceptor.factory.js.map