/// <reference path="../_typelite/insite.models.d.ts" />
/// <reference path="../core/insite.core.service.ts"/>
var insite;
(function (insite) {
    var jobquote;
    (function (jobquote) {
        "use strict";
        var JobQuoteService = (function () {
            function JobQuoteService($http, $q, coreService) {
                this.$http = $http;
                this.$q = $q;
                this.coreService = coreService;
                this.jobQuoteServiceUri = this.coreService.getApiUri("/api/v1/jobquotes/");
            }
            JobQuoteService.prototype.getJobQuotes = function () {
                return this.$http.get(this.jobQuoteServiceUri);
            };
            JobQuoteService.prototype.getJobQuote = function (jobQuoteId) {
                var uri = this.jobQuoteServiceUri + jobQuoteId;
                var deferred = this.$q.defer();
                this.$http.get(uri).success(function (result) {
                    return deferred.resolve(result);
                }).error(deferred.reject);
                return deferred.promise;
            };
            JobQuoteService.prototype.patchJobQuote = function (jobQuoteId, quoteInfo) {
                var uri = this.jobQuoteServiceUri + jobQuoteId;
                var jsQuoteInfo = angular.toJson(quoteInfo);
                var deferred = this.$q.defer();
                this.$http({ method: "PATCH", url: uri, data: jsQuoteInfo }).success(function (result) { return deferred.resolve(result); }).error(deferred.reject);
                return deferred.promise;
            };
            JobQuoteService.$inject = ["$http", "$q", "coreService"];
            return JobQuoteService;
        })();
        jobquote.JobQuoteService = JobQuoteService;
        angular.module("insite").service("jobQuoteService", JobQuoteService);
    })(jobquote = insite.jobquote || (insite.jobquote = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.jobquote.service.js.map