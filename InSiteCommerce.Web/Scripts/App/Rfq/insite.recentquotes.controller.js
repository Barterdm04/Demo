var insite;
(function (insite) {
    var rfq;
    (function (rfq) {
        "use strict";
        var RecentQuotesController = (function () {
            function RecentQuotesController($scope, rfqService) {
                this.$scope = $scope;
                this.rfqService = rfqService;
                this.init();
            }
            RecentQuotesController.prototype.init = function () {
                var _this = this;
                this.$scope.$on("settingsLoaded", function (event, data) {
                    _this.quoteSettings = data.quoteSettings;
                });
                this.$scope.$on("cartLoaded", function (event, cart) {
                    if (cart.canRequestQuote) {
                        _this.getQuotes();
                    }
                });
            };
            RecentQuotesController.prototype.getQuotes = function () {
                var _this = this;
                this.parameters = {};
                this.parameters.pageSize = 5;
                this.rfqService.getQuotes(this.parameters, null).success(function (result) {
                    _this.quotes = result.quotes;
                });
            };
            RecentQuotesController.$inject = ["$scope", "rfqService"];
            return RecentQuotesController;
        })();
        rfq.RecentQuotesController = RecentQuotesController;
        angular.module("insite").controller("RecentQuotesController", RecentQuotesController);
    })(rfq = insite.rfq || (insite.rfq = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.recentquotes.controller.js.map