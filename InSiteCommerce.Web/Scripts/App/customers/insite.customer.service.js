var insite;
(function (insite) {
    var customers;
    (function (customers) {
        "use strict";
        var CustomerService = (function () {
            function CustomerService($http, coreService) {
                this.$http = $http;
                this.coreService = coreService;
                this.serviceUri = this.coreService.getApiUri("/api/v1/billtos");
            }
            CustomerService.prototype.getBillTos = function (expand, accessToken) {
                var uri = this.serviceUri;
                if (expand) {
                    uri += "?expand=" + expand;
                }
                if (accessToken) {
                    return this.$http.get(uri, { headers: { "Authorization": "Bearer " + accessToken } });
                }
                return this.$http.get(uri);
            };
            CustomerService.prototype.getBillTo = function (expand) {
                var uri = this.serviceUri + "/current";
                if (expand) {
                    uri += "?expand=" + expand;
                }
                return this.$http.get(uri);
            };
            CustomerService.prototype.updateBillTo = function (billTo) {
                var patchBillTo = {};
                angular.extend(patchBillTo, billTo);
                delete patchBillTo.shipTos;
                delete patchBillTo.budgetEnforcementLevel;
                return this.$http({ method: "PATCH", url: patchBillTo.uri, data: patchBillTo });
            };
            CustomerService.prototype.updateEnforcementLevel = function (billTo) {
                return this.$http({ method: "PATCH", url: billTo.uri, data: billTo });
            };
            CustomerService.prototype.getShipTos = function (expand) {
                var uri = this.serviceUri + "/current/shiptos";
                if (expand) {
                    uri += "?expand=" + expand;
                }
                return this.$http.get(uri);
            };
            CustomerService.prototype.getShipTo = function (expand) {
                var uri = this.serviceUri + "/current/shiptos/current";
                if (expand) {
                    uri += "?expand=" + expand;
                }
                return this.$http.get(uri);
            };
            // Could return string or ShipToModel depending if you are adding or updating
            CustomerService.prototype.addOrUpdateShipTo = function (shipTo) {
                var patchShipTo = {};
                angular.extend(patchShipTo, shipTo);
                var operation = "PATCH";
                if (patchShipTo.isNew) {
                    operation = "POST";
                    patchShipTo.uri = this.serviceUri + "/current/shiptos";
                }
                return this.$http({ method: operation, url: patchShipTo.uri, data: patchShipTo });
            };
            CustomerService.$inject = ["$http", "coreService"];
            return CustomerService;
        })();
        customers.CustomerService = CustomerService;
        angular.module("insite").service("customerService", CustomerService);
    })(customers = insite.customers || (insite.customers = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.customer.service.js.map