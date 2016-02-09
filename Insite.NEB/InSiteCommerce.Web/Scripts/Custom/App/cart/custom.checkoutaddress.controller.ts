module insite.cart {

    import ShipToModel = Insite.Customers.WebApi.V1.ApiModels.ShipToModel;
    "use strict";

    export class CustomCheckoutAddressController extends CheckoutAddressController {

        static $inject = [
            "$scope", "$window", "cartService", "customerService", "websiteService", "coreService", "userExchangeService", "sessionService"
        ];



        constructor(
            protected $scope: ICartScope,
            protected $window: ng.IWindowService,
            protected cartService: ICartService,
            protected customerService: customers.ICustomerService,
            protected websiteService: websites.IWebsiteService,
            protected coreService: core.ICoreService,
            protected userExchangeService: cart.IUserExchangeService,
            protected sessionService: ISessionService) {
            super($scope, $window, cartService, customerService, websiteService, coreService);
        }

        cart: CartModel;
        cartId: string;
        countries: CountryModel[];
        selectedShipTo: ShipToModel;
        shipTos: ShipToModel[];
        isReadOnly = false;
        session: SessionModel;

        selectedUser: any;
        users: any[];

        init() {
            this.cartId = this.coreService.getQueryStringParameter("cartId");

            this.cartService.expand = "shiptos,validation";

            var self = this;

            this.cartService.getCart(this.cartId).then(cart => {

                this.cart = cart;

                this.websiteService.getCountries("states").success(result => {

                    this.countries = result.countries;

                    self.userExchangeService.getUsers()
                        .success(function (result) {
                            var userList = result.users;
                            var newList = [];
                            self.sessionService.getSession().then((result: SessionModel) => {
                                self.session = result;
                                for (var i = 0; i < userList.length; i++) {
                                    if (userList[i].name !== self.session.userName) {
                                        if (userList[i].billTo) {
                                            var billTos = userList[i].billTo;
                                            for (var x = 0; x < billTos.length; x++) {
                                                if (billTos[x].idString == self.session.billTo.id) {
                                                    newList.push(userList[i]);
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                            
                            self.users = newList;
                        })
                        .error(function (data) {
                            self.users = [];
                        });

                    var billTo = this.cart.billTo;

                    this.setObjectToReference(this.countries, billTo, "country");
                    if (billTo.country) {
                        this.setObjectToReference(billTo.country.states, billTo, "state");
                    }
                    this.shipTos = angular.copy(billTo.shipTos);

                    var shipToBillTo: ShipToModel;
                    this.shipTos.forEach(shipTo => {
                        if (shipTo.country && shipTo.country.states) {
                            this.setObjectToReference(this.countries, shipTo, "country");
                            this.setObjectToReference(shipTo.country.states, shipTo, "state");
                        }
                        
                        if (shipTo.id === billTo.id) {
                            shipToBillTo = shipTo;
                            // Don't allow editing the Bill To from the Ship To column.  Only allow
                            // editing of Bill To from the Bill To column. So, if ship to is the bill to change
                            // the ship to fields to readonly.
                            //this.isReadOnly = true;
                        }
                    });
                    this.selectedShipTo = this.cart.shipTo;
                    // if allow ship to billing address, remove the billto returned in the shipTos array and put in the actual billto object
                    // so that updating one side updates the other side
                    if (shipToBillTo) {
                        billTo.label = shipToBillTo.label;
                        this.shipTos.splice(this.shipTos.indexOf(shipToBillTo), 1); // remove the billto that's in the shiptos array
                        this.shipTos.unshift(<ShipToModel><any>billTo); // add the actual billto to top of array
                    }

                    this.shipTos.forEach(shipTo => {
                        if (this.cart.shipTo && shipTo.id === this.cart.shipTo.id || !this.selectedShipTo && shipTo.isNew) {
                            this.selectedShipTo = shipTo;
                        }
                    });
                });
            });
        }
    
        continueCheckout(continueUri: string) {
            var valid = $("#addressForm").validate().form();
            if (!valid) {
                return;
            }

            if (this.cartId) {
                continueUri += "?cartId=" + this.cartId;
            }

            this.updateCartModel();

            if (this.$scope.addressForm.$pristine) {
                this.updateCart(this.cart, continueUri);
            }

            this.customerService.updateBillTo(this.cart.billTo).success(() => {

                var shipToMatches = this.cart.billTo.shipTos.filter(shipTo => { return shipTo.id === this.selectedShipTo.id; });
                if (shipToMatches.length === 1) {
                    this.cart.shipTo = this.selectedShipTo;
                }

                if (this.cart.shipTo.id !== this.cart.billTo.id) {
                    this.customerService.addOrUpdateShipTo(this.cart.shipTo).success((shipTo: ShipToModel) => {
                        if (this.cart.shipTo.isNew) {
                            this.cart.shipTo = shipTo;
                        }

                        this.updateCart(this.cart, continueUri);
                    });
                } else {
                    this.updateCart(this.cart, continueUri);
                }
            });
        }

        updateCart(cart: CartModel, continueUri: string) {
            this.cartService.updateCart(cart).then(() => {
                this.$window.location.href = continueUri;
            });
        }

        updateCartModel() {
            if (this.selectedUser != null) {
                this.cart.properties = { purchasedFor: this.selectedUser.name };
            } else if (this.cart.properties.hasOwnProperty('purchasedFor')) {
                this.cart.properties = { purchasedFor: "Self" };
            }
        }
    }

    angular
        .module("insite")
        .controller("CheckoutAddressController", CustomCheckoutAddressController);
}
