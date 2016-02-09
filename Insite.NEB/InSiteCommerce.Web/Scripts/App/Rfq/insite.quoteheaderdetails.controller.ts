module insite.rfq {
    "use strict";

    export class QuoteHeaderDetailsController {
        quoteId: string;
        quote: QuoteModel;

        static $inject = ["rfqService"];
        constructor(protected rfqService: rfq.IRfqService) {
            //this.quoteId = this.quote.id;
        }

        updateExpirationDate(): void {
            if (!this.validateExpirationDateForm()) {
                return;
            }
            //var selectedDate = angular.element("#expirationDate").val();
            var quoteInfo = {
                quoteId: this.quote.id,
                expirationDate: this.quote.expirationDate
            };

            this.rfqService.patchQuote(this.quote.id, quoteInfo);
        }

        protected validateExpirationDateForm() {
            var form = angular.element("#updateExpirationDate");
            if (form && form.length !== 0) {
                return form.validate().form();
            }
            return true;
        }

    }

    angular
        .module("insite")
        .controller("QuoteHeaderDetailsController", QuoteHeaderDetailsController);
}