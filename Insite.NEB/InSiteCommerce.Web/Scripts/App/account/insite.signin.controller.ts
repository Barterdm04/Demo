module insite.account {
    "use strict";

    export class SignInController {

        accessToken = "";
        changePasswordError: string;
        email: string;
        homePageUrl: string;
        changeCustomerPageUrl: string;
        dashboardUrl: string;
        newPassword: string;
        password: string;
        resetPasswordError: string;
        resetPasswordSuccess: boolean;
        returnUrl: string;
        checkoutAddressUrl: string;
        reviewAndPayUrl: string;
        settings: AccountSettingsModel;
        allowBillToForShipTo: boolean;
        signInError = "";
        disableSignIn = false;
        userName: string;
        cart: CartModel;
        signInForm: any;
        isFromReviewAndPay: boolean;
        
        static $inject = ["$scope", "$window", "accountService", "sessionService", "customerService", "coreService", "spinnerService"];

        constructor(protected $scope: ng.IScope,
            protected $window: ng.IWindowService,
            protected accountService: IAccountService,
            protected sessionService: ISessionService,
            protected customerService: customers.ICustomerService,
            protected coreService: core.ICoreService,
            protected spinnerService: core.ISpinnerService) {

            this.init();
        }

        init() {
            this.returnUrl = this.coreService.getQueryStringParameter("returnUrl", true);
            if (!this.returnUrl) {
                this.returnUrl = this.homePageUrl;
            }

            this.$scope.$on("sessionLoaded",(event, data) => {
                if (data.isAuthenticated) {
                    this.$window.location.href = this.dashboardUrl;
                }
            });

            this.$scope.$on("settingsLoaded",(event, data) => {
                this.settings = data.accountSettings;
                this.allowBillToForShipTo = data.customerSettings.allowBillToForShipTo;
            });
            this.$scope.$on("cartLoaded",(event: ng.IAngularEvent, cart: CartModel) => {
                this.cart = cart;
            });

            if (this.returnUrl.toLowerCase().indexOf("reviewandpay") > -1) {
                this.isFromReviewAndPay = true;
            }
        }

        signIn(errorMessage: string) {
            this.signInError = "";

            if (this.signInForm.$invalid) {
                return;
            }

            this.disableSignIn = true;
            this.spinnerService.show("mainLayout", true);
            this.sessionService.getAccessToken(this.userName, this.password).success(result => {
                this.accessToken = result.access_token;
                this.signUserIn();
            }).error(error => {
                this.signInError = errorMessage;
                this.disableSignIn = false;
                this.spinnerService.hide("mainLayout");
            });
        }

        selectCustomer()
        {
            this.customerService.getBillTos("shiptos", this.accessToken).success((billToResult: BillToCollectionModel) =>
            {
                if (!this.settings.requireSelectCustomerOnSignIn)
                {
                    if (this.allowBillToForShipTo && billToResult.billTos.some(x => x.isDefault)) {
                        var defaultBillTo = billToResult.billTos.filter(x => x.isDefault);
                        this.sessionService.setCustomer(defaultBillTo[0].id, defaultBillTo[0].id).then((result: SessionModel) => {
                            this.sessionService.redirectAfterSelectCustomer(result, this.cart.canBypassCheckoutAddress,
                                this.dashboardUrl, this.returnUrl, this.checkoutAddressUrl, this.reviewAndPayUrl);
                        });
                    }
                    else {
                        this.$window.location.href = this.returnUrl;
                    }
                }
                else if (billToResult.billTos.length === 1 && billToResult.billTos[0].shipTos.length === 1) {
                    var billTo = billToResult.billTos[0];
                    var shipTo = billToResult.billTos[0].shipTos[0];
                    this.sessionService.setCustomer(billTo.id, shipTo.id).then((result: SessionModel) => {
                        this.sessionService.redirectAfterSelectCustomer(result, this.cart.canBypassCheckoutAddress,
                            this.dashboardUrl, this.returnUrl, this.checkoutAddressUrl, this.reviewAndPayUrl);
                    });
                }
                else {
                    this.$window.location.href = this.changeCustomerPageUrl + "?returnUrl=" + this.returnUrl;
                }
            }).error(error => {
                this.$window.location.href = this.changeCustomerPageUrl + "?returnUrl=" + this.returnUrl;
            });
        }

        guestCheckout() {
            var account = <AccountModel><any>{ isGuest: true };

            this.accountService.createAccount(account).success(result => {
                this.sessionService.getAccessToken(result.userName, result.password).success(token => {
                    this.sessionService.setAccessToken(token.access_token);
                    this.$window.location.href = this.returnUrl;
                }).error(error => {
                    this.signInError = error.message;
                });
            }).error(error => {
                this.signInError = error.message;
            });
        }

        changePassword() {
            this.changePasswordError = "";

            var valid = $("#changePasswordForm").validate().form();
            if (!valid) {
                return;
            }

            var session = <SessionModel>{
                userName: this.userName,
                password: this.password,
                newPassword: this.newPassword
            };

            this.sessionService.changePassword(session, this.accessToken).then(() => {
                this.password = this.newPassword;
                this.signUserIn();
            }, error => {
                this.changePasswordError = error.message;
            });
        }

        resetPassword() {
            this.resetPasswordError = "";

            var valid = $("#resetPasswordForm").validate().form();
            if (!valid) {
                return;
            }

            var session = <SessionModel>{
                email: this.email,
                resetPassword: true
            };

            this.sessionService.resetPassword(session).success(() => {
                this.resetPasswordSuccess = true;
            }).error(error => {
                this.resetPasswordError = error.message;
            });
        }

        signUserIn() {
            this.sessionService.signIn(this.accessToken, this.userName, this.password).then((result: SessionModel) => {
                this.sessionService.setContextFromSession(result);

                this.selectCustomer();
            }, error => {
                this.disableSignIn = false;
                if (error.status === 422) {
                    this.coreService.displayModal(angular.element("#changePasswordPopup"));
                } else {
                    if (error.data.message) {
                        this.signInError = error.data.message;
                    } else {
                        this.signInError = error.data;
                    }
                }
            });
        }
    }

    angular
        .module("insite")
        .controller("SignInController", SignInController);
}