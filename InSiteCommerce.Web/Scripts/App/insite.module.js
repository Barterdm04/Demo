var insite;
(function (insite) {
    "use strict";
    angular.module("insite", [
        "ngSanitize",
        "ngCookies",
        "angular.filter",
        "ngMap",
        "ab-base64"
    ]).run(["$appRunService", appRunFunction]);
    //
    //  The app.run function will execute .run on $appRunService.
    //  Replace the default $appRunService factory with your own to run your own startup code.
    //
    function appRunFunction($appRunService) {
        $appRunService.run();
    }
    function factory(coreService, $localStorage, $window) {
        return new AppRunService(coreService, $localStorage, $window);
    }
    factory.$inject = ["coreService", "$localStorage", "$window"];
    var AppRunService = (function () {
        function AppRunService(coreService, $localStorage, $window) {
            this.coreService = coreService;
            this.$localStorage = $localStorage;
            this.$window = $window;
        }
        AppRunService.prototype.run = function () {
            var hash = this.coreService.queryString(this.$window.location.hash.split("&"));
            var accessToken = hash["access_token"];
            if (accessToken) {
                this.$localStorage.set("accessToken", accessToken);
                this.$window.location.hash = this.$window.location.hash.split("&").filter(function (o) { return o.indexOf("access_token=") !== 0; }).join("&");
            }
        };
        return AppRunService;
    })();
    insite.AppRunService = AppRunService;
    angular.module("insite").factory("$appRunService", factory);
})(insite || (insite = {}));
//# sourceMappingURL=insite.module.js.map