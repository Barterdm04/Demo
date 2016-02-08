var insite;
(function (insite) {
    var core;
    (function (core) {
        "use strict";
        var CoreService = (function () {
            function CoreService($rootScope, $http, $q, $filter, $window) {
                this.$rootScope = $rootScope;
                this.$http = $http;
                this.$q = $q;
                this.$filter = $filter;
                this.$window = $window;
                this.webApiRoot = null;
                this.settingsUri = this.getApiUri("/api/v1/settings");
            }
            CoreService.prototype.getSettings = function (isAuthenticated) {
                if (isAuthenticated === void 0) { isAuthenticated = false; }
                return this.$http.get(this.settingsUri + "?auth=" + isAuthenticated.toString());
            };
            // turns an object into a "&" separated list of url key values
            CoreService.prototype.parseParameters = function (parameters) {
                var query = "";
                for (var property in parameters) {
                    if (parameters.hasOwnProperty(property)) {
                        if (parameters[property] && parameters[property].constructor === Array) {
                            angular.forEach(parameters[property], function (value) {
                                query += property + "=" + value + "&";
                            });
                        }
                        else if (parameters[property]) {
                            query += property + "=" + parameters[property] + "&";
                        }
                    }
                }
                return query;
            };
            CoreService.prototype.getApiUri = function (uri) {
                if (this.webApiRoot === null) {
                    this.webApiRoot = $("body").attr("data-webApiRoot");
                    if (typeof (this.webApiRoot) === "undefined") {
                        this.webApiRoot = "";
                    }
                }
                return this.webApiRoot + uri;
            };
            //example: coreService.getObjectByPropertyValue(section.options, { selected: "true" })        
            CoreService.prototype.getObjectByPropertyValue = function (values, expr) {
                var filteredFields = this.$filter("filter")(values, expr);
                return filteredFields ? filteredFields[0] : null;
            };
            CoreService.prototype.openWishListPopup = function (products, popupId) {
                // send the product to the addWishlistPopup directive controller
                this.$rootScope.$broadcast("addToWishList", { products: products, popupId: popupId });
            };
            CoreService.prototype.broadcastSettings = function (settings) {
                // send the settings to the pages that need it 
                this.$rootScope.$broadcast("settingsLoaded", settings);
            };
            CoreService.prototype.queryString = function (a) {
                if (!a)
                    return {};
                var b = {};
                for (var i = 0; i < a.length; ++i) {
                    var p = a[i].split("=");
                    if (p.length != 2)
                        continue;
                    b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
                }
                return b;
            };
            CoreService.prototype.getQueryStringParameter = function (key, ignoreCase) {
                key = key.toLowerCase().replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var regex = new RegExp("[\\?&]" + key + "=([^&#]*)", ignoreCase ? "i" : undefined), results = regex.exec(location.search.toLowerCase());
                return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
            };
            CoreService.prototype.getQueryStringCollection = function () {
                return this.queryString(this.$window.location.search.substr(1).split("&"));
            };
            CoreService.prototype.closeModal = function (selector) {
                var modal = angular.element(selector);
                modal.foundation("reveal", "close");
            };
            CoreService.prototype.displayModal = function (html) {
                var $html = $(html);
                if ($html.parents("body").length === 0) {
                    $html.appendTo($("body"));
                }
                $html.foundation("reveal", "open");
                $(document).on("closed", $html, function () {
                    // TODO only remove if we added it?
                    //$html.remove();
                    // TODO
                    //if (typeof onClose === "function") {
                    //    onClose();
                    //}
                });
            };
            CoreService.prototype.refreshUiBindings = function () {
                $(document).foundation({ bindings: "events" });
            };
            CoreService.$inject = ["$rootScope", "$http", "$q", "$filter", "$window"];
            return CoreService;
        })();
        core.CoreService = CoreService;
        angular.module("insite").service("coreService", CoreService).filter("trusted", ['$sce', function ($sce) { return function (val) { return $sce.trustAsHtml(val); }; }]);
    })(core = insite.core || (insite.core = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.core.service.js.map