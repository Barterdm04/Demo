var insite;
(function (insite) {
    var core;
    (function (core) {
        "use strict";
        var SettingsController = (function () {
            function SettingsController(coreService, sessionService) {
                this.coreService = coreService;
                this.sessionService = sessionService;
                this.init();
            }
            SettingsController.prototype.init = function () {
                var _this = this;
                this.sessionService.getSession();
                this.coreService.getSettings(this.sessionService.isAuthenticated()).success(function (result) {
                    _this.settings = result.settingsCollection;
                    _this.productSettings = result.settingsCollection.productSettings;
                    _this.accoutSettings = result.settingsCollection.accountSettings;
                    _this.wishListSettings = result.settingsCollection.wishListSettings;
                    _this.coreService.broadcastSettings(_this.settings);
                });
            };
            SettingsController.$inject = ["coreService", "sessionService"];
            return SettingsController;
        })();
        core.SettingsController = SettingsController;
        angular.module("insite").controller("SettingsController", SettingsController);
    })(core = insite.core || (insite.core = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.settings.controller.js.map