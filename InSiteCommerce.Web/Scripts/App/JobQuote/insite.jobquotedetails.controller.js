var insite;
(function (insite) {
    var jobquote;
    (function (jobquote) {
        "use strict";
        var JobQuoteDetailsController = (function () {
            function JobQuoteDetailsController(coreService, jobQuoteService) {
                this.coreService = coreService;
                this.jobQuoteService = jobQuoteService;
                this.init();
            }
            JobQuoteDetailsController.prototype.init = function () {
                this.jobQuoteId = this.coreService.getQueryStringParameter("jobQuoteId");
                this.getJob();
            };
            JobQuoteDetailsController.prototype.getJob = function () {
                var _this = this;
                this.jobQuoteService.getJobQuote(this.jobQuoteId).then(function (result) {
                    _this.job = result;
                });
            };
            JobQuoteDetailsController.prototype.quantityRemaining = function (jobQuoteLine) {
                return jobQuoteLine.qtyOrdered - jobQuoteLine.qtySold;
            };
            JobQuoteDetailsController.prototype.orderTotal = function () {
                var orderTotal = 0;
                if (this.job) {
                    $.each(this.job.jobQuoteLineCollection, function (name, value) {
                        orderTotal += value.pricing.actualPrice * value.qtyRequested;
                    });
                }
                return orderTotal;
            };
            JobQuoteDetailsController.prototype.generateOrder = function () {
                var _this = this;
                var form = angular.element("#jobQuoteDetails");
                if (form && form.length !== 0) {
                    if (form.validate().form()) {
                        var parameters = {
                            jobQuoteId: this.jobQuoteId,
                            jobQuoteLineCollection: jQuery.map(this.job.jobQuoteLineCollection, function (value) {
                                return { id: value.id, qtyOrdered: value.qtyRequested };
                            })
                        };
                        this.jobQuoteService.patchJobQuote(this.jobQuoteId, parameters).then(function (data) {
                            location.href = _this.coreService.getApiUri(_this.checkoutAddressUrl) + "?cartId=" + data.id;
                        });
                    }
                }
            };
            JobQuoteDetailsController.$inject = ["coreService", "jobQuoteService"];
            return JobQuoteDetailsController;
        })();
        jobquote.JobQuoteDetailsController = JobQuoteDetailsController;
        angular.module("insite").controller("JobQuoteDetailsController", JobQuoteDetailsController);
    })(jobquote = insite.jobquote || (insite.jobquote = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.jobquotedetails.controller.js.map