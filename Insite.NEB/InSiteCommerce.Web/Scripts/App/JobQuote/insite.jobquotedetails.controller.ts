module insite.jobquote {
    "use strict";

    export class JobQuoteDetailsController {
        jobQuoteId: string;
        job: JobQuoteModel;
        calculationMethod: any;
        checkoutAddressUrl: string;

        static $inject = ["coreService", "jobQuoteService"];
        constructor(protected coreService: core.ICoreService,
            protected jobQuoteService: jobquote.IJobQuoteService) {

            this.init();
        }

        init() {
            this.jobQuoteId = this.coreService.getQueryStringParameter("jobQuoteId");
            this.getJob();
        }

        getJob(): void {
            this.jobQuoteService.getJobQuote(this.jobQuoteId).then((result) => {
                this.job = result;
            });
        }

        quantityRemaining(jobQuoteLine: JobQuoteLineModel): number {
            return jobQuoteLine.qtyOrdered - jobQuoteLine.qtySold;
        }

        orderTotal(): number {
            var orderTotal = 0;
            if (this.job) {
                $.each(this.job.jobQuoteLineCollection,(name: number, value: JobQuoteLineModel) => {
                    orderTotal += value.pricing.actualPrice * value.qtyRequested;
                });
            }
            return orderTotal;
        }

        generateOrder() {
            var form = angular.element("#jobQuoteDetails");
            if (form && form.length !== 0) {
                if (form.validate().form()) {
                    var parameters = {
                        jobQuoteId: this.jobQuoteId,
                        jobQuoteLineCollection: jQuery.map(this.job.jobQuoteLineCollection, function (value) {
                            return <CartLineModel>{ id: value.id, qtyOrdered: value.qtyRequested };
                        })
                    };

                    this.jobQuoteService.patchJobQuote(this.jobQuoteId, parameters).then((data) => {
                        location.href = this.coreService.getApiUri(this.checkoutAddressUrl) + "?cartId=" + data.id;
                    });
                }
            }
        }
    }

    angular
        .module("insite")
        .controller("JobQuoteDetailsController", JobQuoteDetailsController);
}