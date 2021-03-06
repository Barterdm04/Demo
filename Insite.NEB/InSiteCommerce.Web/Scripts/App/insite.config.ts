﻿module insite {
    "use strict";

    angular
        .module("insite")
        .config(config);

    config.$inject = ["$httpProvider", "$sceDelegateProvider"];
    function config($httpProvider: ng.IHttpProvider, $sceDelegateProvider): void {
        // TODO injecting coreService doesn't work so this is duplicated for now
        var baseUri = $("body").attr("data-webApiRoot");
        if (typeof (baseUri) !== "undefined" && baseUri !== "") {
            $sceDelegateProvider.resourceUrlWhitelist(["self", baseUri + "/**"]);
            $httpProvider.defaults.withCredentials = true;
        }

        $httpProvider.interceptors.push("insite.core.authenticationInterceptor");
        $httpProvider.interceptors.push("insite.core.httpErrorsInterceptor");
    }
}