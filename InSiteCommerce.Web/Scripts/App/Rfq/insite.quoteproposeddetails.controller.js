var insite;
(function (insite) {
    var rfq;
    (function (rfq) {
        "use strict";
        var QuoteProposedDetailsController = (function () {
            function QuoteProposedDetailsController($window, $scope, coreService, rfqService) {
                this.$window = $window;
                this.$scope = $scope;
                this.coreService = coreService;
                this.rfqService = rfqService;
                this.openLineNoteId = "";
            }
            QuoteProposedDetailsController.prototype.updateLine = function (quoteLine, refresh) {
                var _this = this;
                this.rfqService.patchLine(this.quote.id, quoteLine).then(function (result) {
                    if (refresh) {
                        _this.updateSubTotal();
                        quoteLine.pricing.actualPrice = result.pricing.actualPrice;
                        quoteLine.pricing.actualPriceDisplay = result.pricing.actualPriceDisplay;
                        quoteLine.pricing.extendedActualPrice = result.pricing.extendedActualPrice;
                        quoteLine.pricing.extendedActualPriceDisplay = result.pricing.extendedActualPriceDisplay;
                    }
                });
            };
            QuoteProposedDetailsController.prototype.updateSubTotal = function () {
                var _this = this;
                this.rfqService.getQuote(this.quote.id).then(function (result) {
                    _this.quote.orderSubTotal = result.orderSubTotal;
                    _this.quote.orderSubTotalDisplay = result.orderSubTotalDisplay;
                    _this.quote.quoteLineCollection = result.quoteLineCollection;
                });
            };
            QuoteProposedDetailsController.prototype.quantityBlur = function (event, quoteLine) {
                this.validateForm();
                var valid = $(event.target).valid();
                if (!valid) {
                    this.formValid = false;
                    return;
                }
                this.updateLine(quoteLine, true);
            };
            QuoteProposedDetailsController.prototype.quantityKeyPress = function (keyEvent, quoteLine) {
                this.validateForm();
                if (keyEvent.which === 13) {
                    var valid = $(keyEvent.target).valid();
                    if (!valid) {
                        this.formValid = false;
                        return;
                    }
                    this.updateLine(quoteLine, true);
                }
            };
            QuoteProposedDetailsController.prototype.notesKeyPress = function (keyEvent, quoteLine) {
                if (keyEvent.which === 13) {
                    this.updateLine(quoteLine, false);
                }
            };
            QuoteProposedDetailsController.prototype.notePanelClicked = function (lineId) {
                if (this.openLineNoteId === lineId)
                    this.openLineNoteId = "";
                else
                    this.openLineNoteId = lineId;
            };
            QuoteProposedDetailsController.prototype.validateForm = function () {
                var form = angular.element("#quoteDetailsForm");
                if (form && form.length !== 0) {
                    this.formValid = form.validate().form();
                }
            };
            QuoteProposedDetailsController.$inject = ["$window", "$scope", "coreService", "rfqService"];
            return QuoteProposedDetailsController;
        })();
        rfq.QuoteProposedDetailsController = QuoteProposedDetailsController;
        angular.module("insite").controller("QuoteProposedDetailsController", QuoteProposedDetailsController);
    })(rfq = insite.rfq || (insite.rfq = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.quoteproposeddetails.controller.js.map