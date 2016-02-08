var insite;
(function (insite) {
    var rfq;
    (function (rfq) {
        "use strict";
        var QuoteHeaderDetailsController = (function () {
            function QuoteHeaderDetailsController(rfqService) {
                this.rfqService = rfqService;
                //this.quoteId = this.quote.id;
            }
            QuoteHeaderDetailsController.prototype.updateExpirationDate = function () {
                if (!this.validateExpirationDateForm()) {
                    return;
                }
                //var selectedDate = angular.element("#expirationDate").val();
                var quoteInfo = {
                    quoteId: this.quote.id,
                    expirationDate: this.quote.expirationDate
                };
                this.rfqService.patchQuote(this.quote.id, quoteInfo);
            };
            QuoteHeaderDetailsController.prototype.validateExpirationDateForm = function () {
                var form = angular.element("#updateExpirationDate");
                if (form && form.length !== 0) {
                    return form.validate().form();
                }
                return true;
            };
            QuoteHeaderDetailsController.$inject = ["rfqService"];
            return QuoteHeaderDetailsController;
        })();
        rfq.QuoteHeaderDetailsController = QuoteHeaderDetailsController;
        angular.module("insite").controller("QuoteHeaderDetailsController", QuoteHeaderDetailsController);
    })(rfq = insite.rfq || (insite.rfq = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.quoteheaderdetails.controller.js.map