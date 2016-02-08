var insite;
(function (insite) {
    var websites;
    (function (websites) {
        "use strict";
        var WebsiteService = (function () {
            function WebsiteService($http, coreService, sessionService) {
                this.$http = $http;
                this.coreService = coreService;
                this.sessionService = sessionService;
                this.serviceUri = this.coreService.getApiUri("/api/v1/websites/current");
                this.init();
            }
            WebsiteService.prototype.init = function () {
                var context = this.sessionService.getContext();
                if (context) {
                    this.languageId = context.languageId;
                }
                else {
                    // if called before context is set, just set to empty, this is only used to vary the cache by language and not server side
                    this.languageId = "00000000-0000-0000-0000-000000000000";
                }
            };
            WebsiteService.prototype.getWebsite = function (expand) {
                // language id is added to querystring to make caching vary by language
                var uri = this.serviceUri + "?languageId=" + this.languageId;
                if (expand) {
                    uri += "&expand=" + expand;
                }
                return this.$http.get(uri);
            };
            WebsiteService.prototype.getCountries = function (expand) {
                // language id is added to querystring to make caching vary by language
                var uri = this.serviceUri + "/countries" + "?languageId=" + this.languageId;
                if (expand) {
                    uri += "&expand=" + expand;
                }
                return this.$http.get(uri);
            };
            WebsiteService.$inject = ["$http", "coreService", "sessionService"];
            return WebsiteService;
        })();
        websites.WebsiteService = WebsiteService;
        angular.module("insite").service("websiteService", WebsiteService);
    })(websites = insite.websites || (insite.websites = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.website.service.js.map