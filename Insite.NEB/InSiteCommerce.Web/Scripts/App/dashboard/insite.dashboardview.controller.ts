﻿module insite.dashboard {
    "use strict";

    export class DashboardViewController {
        isSalesPerson: boolean;
        canRequestQuote: boolean;

        static $inject = ["$scope"];

        constructor(protected $scope: ng.IScope) {
            this.init();
        }

        init() {
            this.$scope.$on("sessionLoaded", (event: ng.IAngularEvent, session: SessionModel) => {
                this.isSalesPerson = session.isSalesPerson;
            });
            this.$scope.$on("cartLoaded", (event, cart: CartModel) => {
                this.canRequestQuote = cart.canRequestQuote;
            });
        }
    }

    angular
        .module("insite")
        .controller("DashboardViewController", DashboardViewController);
}