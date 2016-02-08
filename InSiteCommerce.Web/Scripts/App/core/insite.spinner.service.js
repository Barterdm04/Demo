var insite;
(function (insite) {
    var core;
    (function (core) {
        "use strict";
        var SpinnerService = (function () {
            function SpinnerService() {
                this.spinners = {};
            }
            SpinnerService.prototype.register = function (data) {
                if (!data.hasOwnProperty("name")) {
                    throw new Error("Spinner must specify a name when registering with the spinner service.");
                }
                if (this.spinners.hasOwnProperty(data.name)) {
                    throw new Error("A spinner with the name '" + data.name + "' has already been registered.");
                }
                this.spinners[data.name] = data;
            };
            SpinnerService.prototype.show = function (name, infinite) {
                if (name === void 0) { name = "mainLayout"; }
                if (infinite === void 0) { infinite = false; }
                var spinner = this.spinners[name];
                if (!spinner) {
                    throw new Error("No spinner named '" + name + "' is registered.");
                }
                spinner.infinite = infinite;
                spinner.show();
            };
            SpinnerService.prototype.hide = function (name) {
                if (name === void 0) { name = "mainLayout"; }
                var spinner = this.spinners[name];
                if (!spinner) {
                    throw new Error("No spinner named '" + name + "' is registered.");
                }
                spinner.hide();
            };
            SpinnerService.prototype.showGroup = function (group) {
                var groupExists = false;
                for (var name in this.spinners) {
                    var spinner = this.spinners[name];
                    if (spinner.group === group) {
                        spinner.show();
                        groupExists = true;
                    }
                }
                if (!groupExists) {
                    throw new Error("No spinners found with group '" + group + "'.");
                }
            };
            SpinnerService.prototype.hideGroup = function (group) {
                var groupExists = false;
                for (var name in this.spinners) {
                    var spinner = this.spinners[name];
                    if (spinner.group === group) {
                        spinner.hide();
                        groupExists = true;
                    }
                }
                if (!groupExists) {
                    throw new Error("No spinners found with group '" + group + "'.");
                }
            };
            SpinnerService.prototype.showAll = function () {
                for (var name in this.spinners) {
                    this.spinners[name].show();
                }
            };
            SpinnerService.prototype.hideAll = function () {
                for (var name in this.spinners) {
                    if (!this.spinners[name].infinite) {
                        this.spinners[name].hide();
                    }
                }
            };
            return SpinnerService;
        })();
        core.SpinnerService = SpinnerService;
        angular.module("insite").service("spinnerService", SpinnerService);
    })(core = insite.core || (insite.core = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.spinner.service.js.map