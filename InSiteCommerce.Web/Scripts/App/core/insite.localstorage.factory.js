var insite;
(function (insite) {
    var core;
    (function (core) {
        "use strict";
        var WindowLocalStorage = (function () {
            function WindowLocalStorage($window) {
                this.$window = $window;
            }
            WindowLocalStorage.prototype.set = function (key, value) {
                this.$window.localStorage.setItem(key, value);
            };
            WindowLocalStorage.prototype.get = function (key, defaultValue) {
                return this.$window.localStorage.getItem(key) || defaultValue;
            };
            WindowLocalStorage.prototype.setObject = function (key, value) {
                this.$window.localStorage.setItem(key, JSON.stringify(value));
            };
            WindowLocalStorage.prototype.getObject = function (key, defaultValue) {
                var val = this.$window.localStorage.getItem(key);
                if (val)
                    return JSON.parse(val);
                return defaultValue;
            };
            WindowLocalStorage.prototype.remove = function (key) {
                delete this.$window.localStorage[key];
            };
            WindowLocalStorage.prototype.removeAll = function () {
                this.$window.localStorage.clear();
            };
            WindowLocalStorage.prototype.count = function () {
                return this.$window.localStorage.length;
            };
            return WindowLocalStorage;
        })();
        core.WindowLocalStorage = WindowLocalStorage;
        factory.$inject = ["$window"];
        function factory($window) {
            return new WindowLocalStorage($window);
        }
        angular.module("insite").factory("$localStorage", factory);
    })(core = insite.core || (insite.core = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.localstorage.factory.js.map