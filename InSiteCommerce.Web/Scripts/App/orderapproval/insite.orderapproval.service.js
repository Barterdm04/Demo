var insite;
(function (insite) {
    var orderapproval;
    (function (orderapproval) {
        "use strict";
        var OrderApprovalService = (function () {
            function OrderApprovalService($http, $rootScope, $q, coreService) {
                this.$http = $http;
                this.$rootScope = $rootScope;
                this.$q = $q;
                this.coreService = coreService;
                this.serviceUri = this.coreService.getApiUri("/api/v1/orderapprovals");
            }
            OrderApprovalService.prototype.getCarts = function (filter, pagination) {
                var params = {};
                if (filter) {
                    for (var property in filter) {
                        if (filter.hasOwnProperty(property) && filter[property]) {
                            params[property] = filter[property];
                        }
                    }
                }
                if (pagination) {
                    params["page"] = pagination.currentPage;
                    params["pageSize"] = pagination.pageSize;
                }
                return this.$http({
                    url: this.serviceUri,
                    method: "GET",
                    params: params
                });
            };
            OrderApprovalService.prototype.getCart = function (cartId) {
                var uri = this.serviceUri + "/" + cartId;
                var deferred = this.$q.defer();
                this.$http.get(uri).success(function (cart) {
                    deferred.resolve(cart);
                }).error(deferred.reject);
                return deferred.promise;
            };
            OrderApprovalService.$inject = ["$http", "$rootScope", "$q", "coreService"];
            return OrderApprovalService;
        })();
        orderapproval.OrderApprovalService = OrderApprovalService;
        angular.module("insite").service("orderApprovalService", OrderApprovalService);
    })(orderapproval = insite.orderapproval || (insite.orderapproval = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.orderapproval.service.js.map