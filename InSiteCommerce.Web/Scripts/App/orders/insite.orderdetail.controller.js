var insite;
(function (insite) {
    var order;
    (function (order) {
        "use strict";
        var OrderDetailController = (function () {
            function OrderDetailController($scope, orderService, cartService, coreService) {
                this.$scope = $scope;
                this.orderService = orderService;
                this.cartService = cartService;
                this.coreService = coreService;
                this.allowCancellationRequest = false;
                this.showCancelationConfirmation = false;
                this.showInventoryAvailability = false;
                this.init();
            }
            OrderDetailController.prototype.init = function () {
                var _this = this;
                this.$scope.$on("settingsLoaded", function (event, data) {
                    _this.allowCancellationRequest = data.orderSettings.allowCancellationRequest;
                    _this.showInventoryAvailability = data.productSettings.showInventoryAvailability;
                });
                this.orderNumber = this.coreService.getQueryStringParameter("orderNumber", true);
                if (typeof this.orderNumber === "undefined") {
                    // handle "clean urls" 
                    var pathArray = window.location.pathname.split("/");
                    var pathOrderNumber = pathArray[pathArray.length - 1];
                    if (pathOrderNumber !== "OrderHistoryDetail") {
                        this.orderNumber = pathOrderNumber;
                    }
                }
                this.getOrder(this.orderNumber);
            };
            /* mimics the functionality in the html helper extension */
            OrderDetailController.prototype.formatCityCommaStateZip = function (city, state, zip) {
                var formattedString = "";
                if (city) {
                    formattedString += city;
                }
                if (city && state) {
                    formattedString += ", " + state + " " + zip;
                }
                return formattedString;
            };
            OrderDetailController.prototype.getOrder = function (orderNumber) {
                var _this = this;
                this.orderService.getOrder(orderNumber, "orderlines,shipments").success(function (data) {
                    _this.order = data;
                    _this.btFormat = _this.formatCityCommaStateZip(_this.order.billToCity, _this.order.billToState, _this.order.billToPostalCode);
                    _this.stFormat = _this.formatCityCommaStateZip(_this.order.shipToCity, _this.order.shipToState, _this.order.shipToPostalCode);
                }).error(function (error) {
                    _this.validationMessage = error.exceptionMessage;
                });
            };
            OrderDetailController.prototype.reorderProduct = function ($event, line) {
                $event.preventDefault();
                line.canAddToCart = false;
                var reorderItemsCount = 0;
                for (var i = 0; i < this.order.orderLines.length; i++) {
                    if (this.order.orderLines[i].canAddToCart) {
                        reorderItemsCount++;
                    }
                }
                this.order.canReorderItems = reorderItemsCount !== 0;
                this.cartService.addLine(this.convertToCartLine(line));
            };
            OrderDetailController.prototype.reorderAllProducts = function ($event) {
                $event.preventDefault();
                this.order.canReorderItems = false;
                var cartLines = [];
                for (var i = 0; i < this.order.orderLines.length; i++) {
                    if (this.order.orderLines[i].canAddToCart) {
                        cartLines.push(this.convertToCartLine(this.order.orderLines[i]));
                    }
                }
                if (cartLines.length > 0) {
                    this.cartService.addLineCollection(cartLines);
                }
            };
            OrderDetailController.prototype.cancelAndReorder = function ($event) {
                this.reorderAllProducts($event);
                this.cancelOrder($event);
            };
            OrderDetailController.prototype.cancelOrder = function ($event) {
                //call update order with cancelation status
                var _this = this;
                var updateOrderModel = { status: "CancellationRequested" };
                updateOrderModel.erpOrderNumber = this.orderNumber;
                this.orderService.updateOrder(this.orderNumber, updateOrderModel).success(function (data) {
                    _this.order.status = data.status;
                    _this.showCancelationConfirmation = true;
                }).error(function (error) {
                    _this.validationMessage = error.exceptionMessage;
                });
            };
            OrderDetailController.prototype.convertToCartLine = function (line) {
                var cartLine = {};
                cartLine.productId = line.productId;
                cartLine.qtyOrdered = line.qtyOrdered;
                cartLine.unitOfMeasure = line.unitOfMeasure;
                return cartLine;
            };
            OrderDetailController.$inject = ["$scope", "orderService", "cartService", "coreService"];
            return OrderDetailController;
        })();
        order.OrderDetailController = OrderDetailController;
        angular.module("insite").controller("OrderDetailController", OrderDetailController);
    })(order = insite.order || (insite.order = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.orderdetail.controller.js.map