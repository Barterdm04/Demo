var insite;
(function (insite) {
    var account;
    (function (account) {
        "use strict";
        var SessionService = (function () {
            function SessionService($http, $rootScope, $q, $localStorage, $window, $cookies, coreService, base64) {
                this.$http = $http;
                this.$rootScope = $rootScope;
                this.$q = $q;
                this.$localStorage = $localStorage;
                this.$window = $window;
                this.$cookies = $cookies;
                this.coreService = coreService;
                this.base64 = base64;
                this.isAuthenticatedOnServerUri = this.coreService.getApiUri("/account/isauthenticated");
                this.serviceUri = this.coreService.getApiUri("/api/v1/sessions");
                this.tokenUri = this.coreService.getApiUri("/identity/connect/token");
                this.authRetryCount = 0;
                if (this.$cookies.InitiateImpersonate) {
                    this.deleteAllCookies([".AspNet.ApplicationCookie=;", "ImpersonatedBy"]);
                    localStorage.clear();
                    sessionStorage.clear();
                }
            }
            SessionService.prototype.deleteAllCookies = function (except) {
                angular.forEach(this.$cookies, function (v, k) {
                    if (!except.some(function (c) { return c == k; }))
                        document.cookie = k + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT"; //because delete $cookies.InitiateImpersonate doesn't work in IE, even with httpOnly = false
                });
            };
            SessionService.prototype.getSession = function () {
                var _this = this;
                var deferred = this.$q.defer();
                var isAuthenticatedOnServer;
                this.$http.get(this.isAuthenticatedOnServerUri + "?timestamp=" + Date.now()).success(function (authenticatedResult) {
                    isAuthenticatedOnServer = authenticatedResult.isAuthenticatedOnServer;
                    // if the user IS NOT authenticated on the server, but they DO have an access token, remove the access token
                    if (!isAuthenticatedOnServer && _this.isAuthenticated()) {
                        _this.removeAuthentication();
                        // invalidate etags
                        _this.$http({
                            method: "PATCH",
                            url: _this.serviceUri + "/current",
                        });
                        // force reload the browser window to invalidate all the etags and not get any stale data
                        _this.$window.location.reload(true);
                        return deferred.reject(null);
                    }
                    else if (isAuthenticatedOnServer && !_this.isAuthenticated()) {
                        _this.$http.get(_this.coreService.getApiUri("/account/accesstoken?timestamp=" + Date.now())).success(function (result) {
                            _this.setAccessToken(result.access_token);
                            // invalidate etags
                            _this.$http({
                                method: "PATCH",
                                url: _this.serviceUri + "/current",
                            });
                            // force reload the browser window to invalidate all the etags and not get any stale data
                            _this.$window.location.reload(true);
                            return deferred.reject(null);
                        });
                    }
                    _this.getSessionFromServer().then(function (session) {
                        return deferred.resolve(session);
                    }, function (error) {
                        return deferred.reject(error);
                    });
                });
                return deferred.promise;
            };
            SessionService.prototype.getSessionFromServer = function () {
                var _this = this;
                var deferred = this.$q.defer();
                this.$http.get(this.serviceUri + "/current?timestamp=" + Date.now()).success(function (session) {
                    _this.setContextFromSession(session);
                    _this.$rootScope.$broadcast("sessionLoaded", session);
                    deferred.resolve(session);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            SessionService.prototype.getAccessToken = function (userName, password) {
                var loginData = "grant_type=password&username=" + userName + "&password=" + password + "&scope=" + insiteScope;
                var config = {
                    headers: {
                        "Authorization": "Basic " + this.base64.encode(insiteBasicAuthHeader),
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    bypassErrorInterceptor: true
                };
                return this.$http.post(this.tokenUri, loginData, config);
            };
            SessionService.prototype.setAccessToken = function (accessToken) {
                this.$localStorage.set("accessToken", accessToken);
            };
            SessionService.prototype.retrieveAccessToken = function () {
                return this.$localStorage.get("accessToken");
            };
            SessionService.prototype.removeAccessToken = function () {
                if (this.$localStorage.get("accessToken"))
                    this.$localStorage.remove("accessToken");
            };
            SessionService.prototype.getContext = function () {
                var context = {
                    pageUrl: "",
                    billToId: this.$cookies.CurrentCustomerId,
                    shipToId: this.$cookies.CurrentShipToId,
                    currencyId: this.$cookies.CurrentCurrencyId,
                    languageId: this.$cookies.CurrentLanguageId
                };
                return context;
            };
            SessionService.prototype.setContext = function (context) {
                if (context.billToId) {
                    this.$cookies.CurrentCustomerId = context.billToId;
                }
                else {
                    delete this.$cookies.CurrentCustomerId;
                }
                if (context.shipToId) {
                    this.$cookies.CurrentShipToId = context.shipToId;
                }
                else {
                    delete this.$cookies.CurrentShipToId;
                }
                if (context.currencyId) {
                    this.$cookies.CurrentCurrencyId = context.currencyId;
                }
                else {
                    delete this.$cookies.CurrentCurrencyId;
                }
                if (context.languageId) {
                    this.$cookies.CurrentLanguageId = context.languageId;
                }
                else {
                    delete this.$cookies.CurrentLanguageId;
                }
            };
            SessionService.prototype.setContextFromSession = function (session) {
                var context = {
                    pageUrl: "",
                    languageId: session.language.id,
                    currencyId: session.currency.id,
                    billToId: session.billTo ? session.billTo.id : null,
                    shipToId: session.shipTo ? session.shipTo.id : null
                };
                this.setContext(context);
            };
            SessionService.prototype.isAuthenticated = function () {
                return this.$localStorage.get("accessToken", null) !== null;
            };
            SessionService.prototype.getIsAuthenticated = function () {
                var _this = this;
                var deferred = this.$q.defer();
                var isAuthenticatedOnServer;
                this.$http.get(this.isAuthenticatedOnServerUri + "?timestamp=" + Date.now()).success(function (authenticatedResult) {
                    isAuthenticatedOnServer = authenticatedResult.isAuthenticatedOnServer;
                    // if the user IS NOT authenticated on the server, but they DO have an access token, remove the access token
                    if (!isAuthenticatedOnServer && _this.isAuthenticated()) {
                        _this.removeAuthentication();
                        // invalidate etags
                        _this.$http({
                            method: "PATCH",
                            url: _this.serviceUri + "/current"
                        });
                    }
                    return deferred.resolve(isAuthenticatedOnServer);
                });
                return deferred.promise;
            };
            SessionService.prototype.removeAuthentication = function () {
                this.removeAccessToken();
                var currentContext = this.getContext();
                currentContext.billToId = null;
                currentContext.shipToId = null;
                this.setContext(currentContext);
            };
            SessionService.prototype.signIn = function (accessToken, userName, password) {
                var _this = this;
                this.setAccessToken(accessToken);
                var deferred = this.$q.defer();
                this.$http.post(this.serviceUri, { "userName": userName, "password": password }, { bypassErrorInterceptor: true }).success(function (result) {
                    deferred.resolve(result);
                }).error(function (data, status) {
                    _this.removeAccessToken();
                    var error = { data: data, status: status };
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            SessionService.prototype.signOut = function () {
                var _this = this;
                var deferred = this.$q.defer();
                this.$http.delete(this.serviceUri + "/current").success(function (result) {
                    _this.removeAuthentication();
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            SessionService.prototype.setLanguage = function (languageId) {
                var _this = this;
                var deferred = this.$q.defer();
                this.$http({
                    method: "PATCH",
                    url: this.serviceUri + "/current",
                    data: { "language": { "id": languageId } }
                }).success(function (result) {
                    var currentContext = _this.getContext();
                    currentContext.languageId = languageId;
                    _this.setContext(currentContext);
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            SessionService.prototype.setCurrency = function (currencyId) {
                var _this = this;
                var deferred = this.$q.defer();
                this.$http({
                    method: "PATCH",
                    url: this.serviceUri + "/current",
                    data: { "currency": { "id": currencyId } }
                }).success(function (result) {
                    var currentContext = _this.getContext();
                    currentContext.currencyId = currencyId;
                    _this.setContext(currentContext);
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });
                ;
                return deferred.promise;
            };
            SessionService.prototype.setCustomer = function (billToId, shipToId) {
                var _this = this;
                var deferred = this.$q.defer();
                this.$http({
                    method: "PATCH",
                    url: this.serviceUri + "/current",
                    data: { "billTo": { "Id": billToId }, "shipTo": { "Id": shipToId } },
                    bypassErrorInterceptor: true
                }).success(function (result) {
                    var currentContext = _this.getContext();
                    currentContext.billToId = billToId;
                    currentContext.shipToId = shipToId;
                    _this.setContext(currentContext);
                    deferred.resolve(result);
                }).error(function (error) {
                    deferred.reject(error);
                });
                ;
                return deferred.promise;
                ;
            };
            SessionService.prototype.updateSession = function (session) {
                return this.$http({
                    method: "PATCH",
                    url: this.serviceUri + "/current",
                    data: session
                });
            };
            SessionService.prototype.changePassword = function (session, accessToken) {
                var _this = this;
                var deferred = this.$q.defer();
                if (accessToken) {
                    this.setAccessToken(accessToken);
                }
                this.$http({ method: "PATCH", url: this.serviceUri + "/current", data: session, bypassErrorInterceptor: true }).success(function (result) {
                    deferred.resolve(result);
                }).error(function (error) {
                    if (accessToken) {
                        _this.removeAccessToken();
                    }
                    deferred.reject(error);
                });
                return deferred.promise;
            };
            SessionService.prototype.resetPassword = function (session) {
                return this.$http({ method: "PATCH", url: this.serviceUri + "/current", data: session, bypassErrorInterceptor: true });
            };
            SessionService.prototype.redirectAfterSelectCustomer = function (sessionModel, byPassAddressPage, dashboardUrl, returnUrl, checkoutAddressUrl, reviewAndPayUrl) {
                if (sessionModel.customLandingPage) {
                    returnUrl = sessionModel.customLandingPage;
                }
                else if (sessionModel.dashboardIsHomepage) {
                    returnUrl = dashboardUrl;
                }
                if (returnUrl.toLowerCase() == checkoutAddressUrl.toLowerCase() && byPassAddressPage) {
                    returnUrl = reviewAndPayUrl;
                }
                this.$window.location.href = returnUrl;
            };
            SessionService.$inject = [
                "$http",
                "$rootScope",
                "$q",
                "$localStorage",
                "$window",
                "$cookies",
                "coreService",
                "base64"
            ];
            return SessionService;
        })();
        account.SessionService = SessionService;
        angular.module("insite").service("sessionService", SessionService);
    })(account = insite.account || (insite.account = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.session.service.js.map