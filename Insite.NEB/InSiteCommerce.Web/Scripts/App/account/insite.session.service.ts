import SessionModel = Insite.Account.WebApi.V1.ApiModels.SessionModel;
import CurrentContextModel = Insite.Core.WebApi.CurrentContextModel;

module insite.account {
    "use strict";

    export interface ISessionService {
        getSession(): ng.IPromise<SessionModel>;
        getAccessToken(userName: string, password: string): ng.IHttpPromise<any>;
        setAccessToken(accessToken: string);
        retrieveAccessToken(): string;
        removeAccessToken();
        getContext(): CurrentContextModel;
        setContext(context: CurrentContextModel);
        setContextFromSession(session: SessionModel);
        isAuthenticated(): boolean;
        getIsAuthenticated(): ng.IPromise<boolean>;
        signIn(accessToken: string, userName: string, password: string): ng.IPromise<SessionModel>;
        signOut(): ng.IPromise<string>;
        setLanguage(languageId: System.Guid): ng.IPromise<SessionModel>;
        setCurrency(currencyId: System.Guid): ng.IPromise<SessionModel>;
        setCustomer(billToId: System.Guid, shipToId: System.Guid): ng.IPromise<SessionModel>;
        updateSession(session: SessionModel): ng.IHttpPromise<SessionModel>;
        changePassword(session: SessionModel, accessToken?: string): ng.IPromise<SessionModel>;
        resetPassword(session: SessionModel): ng.IHttpPromise<SessionModel>;
        redirectAfterSelectCustomer(sessionModel: SessionModel, byPassAddressPage: boolean, dashboardUrl: string,
            returnUrl: string, checkoutAddressUrl: string, reviewAndPayUrl: string);
    }

    export class SessionService implements ISessionService {

        isAuthenticatedOnServerUri = this.coreService.getApiUri("/account/isauthenticated");
        serviceUri = this.coreService.getApiUri("/api/v1/sessions");
        tokenUri = this.coreService.getApiUri("/identity/connect/token");

        authRetryCount = 0;

        static $inject = [
            "$http",
            "$rootScope",
            "$q",
            "$localStorage",
            "$window",
            "$cookies",
            "coreService",
            "base64"
        ];

        constructor(protected $http: ng.IHttpService,
            protected $rootScope: ng.IRootScopeService,
            protected $q: ng.IQService,
            protected $localStorage: core.IWindowStorage,
            protected $window: ng.IWindowService,
            protected $cookies: any,
            protected coreService: core.ICoreService,
            protected base64: any) {
            if (this.$cookies.InitiateImpersonate) {
                this.deleteAllCookies([".AspNet.ApplicationCookie=;", "ImpersonatedBy"]);
                localStorage.clear();
                sessionStorage.clear();
            }
        }

        private deleteAllCookies(except: string[]): void {
            angular.forEach(this.$cookies, function (v, k) {
                if (!except.some(c => c == k))
                    document.cookie = k + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";//because delete $cookies.InitiateImpersonate doesn't work in IE, even with httpOnly = false
            });
        }

        getSession(): ng.IPromise<SessionModel> {
            var deferred = this.$q.defer();
            var isAuthenticatedOnServer;
            this.$http.get(this.isAuthenticatedOnServerUri + "?timestamp=" + Date.now()).success((authenticatedResult: any) => {

                isAuthenticatedOnServer = authenticatedResult.isAuthenticatedOnServer;

                // if the user IS NOT authenticated on the server, but they DO have an access token, remove the access token
                if (!isAuthenticatedOnServer && this.isAuthenticated()) {

                    this.removeAuthentication();

                    // invalidate etags
                    this.$http({
                        method: "PATCH",
                        url: this.serviceUri + "/current",
                    });

                    // force reload the browser window to invalidate all the etags and not get any stale data
                    this.$window.location.reload(true);

                    return deferred.reject(null);
                }

                // if the user IS authenticated on the server, but DOES NOT have an access token, get an access token
                else if (isAuthenticatedOnServer && !this.isAuthenticated()) {
                    this.$http.get(this.coreService.getApiUri("/account/accesstoken?timestamp=" + Date.now())).success((result: any) => {
                        this.setAccessToken(result.access_token);

                        // invalidate etags
                        this.$http({
                            method: "PATCH",
                            url: this.serviceUri + "/current",
                        });

                        // force reload the browser window to invalidate all the etags and not get any stale data
                        this.$window.location.reload(true);

                        return deferred.reject(null);
                    });
                }

                this.getSessionFromServer().then((session: SessionModel) => {
                    return deferred.resolve(session);
                },(error: any) => {
                    return deferred.reject(error);
                });
            });

            return deferred.promise;
        }

