var insite;
(function (insite) {
    var requisitions;
    (function (requisitions) {
        "use strict";
        var RequisitionsController = (function () {
            function RequisitionsController(requisitionService, cartService, paginationService, coreService) {
                this.requisitionService = requisitionService;
                this.cartService = cartService;
                this.paginationService = paginationService;
                this.coreService = coreService;
                this.requireQuote = {};
                this.approvedRequisitionCollection = {};
                this.paginationStorageKey = "DefaultPagination-Requisitions";
                this.init();
            }
            RequisitionsController.prototype.init = function () {
                this.pagination = this.paginationService.getDefaultPagination(this.paginationStorageKey);
                this.getRequisitionCollection();
            };
            RequisitionsController.prototype.getRequisitionCollection = function () {
                var _this = this;
                this.requisitionService.getRequisitionCollection(this.pagination).success(function (result) {
                    _this.requisitionCollection = result;
                    _this.pagination = result.pagination;
                    _this.requisitionCollection.requisitions.forEach(function (requisition) {
                        if (_this.approvedRequisitionCollection[requisition.id]) {
                            requisition.isApproved = true;
                        }
                    });
                });
            };
            RequisitionsController.prototype.openRequisition = function (requisitionId) {
                var _this = this;
                this.message = "";
                this.requisitionService.getRequisition(requisitionId).success(function (result) {
                    _this.requisition = result;
                    _this.displayRequisition();
                });
            };
            RequisitionsController.prototype.patchRequisitionLine = function (requisitionLine) {
                var _this = this;
                this.message = "";
                this.requisitionService.patchRequisitionLine(requisitionLine).success(function (result) {
                    _this.getRequisitionCollection();
                    if (result === null) {
                        _this.requisition.requisitionLineCollection = null;
                    }
                    else {
                        _this.requisition = result;
                    }
                    if (requisitionLine.qtyOrdered <= 0) {
                        _this.message = _this.deleteItemMessage;
                    }
                    else {
                        _this.message = _this.updateItemMessage;
                    }
                });
            };
            RequisitionsController.prototype.deleteRequisitionLine = function (requisitionLine) {
                var _this = this;
                this.message = "";
                this.requisitionService.deleteRequisitionLine(requisitionLine).success(function () {
                    _this.getRequisitionCollection();
                    for (var i = 0; i < _this.requisition.requisitionLineCollection.requisitionLines.length; i++) {
                        if (_this.requisition.requisitionLineCollection.requisitionLines[i].id === requisitionLine.id) {
                            _this.requisition.requisitionLineCollection.requisitionLines.splice(i, 1);
                            break;
                        }
                    }
                    if (_this.requisition.requisitionLineCollection.requisitionLines.length === 0) {
                        _this.message = _this.deleteOrderLineMessage;
                    }
                    else {
                        _this.message = _this.deleteItemMessage;
                    }
                });
            };
            RequisitionsController.prototype.displayRequisition = function () {
                this.coreService.displayModal(angular.element("#popup-requisition"));
            };
            RequisitionsController.prototype.addAllToCart = function () {
                var _this = this;
                var cartLines = [];
                angular.forEach(this.approvedRequisitionCollection, function (value) {
                    cartLines.push(value);
                });
                if (cartLines.length > 0) {
                    this.cartService.addLineCollection(cartLines).then(function (result) {
                        _this.getRequisitionCollection();
                    });
                }
            };
            RequisitionsController.prototype.convertForPrice = function (requisition) {
                if (!requisition.quoteRequired) {
                    return requisition;
                }
                if (this.requireQuote[requisition.id]) {
                    return this.requireQuote[requisition.id];
                }
                var product = {};
                product.id = requisition.productId;
                product.quoteRequired = requisition.quoteRequired;
                this.requireQuote[requisition.id] = product;
                return product;
            };
            RequisitionsController.prototype.changeApprovedList = function (requisition) {
                if (requisition.isApproved) {
                    this.approvedRequisitionCollection[requisition.id] = requisition;
                }
                else {
                    delete this.approvedRequisitionCollection[requisition.id];
                }
            };
            RequisitionsController.$inject = [
                "requisitionService",
                "cartService",
                "paginationService",
                "coreService"
            ];
            return RequisitionsController;
        })();
        requisitions.RequisitionsController = RequisitionsController;
        angular.module("insite").controller("RequisitionsController", RequisitionsController);
    })(requisitions = insite.requisitions || (insite.requisitions = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.requisitions.controller.js.map