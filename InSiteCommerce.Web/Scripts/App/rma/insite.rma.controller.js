var insite;
(function (insite) {
    var rma;
    (function (rma) {
        "use strict";
        var RmaController = (function () {
            function RmaController(orderService, coreService) {
                this.orderService = orderService;
                this.coreService = coreService;
                this.totalQuantity = 0;
                this.requestSubmitted = false;
                this.init();
            }
            RmaController.prototype.init = function () {
                this.getOrder();
            };
            RmaController.prototype.getOrder = function () {
                var _this = this;
                var orderNumber = this.coreService.getQueryStringParameter("orderNumber", true);
                if (typeof orderNumber === "undefined") {
                    // handle "clean urls" 
                    var pathArray = window.location.pathname.split("/");
                    var pathNumber = pathArray[pathArray.length - 1];
                    if (pathNumber !== "OrderHistoryDetail") {
                        orderNumber = pathNumber;
                    }
                }
                this.orderService.getOrder(orderNumber, "orderlines").success(function (result) {
                    _this.order = result;
                    _this.cityCommaStateZipDisplay = _this.cityCommaStateZip(result.billToCity, result.billToState, result.billToPostalCode);
                });
            };
            RmaController.prototype.cityCommaStateZip = function (city, state, zip) {
                var formattedString = "";
                if (city) {
                    formattedString += city;
                }
                if (city && state) {
                    formattedString += ", " + state + " " + zip;
                }
                return formattedString;
            };
            RmaController.prototype.sendRmaRequest = function () {
                var _this = this;
                var rmaModel = {
                    orderNumber: this.order.webOrderNumber || this.order.erpOrderNumber,
                    notes: this.returnNotes,
                    message: "",
                    rmaLines: this.order.orderLines.map(function (orderLine) { return {
                        line: orderLine.lineNumber,
                        rmaQtyRequested: orderLine.rmaQtyRequested,
                        rmaReasonCode: orderLine.returnReason
                    }; })
                };
                if (typeof rmaModel.notes === "undefined") {
                    rmaModel.notes = "";
                }
                this.errorMessage = "";
                this.requestSubmitted = false;
                this.orderLinesForm.$submitted = true;
                if (this.orderLinesForm.$valid) {
                    rmaModel.rmaLines = rmaModel.rmaLines.filter(function (x) { return x.rmaQtyRequested > 0; });
                    this.orderService.addRma(rmaModel).success(function (result) {
                        if (!result.message) {
                            _this.requestSubmitted = true;
                            _this.orderLinesForm.$submitted = false;
                        }
                        else {
                            _this.resultMessage = result.message;
                        }
                        _this.coreService.displayModal(angular.element("#popup-rma"));
                    }).error(function (error) {
                        _this.errorMessage = error.message;
                    });
                }
            };
            RmaController.prototype.closePopup = function ($event) {
                $event.preventDefault();
                this.coreService.closeModal("#closeMessagePopup");
            };
            RmaController.prototype.calculateQuantity = function () {
                var _this = this;
                this.totalQuantity = 0;
                this.order.orderLines.forEach(function (orderLine) {
                    _this.totalQuantity += !orderLine.rmaQtyRequested ? 0 : 1;
                });
            };
            RmaController.$inject = ["orderService", "coreService"];
            return RmaController;
        })();
        rma.RmaController = RmaController;
        angular.module("insite").controller("RmaController", RmaController);
    })(rma = insite.rma || (insite.rma = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.rma.controller.js.map