var insite;
(function (insite) {
    var email;
    (function (email) {
        "use strict";
        var EmailService = (function () {
            function EmailService($http, $q, coreService) {
                this.$http = $http;
                this.$q = $q;
                this.coreService = coreService;
                this.serviceUri = this.coreService.getApiUri("/api/v1/email");
            }
            EmailService.prototype.tellAFriend = function (tellAFriendInfo) {
                var deferred = this.$q.defer();
                this.$http.post(this.serviceUri, tellAFriendInfo).success(function (result) {
                    return deferred.resolve(result);
                }).error(deferred.reject);
                return deferred.promise;
            };
            EmailService.$inject = ["$http", "$q", "coreService"];
            return EmailService;
        })();
        email.EmailService = EmailService;
        angular.module("insite").service("EmailService", EmailService);
    })(email = insite.email || (insite.email = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.email.service.js.map