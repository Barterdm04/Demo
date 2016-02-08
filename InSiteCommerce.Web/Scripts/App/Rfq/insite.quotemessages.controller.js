var insite;
(function (insite) {
    var quoteMessages;
    (function (quoteMessages) {
        "use strict";
        var QuoteMessagesController = (function () {
            function QuoteMessagesController($scope, coreService, rfqService) {
                this.$scope = $scope;
                this.coreService = coreService;
                this.rfqService = rfqService;
                this.init();
            }
            QuoteMessagesController.prototype.init = function () {
                this.quoteId = this.coreService.getQueryStringParameter("quoteId");
            };
            QuoteMessagesController.prototype.sendMessage = function () {
                var _this = this;
                var parameter = {
                    quoteId: this.quoteId,
                    message: this.rfqMessage
                };
                this.rfqService.submitRfqMessage(parameter).then(function (result) {
                    _this.$scope.messageCollection.push(result);
                    _this.$scope.$broadcast("messagesloaded");
                    _this.rfqMessage = "";
                });
            };
            QuoteMessagesController.$inject = ["$scope", "coreService", "rfqService"];
            return QuoteMessagesController;
        })();
        quoteMessages.QuoteMessagesController = QuoteMessagesController;
        angular.module("insite").controller("QuoteMessagesController", QuoteMessagesController);
    })(quoteMessages = insite.quoteMessages || (insite.quoteMessages = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.quotemessages.controller.js.map