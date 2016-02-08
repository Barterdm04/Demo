var insite;
(function (insite) {
    var useradministration;
    (function (useradministration) {
        "use strict";
        var UserService = (function () {
            function UserService($http, coreService) {
                this.$http = $http;
                this.coreService = coreService;
                this.serviceUri = this.coreService.getApiUri("/api/v1/accounts");
            }
            UserService.prototype.getUserShipToCollection = function (userProfileId, pagination, sort) {
                var params = {
                    Sort: sort
                };
                if (pagination) {
                    params.StartPage = pagination.currentPage;
                    params.PageSize = pagination.pageSize;
                }
                return this.$http({
                    url: this.coreService.getApiUri(this.serviceUri + "/" + userProfileId + "/shiptos"),
                    method: "GET",
                    params: params
                });
            };
            UserService.prototype.applyUserShipToCollection = function (userProfileId, shipToCollection) {
                return this.$http({
                    url: this.coreService.getApiUri(this.serviceUri + "/" + userProfileId + "/shiptos"),
                    method: "PATCH",
                    data: {
                        UserShipToCollection: shipToCollection
                    }
                });
            };
            UserService.$inject = ["$http", "coreService"];
            return UserService;
        })();
        useradministration.UserService = UserService;
        angular.module("insite").service("userService", UserService);
    })(useradministration = insite.useradministration || (insite.useradministration = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.user.service.js.map