        getSessionFromServer(): ng.IPromise<SessionModel> {
            var deferred = this.$q.defer();
            this.$http.get(this.serviceUri + "/current?timestamp=" + Date.now()).success((session: SessionModel) => {
                this.setContextFromSession(session);
                this.$rootScope.$broadcast("sessionLoaded", session);
                deferred.resolve(session);
            }).error(error => {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        getAccessToken(userName: string, password: string): ng.IHttpPromise<any> {
            var loginData = "grant_type=password&username=" + userName + "&password=" + password + "&scope=" + insiteScope;
            var config = {
                headers: {
                    "Authorization": "Basic " + this.base64.encode(insiteBasicAuthHeader),
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                bypassErrorInterceptor: true
            };

            return this.$http.post(this.tokenUri, loginData, config);
        }

        setAccessToken(accessToken: string) {
            this.$localStorage.set("accessToken", accessToken);
        }

        retrieveAccessToken(): string {
            return this.$localStorage.get("accessToken");
        }

        removeAccessToken() {
            if (this.$localStorage.get("accessToken"))
                this.$localStorage.remove("accessToken");
        }

        getContext(): CurrentContextModel {
            var context: CurrentContextModel = {
                pageUrl: "",
                billToId: this.$cookies.CurrentCustomerId,
                shipToId: this.$cookies.CurrentShipToId,
                currencyId: this.$cookies.CurrentCurrencyId,
                languageId: this.$cookies.CurrentLanguageId
            }
            return context;
        }

        setContext(context: CurrentContextModel) {
            if (context.billToId) {
                this.$cookies.CurrentCustomerId = context.billToId;
            } else {
                delete this.$cookies.CurrentCustomerId;
            }
            if (context.shipToId) {
                this.$cookies.CurrentShipToId = context.shipToId;
            } else {
                delete this.$cookies.CurrentShipToId;
            }
            if (context.currencyId) {
                this.$cookies.CurrentCurrencyId = context.currencyId;
            } else {
                delete this.$cookies.CurrentCurrencyId;
            }
            if (context.languageId) {
                this.$cookies.CurrentLanguageId = context.languageId;
            } else {
                delete this.$cookies.CurrentLanguageId;
            }
        }

        setContextFromSession(session: SessionModel) {
            var context: CurrentContextModel = {
                pageUrl: "",
                languageId: session.language.id,
                currencyId: session.currency.id,
                billToId: session.billTo ? session.billTo.id : null,
                shipToId: session.shipTo ? session.shipTo.id : null
            };
            this.setContext(context);
        }

        isAuthenticated(): boolean {
            return this.$localStorage.get("accessToken", null) !== null;
        }

        getIsAuthenticated(): ng.IPromise<boolean> {
            var deferred = this.$q.defer();
            var isAuthenticatedOnServer;
            this.$http.get(this.isAuthenticatedOnServerUri + "?timestamp=" + Date.now()).success((authenticatedResult: any) => {
                isAuthenticatedOnServer = authenticatedResult.isAuthenticatedOnServer;

                // if the user IS NOT authenticated on the server, but they DO have an access token, remove the access token
                if (!isAuthenticatedOnServer && this.isAuthenticated()) {

                    this.removeAuthentication();

                    // invalidate etags
                    this.$http({
                        method: "PATCH",
                        url: this.serviceUri + "/current"
                    });
                }

                return deferred.resolve(isAuthenticatedOnServer);
            });

            return deferred.promise;
        }

        removeAuthentication() {
            this.removeAccessToken();
            var currentContext = this.getContext();
            currentContext.billToId = null;
            currentContext.shipToId = null;
            this.setContext(currentContext);
        }

        signIn(accessToken: string, userName: string, password: string): ng.IPromise<SessionModel> {
            this.setAccessToken(accessToken);
            var deferred = this.$q.defer();
            this.$http.post(this.serviceUri, { "userName": userName, "password": password }, { bypassErrorInterceptor: true }).success(result => {
                deferred.resolve(result);
            }).error((data, status) => {
                this.removeAccessToken();
                var error = { data: data, status: status };
                deferred.reject(error);
            });
            return deferred.promise;
        }

        signOut(): ng.IPromise<string> {
            var deferred = this.$q.defer();
            this.$http.delete(this.serviceUri + "/current").success(result => {
                this.removeAuthentication();
                deferred.resolve(result);
            }).error(error => {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        setLanguage(languageId: System.Guid): ng.IPromise<SessionModel> {
            var deferred = this.$q.defer();
            this.$http({
                method: "PATCH",
                url: this.serviceUri + "/current",
                data: { "language": { "id": languageId } }
            }).success(result => {
                var currentContext = this.getContext();
                currentContext.languageId = languageId;
                this.setContext(currentContext);
                deferred.resolve(result);
            }).error(error => {
                deferred.reject(error);
            });
            return deferred.promise;
        }

        setCurrency(currencyId: System.Guid): ng.IPromise<SessionModel> {
            var deferred = this.$q.defer();
            this.$http({
                method: "PATCH",
                url: this.serviceUri + "/current",
                data: { "currency": { "id": currencyId } }
            }).success(result => {
                var currentContext = this.getContext();
                currentContext.currencyId = currencyId;
                this.setContext(currentContext);
                deferred.resolve(result);
            }).error(error => {
                deferred.reject(error);
            });;
            return deferred.promise;
        }

        setCustomer(billToId: System.Guid, shipToId: System.Guid): ng.IPromise<SessionModel> {
            var deferred = this.$q.defer();
            this.$http({
                method: "PATCH",
                url: this.serviceUri + "/current",
                data: { "billTo": { "Id": billToId }, "shipTo": { "Id": shipToId } },
                bypassErrorInterceptor: true
            }).success(result => {
                var currentContext = this.getContext();
                currentContext.billToId = billToId;
                currentContext.shipToId = shipToId;
                this.setContext(currentContext);
                deferred.resolve(result);
            }).error(error => {
                deferred.reject(error);
            });;
            return deferred.promise;;
        }

        updateSession(session: SessionModel): ng.IHttpPromise<SessionModel> {
            return this.$http({
                method: "PATCH",
                url: this.serviceUri + "/current",
                data: session
            });
        }

        changePassword(session: SessionModel, accessToken?: string): ng.IPromise<SessionModel> {
            var deferred = this.$q.defer();
            if (accessToken) {
                this.setAccessToken(accessToken);
            }
            this.$http({ method: "PATCH", url: this.serviceUri + "/current", data: session, bypassErrorInterceptor: true }).success(result => {
                deferred.resolve(result);
            }).error(error => {
                if (accessToken) {
                    this.removeAccessToken();
                }
                deferred.reject(error);
            });
            return deferred.promise;
        }

        resetPassword(session: SessionModel): ng.IHttpPromise<SessionModel> {
            return this.$http({ method: "PATCH", url: this.serviceUri + "/current", data: session, bypassErrorInterceptor: true });
        }

        redirectAfterSelectCustomer(sessionModel: SessionModel, byPassAddressPage: boolean,
            dashboardUrl: string, returnUrl: string, checkoutAddressUrl: string, reviewAndPayUrl: string) {
            if (sessionModel.customLandingPage) {
                returnUrl = sessionModel.customLandingPage;
            } else if (sessionModel.dashboardIsHomepage) {
                returnUrl = dashboardUrl;
            }
            if (returnUrl.toLowerCase() == checkoutAddressUrl.toLowerCase() && byPassAddressPage) {
                returnUrl = reviewAndPayUrl;
            }
            this.$window.location.href = returnUrl;
        }
    }

    angular
        .module("insite")
        .service("sessionService", SessionService);
}