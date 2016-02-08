var insite;
(function (insite) {
    var rfq;
    (function (rfq) {
        "use strict";
        var QuoteConfirmationController = (function () {
            function QuoteConfirmationController(rfqService, coreService) {
                this.rfqService = rfqService;
                this.coreService = coreService;
                this.init();
            }
            QuoteConfirmationController.prototype.init = function () {
                this.rfqService.expand = "billTo";
                this.confirmedOrderId = this.coreService.getQueryStringParameter("cartid");
                this.getQuote();
            };
            QuoteConfirmationController.prototype.getQuote = function () {
                var _this = this;
                this.rfqService.getQuote(this.confirmedOrderId).then(function (quote) {
                    _this.quote = quote;
                    _this.quote.cartLines = _this.quote.quoteLineCollection;
                });
            };
            QuoteConfirmationController.$inject = ["rfqService", "coreService"];
            return QuoteConfirmationController;
        })();
        rfq.QuoteConfirmationController = QuoteConfirmationController;
        angular.module("insite").controller("QuoteConfirmationController", QuoteConfirmationController);
    })(rfq = insite.rfq || (insite.rfq = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.quoteconfirmation.controller.js.map