/// <reference path="../../typings/angularjs/angular.d.ts" />
/// <reference path="insite.localstorage.factory.ts" />
var insite;
(function (insite) {
    var core;
    (function (core) {
        "use strict";
        var WindowSessionStorage = (function () {
            function WindowSessionStorage($window) {
                this.$window = $window;
            }
            WindowSessionStorage.prototype.set = function (key, value) {
                this.$window.sessionStorage[key] = value;
            };
            WindowSessionStorage.prototype.get = function (key, defaultValue) {
                return this.$window.sessionStorage[key] || defaultValue;
            };
            WindowSessionStorage.prototype.setObject = function (key, value) {
                this.$window.sessionStorage[key] = JSON.stringify(value);
            };
            WindowSessionStorage.prototype.getObject = function (key) {
                return JSON.parse(this.$window.sessionStorage[key] || "{}");
            };
            WindowSessionStorage.prototype.remove = function (key) {
                delete this.$window.sessionStorage[key];
            };
            WindowSessionStorage.prototype.removeAll = function () {
                this.$window.sessionStorage.clear();
            };
            WindowSessionStorage.prototype.count = function () {
                return this.$window.sessionStorage.length;
            };
            return WindowSessionStorage;
        })();
        core.WindowSessionStorage = WindowSessionStorage;
        factory.$inject = ["$window"];
        function factory($window) {
            return new WindowSessionStorage($window);
        }
        angular.module("insite").factory("$sessionStorage", factory);
    })(core = insite.core || (insite.core = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.sessionstorage.factory.js.map