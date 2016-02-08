var insite;
(function (insite) {
    var console;
    (function (console) {
        "use strict";
        var SeoSettingsService = (function () {
            function SeoSettingsService($http) {
                this.$http = $http;
                this.serviceUri = "/console/seosettings/";
            }
            SeoSettingsService.prototype.getSeoSettings = function (websiteId) {
                return this.$http.get(this.serviceUri + websiteId + "?rand=" + Math.floor(Math.random() * 10000000));
            };
            SeoSettingsService.prototype.updateSeoSettings = function (websiteId, seoSettings) {
                return this.$http.put(this.serviceUri + websiteId, seoSettings);
            };
            SeoSettingsService.$inject = ["$http"];
            return SeoSettingsService;
        })();
        console.SeoSettingsService = SeoSettingsService;
        angular.module("insite.console").service("seoSettingsService", SeoSettingsService);
    })(console = insite.console || (insite.console = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.seosettings.service.js.map