var insite;
(function (insite) {
    var order;
    (function (order) {
        "use strict";
        var OrderService = (function () {
            function OrderService($http, coreService) {
                this.$http = $http;
                this.coreService = coreService;
                this.serviceUri = this.coreService.getApiUri("/api/v1/orders");
            }
            OrderService.prototype.getOrders = function (filter, pagination) {
                var uri = this.serviceUri;
                if (filter) {
                    uri += "?";
                    for (var property in filter) {
                        if (filter[property]) {
                            uri += property + "=" + filter[property] + "&";
                        }
                    }
                }
                if (pagination) {
                    uri += "currentPage=" + pagination.currentPage + "&pageSize=" + pagination.pageSize;
                }
                uri = uri.replace(/&$/, "");
                return this.$http.get(uri, { bypassErrorInterceptor: true });
            };
            OrderService.prototype.getOrder = function (orderId, expand) {
                var uri = this.serviceUri + "/" + orderId;
                if (expand) {
                    uri += "?expand=" + expand;
                }
                return this.$http.get(uri, { bypassErrorInterceptor: true });
            };
            OrderService.prototype.updateOrder = function (orderId, orderModel) {
                var uri = this.serviceUri + "/" + orderId;
                var jsUpdateInfo = angular.toJson(orderModel);
                return this.$http({ method: "PATCH", url: uri, data: jsUpdateInfo, bypassErrorInterceptor: true });
            };
            OrderService.prototype.addRma = function (rmaModel) {
                return this.$http.post(this.serviceUri + "/" + rmaModel.orderNumber + "/returns", rmaModel);
            };
            OrderService.$inject = ["$http", "coreService"];
            return OrderService;
        })();
        order.OrderService = OrderService;
        angular.module("insite").service("orderService", OrderService);
    })(order = insite.order || (insite.order = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.order.service.js.map