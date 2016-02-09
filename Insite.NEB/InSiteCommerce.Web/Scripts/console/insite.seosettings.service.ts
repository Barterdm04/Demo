module insite.console {
    "use strict";

    export interface ISeoSettingsService {
        getSeoSettings(websiteId: System.Guid): ng.IHttpPromise<any>;
        updateSeoSettings(websiteId: System.Guid, seoSettings: any): ng.IHttpPromise<any>;
    }

    export class SeoSettingsService implements ISeoSettingsService {
        serviceUri = "/console/seosettings/";

        static $inject = ["$http"];

        constructor(
            protected $http: ng.IHttpService) {
        }

        getSeoSettings(websiteId: System.Guid): ng.IHttpPromise<any> {
            return this.$http.get(this.serviceUri + websiteId + "?rand=" + Math.floor(Math.random() * 10000000));
        }

        updateSeoSettings(websiteId: System.Guid, seoSettings: any): ng.IHttpPromise<any> {
            return this.$http.put(this.serviceUri + websiteId, seoSettings);
        }
    }

    angular
        .module("insite.console")
        .service("seoSettingsService", SeoSettingsService);
}