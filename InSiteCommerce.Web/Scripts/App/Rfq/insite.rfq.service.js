/// <reference path="../_typelite/insite.models.d.ts" />
/// <reference path="../core/insite.core.service.ts"/>
var insite;
(function (insite) {
    var rfq;
    (function (rfq) {
        "use strict";
        var RfqService = (function () {
            function RfqService($http, $q, coreService) {
                this.$http = $http;
                this.$q = $q;
                this.coreService = coreService;
                this.rfqServiceUri = this.coreService.getApiUri("/api/v1/quotes/");
                this.rfqMessageUri = this.coreService.getApiUri("/api/v1/quotes/{quoteId}/messages/");
                this.rfqLineServiceUri = this.coreService.getApiUri("/api/v1/quotes/{quoteid}/quotelines/{quotelineid}/");
            }
            RfqService.prototype.getQuotes = function (parameters, pagination) {
                var query = "";
                if (this.expand) {
                    query += "?expand=" + this.expand + "&";
                }
                else {
                    query = "?";
                }
                if (pagination) {
                    query += "startpage=" + pagination.currentPage + "&pageSize=" + pagination.pageSize + "&";
                }
                query = query + this.coreService.parseParameters(parameters);
                var uri = this.rfqServiceUri + (query !== "?" ? query : "");
                return this.$http.get(uri);
            };
            RfqService.prototype.getQuote = function (quoteId) {
                var uri = this.rfqServiceUri + quoteId;
                var deferred = this.$q.defer();
                this.$http.get(uri).success(function (result) {
                    //this.rfqLineServiceUri = result.quoteLinesUri;
                    return deferred.resolve(result);
                }).error(deferred.reject);
                return deferred.promise;
            };
            RfqService.prototype.submitQuote = function (quoteInfo) {
                var jsQuoteInfo = angular.toJson(quoteInfo);
                var deferred = this.$q.defer();
                this.$http.post(this.rfqServiceUri, jsQuoteInfo).success(function (result) { return deferred.resolve(result); }).error(deferred.reject);
                return deferred.promise;
            };
            RfqService.prototype.patchQuote = function (quoteId, quoteInfo) {
                var uri = this.rfqServiceUri + quoteId;
                var jsQuoteInfo = angular.toJson(quoteInfo);
                var deferred = this.$q.defer();
                this.$http({ method: "PATCH", url: uri, data: jsQuoteInfo }).success(function (result) { return deferred.resolve(result); }).error(deferred.reject);
                return deferred.promise;
            };
            RfqService.prototype.patchLine = function (quoteId, quoteLine) {
                var jsQuoteLine = angular.toJson(quoteLine);
                var requestUrl = this.rfqLineServiceUri.replace("{quoteid}", quoteId).replace("{quotelineid}", quoteLine.id);
                var deferred = this.$q.defer();
                this.$http({ method: "PATCH", url: requestUrl, data: jsQuoteLine }).success(function (result) { return deferred.resolve(result); }).error(deferred.reject);
                return deferred.promise;
            };
            RfqService.prototype.submitRfqMessage = function (messageInfo) {
                var deferred = this.$q.defer();
                var url = this.rfqMessageUri.replace("{quoteId}", messageInfo.quoteId);
                this.$http.post(url, messageInfo).success(function (result) { return deferred.resolve(result); }).error(deferred.reject);
                return deferred.promise;
            };
            RfqService.$inject = ["$http", "$q", "coreService"];
            return RfqService;
        })();
        rfq.RfqService = RfqService;
        angular.module("insite").service("rfqService", RfqService);
    })(rfq = insite.rfq || (insite.rfq = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.rfq.service.js.map