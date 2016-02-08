var insite;
(function (insite) {
    var layout;
    (function (layout) {
        "use strict";
        var TopNavController = (function () {
            function TopNavController($scope, $window, accountService, sessionService, websiteService) {
                this.$scope = $scope;
                this.$window = $window;
                this.accountService = accountService;
                this.sessionService = sessionService;
                this.websiteService = websiteService;
                this.init();
            }
            TopNavController.prototype.init = function () {
                var _this = this;
                this.$scope.$on("sessionLoaded", function (event, session) {
                    _this.session = session;
                    // This is cached client side (5 minutes by default)
                    _this.websiteService.getWebsite("languages,currencies").success(function (website) {
                        _this.languages = website.languages.languages.filter(function (l) { return l.isLive; });
                        _this.currencies = website.currencies.currencies;
                        _this.checkCurrentPageForMessages();
                        angular.forEach(_this.languages, function (language) {
                            if (language.id === _this.session.language.id) {
                                _this.session.language = language;
                            }
                        });
                        angular.forEach(_this.currencies, function (currency) {
                            if (currency.id === _this.session.currency.id) {
                                _this.session.currency = currency;
                            }
                        });
                    });
                });
            };
            TopNavController.prototype.setLanguage = function (languageId) {
                var _this = this;
                languageId = languageId ? languageId : this.session.language.id;
                this.sessionService.setLanguage(languageId).then(function () {
                    _this.$window.location.reload();
                });
            };
            TopNavController.prototype.setCurrency = function (currencyId) {
                var _this = this;
                currencyId = currencyId ? currencyId : this.session.currency.id;
                this.sessionService.setCurrency(currencyId).then(function () {
                    _this.$window.location.reload();
                });
            };
            TopNavController.prototype.signOut = function (returnUrl) {
                var _this = this;
                this.sessionService.signOut().then(function () {
                    _this.$window.location.href = returnUrl;
                });
            };
            TopNavController.prototype.checkCurrentPageForMessages = function () {
                var currentUrl = window.location.href.toLowerCase();
                var index = currentUrl.indexOf(this.dashboardUrl.toLowerCase());
                var show = index === -1 || (index + this.dashboardUrl.length !== currentUrl.length);
                if (!show && this.session.hasRfqUpdates) {
                    this.closeQuoteInformation();
                }
            };
            TopNavController.prototype.isAuthenticated = function () {
                return this.session && this.session.isAuthenticated && this.sessionService.isAuthenticated();
            };
            TopNavController.prototype.notAuthenticated = function () {
                return (this.session && !this.session.isAuthenticated) || !this.sessionService.isAuthenticated();
            };
            TopNavController.prototype.closeQuoteInformation = function () {
                this.session.hasRfqUpdates = false;
                var session = {};
                session.hasRfqUpdates = false;
                this.sessionService.updateSession(session);
            };
            TopNavController.$inject = [
                "$scope",
                "$window",
                "accountService",
                "sessionService",
                "websiteService"
            ];
            return TopNavController;
        })();
        layout.TopNavController = TopNavController;
        angular.module("insite").controller("TopNavController", TopNavController);
    })(layout = insite.layout || (insite.layout = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.topnav.controller.js.map