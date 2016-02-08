var insite;
(function (insite) {
    var budget;
    (function (_budget) {
        "use strict";
        var BudgetCalendarService = (function () {
            function BudgetCalendarService($http, $q, coreService) {
                this.$http = $http;
                this.$q = $q;
                this.coreService = coreService;
                this.budgetCalendarServiceUri = this.coreService.getApiUri("/api/v1/budgetcalendars/");
            }
            BudgetCalendarService.prototype.getBudgetCalendar = function (fiscalYear) {
                var deferred = this.$q.defer();
                this.$http({
                    url: this.budgetCalendarServiceUri + fiscalYear,
                    method: "GET"
                }).success(function (result) {
                    return deferred.resolve(result);
                }).error(deferred.reject);
                return deferred.promise;
            };
            BudgetCalendarService.prototype.updateBudgetCalendar = function (budget) {
                var deferred = this.$q.defer();
                this.$http({
                    method: "PATCH",
                    url: this.budgetCalendarServiceUri + budget.fiscalYear,
                    data: budget
                }).success(function (result) {
                    deferred.resolve(result);
                }).error(deferred.reject);
                return deferred.promise;
            };
            BudgetCalendarService.$inject = ["$http", "$q", "coreService"];
            return BudgetCalendarService;
        })();
        _budget.BudgetCalendarService = BudgetCalendarService;
        angular.module("insite").service("budgetCalendarService", BudgetCalendarService);
    })(budget = insite.budget || (insite.budget = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.budgetCalendar.service.js.map