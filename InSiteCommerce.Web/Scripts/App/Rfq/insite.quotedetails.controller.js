var insite;
(function (insite) {
    var rfq;
    (function (rfq) {
        "use strict";
        var QuoteDetailsController = (function () {
            function QuoteDetailsController($window, $rootScope, $scope, coreService, rfqService) {
                this.$window = $window;
                this.$rootScope = $rootScope;
                this.$scope = $scope;
                this.coreService = coreService;
                this.rfqService = rfqService;
                this.openLineNoteId = "";
                this.formValid = false;
                this.init();
            }
            QuoteDetailsController.prototype.init = function () {
                this.initEvents();
                this.quoteId = this.coreService.getQueryStringParameter("quoteId");
                this.getQuote();
                this.validateForm();
            };
            QuoteDetailsController.prototype.initEvents = function () {
                var _this = this;
                this.$scope.$on("cartLoaded", function (event, cart) {
                    _this.cart = cart;
                    _this.isCartEmpty = cart.lineCount === 0;
                });
            };
            QuoteDetailsController.prototype.getQuote = function () {
                var _this = this;
                this.rfqService.getQuote(this.quoteId).then(function (result) {
                    _this.quote = result;
                    if (_this.quote && _this.quote.calculationMethods && _this.quote.calculationMethods.length > 0) {
                        _this.calculationMethod = _this.quote.calculationMethods[0];
                        _this.changeCalculationMethod();
                    }
                });
            };
            QuoteDetailsController.prototype.acceptCheckout = function (url) {
                this.validateForm();
                if (!this.formValid) {
                    return;
                }
                if (!this.isCartEmpty) {
                    angular.element("#rfqPopupCartNotificationLink").trigger("click");
                }
                else {
                    this.continueCheckout(url);
                }
            };
            QuoteDetailsController.prototype.acceptJobQuote = function (url) {
                var _this = this;
                this.validateForm();
                if (!this.formValid) {
                    return;
                }
                if (!this.validateExpirationDateForm()) {
                    return;
                }
                var parameters = {
                    quoteId: this.quoteId,
                    status: "JobAccepted"
                };
                this.rfqService.patchQuote(this.quoteId, parameters).then(function () {
                    _this.$window.location.href = url;
                });
            };
            QuoteDetailsController.prototype.continueCheckout = function (url) {
                url += this.quoteId;
                this.$window.location.href = url;
            };
            QuoteDetailsController.prototype.declineQuote = function (returnUrl) {
                var _this = this;
                var quoteInfo = {
                    quoteId: this.quoteId,
                    status: "QuoteRejected"
                };
                this.rfqService.patchQuote(this.quoteId, quoteInfo).then(function () {
                    _this.$window.location.href = returnUrl;
                });
            };
            QuoteDetailsController.prototype.closeModal = function (selector) {
                this.coreService.closeModal(selector);
            };
            QuoteDetailsController.prototype.submitQuote = function (url) {
                var _this = this;
                if (!this.validateExpirationDateForm()) {
                    return;
                }
                var parameters = {
                    quoteId: this.quoteId,
                    status: "QuoteProposed"
                };
                this.rfqService.patchQuote(this.quoteId, parameters).then(function () {
                    _this.$window.location.href = url;
                });
            };
            QuoteDetailsController.prototype.applyQuote = function () {
                var _this = this;
                if (!this.validateQuoteCalculatorForm()) {
                    return;
                }
                var quoteInfo = {
                    quoteId: this.quoteId,
                    calculationMethod: this.calculationMethod.name,
                    percent: this.percent
                };
                this.rfqService.patchQuote(this.quoteId, quoteInfo).then(function (result) {
                    _this.quote.quoteLineCollection = result.quoteLineCollection;
                    _this.closeModal("#orderCalculator");
                });
            };
            QuoteDetailsController.prototype.openOrderCalculatorPopup = function () {
                this.coreService.displayModal(angular.element("#orderCalculator"));
            };
            QuoteDetailsController.prototype.changeCalculationMethod = function () {
                this.maximumDiscount = this.calculationMethod.maximumDiscount > 0 ? this.calculationMethod.maximumDiscount : false;
                this.minimumMargin = 0;
                for (var i = 0; i < this.quote.quoteLineCollection.length; i++) {
                    var minLineMargin = 100 - (this.quote.quoteLineCollection[i].pricingRfq.unitCost * 100 / this.quote.quoteLineCollection[i].pricingRfq.minimumPriceAllowed);
                    this.minimumMargin = minLineMargin > this.minimumMargin ? minLineMargin : this.minimumMargin;
                }
                this.minimumMargin = this.calculationMethod.minimumMargin > 0 ? this.minimumMargin > this.calculationMethod.minimumMargin ? this.minimumMargin : this.calculationMethod.minimumMargin : 0;
                $("#rfqApplyOrderQuoteForm input").data("rule-min", this.minimumMargin);
                $("#rfqApplyOrderQuoteForm input").data("rule-max", this.maximumDiscount > 0 ? (this.maximumDiscount * 1) : 'false');
                //this.resetValidationCalculatorForm();
                //this.validateQuoteCalculatorForm();
            };
            QuoteDetailsController.prototype.openOrderLineCalculatorPopup = function (quoteLine) {
                this.$rootScope.$broadcast("openLineCalculator", quoteLine);
            };
            QuoteDetailsController.prototype.validateForm = function () {
                var form = angular.element("#quoteDetailsForm");
                if (form && form.length !== 0) {
                    this.formValid = form.validate().form();
                }
            };
            QuoteDetailsController.prototype.validateExpirationDateForm = function () {
                var form = angular.element("#updateExpirationDate");
                if (form && form.length !== 0) {
                    return form.validate().form();
                }
                return true;
            };
            QuoteDetailsController.prototype.validateQuoteCalculatorForm = function () {
                var form = angular.element("#rfqApplyOrderQuoteForm");
                if (form && form.length !== 0) {
                    var validator = form.validate({
                        errorLabelContainer: "#rfqApplyOrderQuoteFormError"
                    });
                    validator.resetForm();
                    return form.validate().form();
                }
                return true;
            };
            QuoteDetailsController.prototype.resetValidationCalculatorForm = function () {
                var form = angular.element("#rfqApplyOrderQuoteForm");
                if (form && form.length !== 0) {
                    var validator = form.validate();
                    validator.resetForm();
                }
            };
            QuoteDetailsController.$inject = ["$window", "$rootScope", "$scope", "coreService", "rfqService"];
            return QuoteDetailsController;
        })();
        rfq.QuoteDetailsController = QuoteDetailsController;
        angular.module("insite").controller("QuoteDetailsController", QuoteDetailsController);
    })(rfq = insite.rfq || (insite.rfq = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.quotedetails.controller.js.map