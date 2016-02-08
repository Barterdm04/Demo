var insite;
(function (insite) {
    var jobquote;
    (function (jobquote) {
        "use strict";
        var MyJobQuotesController = (function () {
            function MyJobQuotesController($scope, jobQuoteService) {
                this.$scope = $scope;
                this.jobQuoteService = jobQuoteService;
                this.init();
            }
            MyJobQuotesController.prototype.init = function () {
                this.getJobs();
            };
            MyJobQuotesController.prototype.getJobs = function () {
                var _this = this;
                this.jobQuoteService.getJobQuotes().success(function (result) {
                    _this.jobs = result.jobQuotes;
                });
            };
            MyJobQuotesController.$inject = ["$scope", "jobQuoteService"];
            return MyJobQuotesController;
        })();
        jobquote.MyJobQuotesController = MyJobQuotesController;
        angular.module("insite").controller("MyJobQuotesController", MyJobQuotesController);
    })(jobquote = insite.jobquote || (insite.jobquote = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.myjobquotes.controller.js.map