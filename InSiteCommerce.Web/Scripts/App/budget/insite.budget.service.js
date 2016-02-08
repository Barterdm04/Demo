var insite;
(function (insite) {
    var budget;
    (function (_budget) {
        "use strict";
        var BudgetService = (function () {
            function BudgetService($http, $q, coreService) {
                this.$http = $http;
                this.$q = $q;
                this.coreService = coreService;
                this.budgetServiceUri = this.coreService.getApiUri("/api/v1/budgets/");
            }
            BudgetService.prototype.getReviews = function (userProfileId, shipToId, fiscalYear, fullGrid) {
                var deferred = this.$q.defer();
                this.$http({
                    url: this.budgetServiceUri + fiscalYear,
                    method: "GET",
                    params: {
                        userProfileId: userProfileId,
                        shipToId: shipToId,
                        fiscalYear: fiscalYear,
                        fullGrid: fullGrid
                    }
                }).success(function (result) {
                    return deferred.resolve(result);
                }).error(deferred.reject);
                return deferred.promise;
            };
            BudgetService.prototype.updateBudget = function (budget) {
                var deferred = this.$q.defer();
                this.$http({
                    method: "PATCH",
                    url: this.budgetServiceUri + budget.fiscalYear,
                    data: budget
                }).success(function (result) {
                    deferred.resolve(result);
                }).error(deferred.reject);
                return deferred.promise;
            };
            BudgetService.$inject = ["$http", "$q", "coreService"];
            return BudgetService;
        })();
        _budget.BudgetService = BudgetService;
        angular.module("insite").service("budgetService", BudgetService);
    })(budget = insite.budget || (insite.budget = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.budget.service.js.map