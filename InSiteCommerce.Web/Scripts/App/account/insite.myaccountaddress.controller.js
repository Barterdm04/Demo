var insite;
(function (insite) {
    var account;
    (function (account) {
        "use strict";
        var MyAccountAddressController = (function () {
            function MyAccountAddressController($window, customerService, websiteService) {
                this.$window = $window;
                this.customerService = customerService;
                this.websiteService = websiteService;
                this.init();
            }
            MyAccountAddressController.prototype.init = function () {
                this.getBillTo();
            };
            MyAccountAddressController.prototype.save = function () {
                var _this = this;
                var valid = $("#addressForm").validate().form();
                if (!valid) {
                    return;
                }
                this.customerService.updateBillTo(this.billTo).success(function () {
                    if (_this.shipTo.id !== _this.billTo.id) {
                        var shipTo = _this.shipTo;
                        if (_this.shipTo["shipTos"]) {
                            /* In the situation the user selects the billTo as the shipTo we need to remove the shipTos collection
                               from the object to prevent a circular reference when serializing the object. See the unshift command below. */
                            angular.copy(_this.shipTo, shipTo);
                            delete shipTo["shipTos"];
                        }
                        _this.customerService.addOrUpdateShipTo(shipTo).success(function (result) {
                            if (_this.shipTo.isNew) {
                                _this.getBillTo(result);
                            }
                            angular.element("#saveSuccess").foundation("reveal", "open");
                        });
                    }
                    else {
                        angular.element("#saveSuccess").foundation("reveal", "open");
                    }
                });
            };
            MyAccountAddressController.prototype.getBillTo = function (selectedShipTo) {
                var _this = this;
                this.customerService.getBillTo("shiptos,validation").success(function (result) {
                    _this.billTo = result;
                    _this.websiteService.getCountries("states").success(function (result) {
                        _this.countries = result.countries;
                        _this.setObjectToReference(_this.countries, _this.billTo, "country");
                        if (_this.billTo.country) {
                            _this.setObjectToReference(_this.billTo.country.states, _this.billTo, "state");
                        }
                        var shipTos = _this.billTo.shipTos;
                        var shipToBillTo;
                        shipTos.forEach(function (shipTo) {
                            _this.setObjectToReference(_this.countries, shipTo, "country");
                            if (shipTo.country) {
                                _this.setObjectToReference(shipTo.country.states, shipTo, "state");
                            }
                            if (shipTo.id === _this.billTo.id) {
                                shipToBillTo = shipTo;
                            }
                        });
                        // if allow ship to billing address, remove the billto returned in the shipTos array and put in the actual billto object
                        // so that updating one side updates the other side
                        if (shipToBillTo) {
                            _this.billTo.label = shipToBillTo.label;
                            shipTos.splice(shipTos.indexOf(shipToBillTo), 1); // remove the billto that's in the shiptos array
                            shipTos.unshift(_this.billTo); // add the actual billto to top of array
                        }
                        if (selectedShipTo) {
                            shipTos.forEach(function (shipTo) {
                                if (shipTo.id === selectedShipTo.id) {
                                    _this.shipTo = shipTo;
                                }
                            });
                        }
                        else {
                            _this.shipTo = shipTos[0];
                        }
                    });
                });
            };
            MyAccountAddressController.prototype.setObjectToReference = function (references, object, objectPropertyName) {
                references.forEach(function (reference) {
                    if (object[objectPropertyName] && (reference.id === object[objectPropertyName].id)) {
                        object[objectPropertyName] = reference;
                    }
                });
            };
            MyAccountAddressController.$inject = [
                "$window",
                "customerService",
                "websiteService"
            ];
            return MyAccountAddressController;
        })();
        account.MyAccountAddressController = MyAccountAddressController;
        angular.module("insite").controller("MyAccountAddressController", MyAccountAddressController);
    })(account = insite.account || (insite.account = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.myaccountaddress.controller.js.map