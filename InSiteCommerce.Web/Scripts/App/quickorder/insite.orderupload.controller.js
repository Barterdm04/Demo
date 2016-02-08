// controller for the quickorder cms small widget
///<reference path="../../typings/jquery/jquery.d.ts"/>
///<reference path="../../typings/angularjs/angular.d.ts"/>
///<reference path="../catalog/insite.product.service.ts"/>
///<reference path="../cart/insite.cart.service.ts"/>
///<reference path="../../typings/xlsx/xlsx.d.ts"/>
///<reference path="../../typings/papaparse/papaparse.d.ts"/>
var insite;
(function (insite) {
    var quickorder;
    (function (quickorder) {
        "use strict";
        var UploadError;
        (function (UploadError) {
            UploadError[UploadError["None"] = 0] = "None";
            UploadError[UploadError["NotEnough"] = 1] = "NotEnough";
            UploadError[UploadError["ConfigurableProduct"] = 2] = "ConfigurableProduct";
            UploadError[UploadError["StyledProduct"] = 3] = "StyledProduct";
            UploadError[UploadError["Unavailable"] = 4] = "Unavailable";
            UploadError[UploadError["InvalidUnit"] = 5] = "InvalidUnit";
            UploadError[UploadError["NotFound"] = 6] = "NotFound";
            UploadError[UploadError["OutOfStock"] = 7] = "OutOfStock";
        })(UploadError || (UploadError = {}));
        var OrderUploadController = (function () {
            function OrderUploadController($scope, productService, cartService, coreService) {
                this.$scope = $scope;
                this.productService = productService;
                this.cartService = cartService;
                this.coreService = coreService;
                this.fileName = null;
                this.file = null;
                this.firstRowHeading = false;
                this.badFile = false;
                this.uploadLimitExceeded = false;
                this.uploadCancelled = false;
                this.allowCancel = true;
                this.errorProducts = null;
                this.bulkSearch = null;
                this.uploadedItemsCount = 0;
                this.init();
            }
            OrderUploadController.prototype.init = function () {
                this.XLSX = XLSX;
                this.Papa = Papa;
                this.$scope.$on("settingsLoaded", function (event, data) {
                    data.productSettings.showAddToCartConfirmationDialog = false; //We have custom popups for this page
                });
            };
            OrderUploadController.prototype.showOrderUploadSuccessPopup = function () {
                var $popup = angular.element("#orderUploadSuccessPopup");
                if ($popup.length > 0) {
                    this.coreService.displayModal($popup);
                }
            };
            OrderUploadController.prototype.setFile = function (arg) {
                if (arg.files.length > 0) {
                    this.file = arg.files[0];
                    this.$scope.$apply(this.fileName = this.file.name);
                    var fileExtention = this.getFileExtention(this.file.name);
                    this.badFile = ["xls", "xlsx", "csv"].indexOf(fileExtention) === -1;
                    this.uploadLimitExceeded = false;
                    this.$scope.$apply();
                }
            };
            OrderUploadController.prototype.uploadFile = function () {
                var _this = this;
                this.uploadCancelled = false;
                var f = this.file;
                var reader = new FileReader();
                var fileExtention = this.getFileExtention(f.name);
                reader.onload = function (e) {
                    var data = e.target["result"];
                    var arr = _this.fixdata(data);
                    try {
                        if (fileExtention === "xls" || fileExtention === "xlsx") {
                            var wb = _this.XLSX.read(btoa(arr), { type: "base64" });
                            if (wb) {
                                _this.processWb(wb);
                            }
                        }
                        else if (fileExtention === "csv") {
                            _this.processCsv(arr);
                        }
                        else {
                            _this.badFile = true;
                        }
                    }
                    catch (error) {
                        _this.badFile = true;
                    }
                    if (!_this.badFile && !_this.uploadLimitExceeded) {
                        _this.allowCancel = true;
                        _this.coreService.displayModal(angular.element("#orderUploadingPopup"));
                    }
                    else {
                        _this.$scope.$apply();
                    }
                };
                reader.readAsArrayBuffer(f);
            };
            OrderUploadController.prototype.processWb = function (wb) {
                var _this = this;
                wb.SheetNames.forEach(function (sheetName) {
                    var opts = { header: 1 };
                    var roa = _this.XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName], opts);
                    if (roa.length > 0) {
                        if (_this.firstRowHeading) {
                            roa = roa.slice(1, roa.length);
                        }
                        roa = roa.filter(function (r) {
                            return r[0] != null && r[0].length > 0;
                        });
                        if (_this.limitExceeded(roa.length)) {
                            return;
                        }
                        _this.bulkSearch = roa.map(function (r) {
                            var obj = { Name: r[0], Qty: r[1], UM: r[2] };
                            return obj;
                        });
                    }
                });
                this.bulkSearchProducts();
            };
            OrderUploadController.prototype.processCsv = function (data) {
                var _this = this;
                this.bulkSearch = [];
                var newLineIndex = data.lastIndexOf("\r\n");
                if (newLineIndex + 2 === data.length) {
                    data = data.substr(0, newLineIndex);
                }
                var results = Papa.parse(data);
                if (results.errors.length > 0) {
                    this.badFile = true;
                    return;
                }
                var rows = results.data;
                if (this.firstRowHeading) {
                    rows = rows.slice(1, rows.length);
                }
                if (this.limitExceeded(rows.length)) {
                    return;
                }
                rows.forEach(function (s) {
                    if (s[0] == null || s[0].length === 0)
                        return;
                    var objectToAdd = {};
                    objectToAdd["Name"] = s[0];
                    if (s[1]) {
                        objectToAdd["Qty"] = s[1];
                    }
                    if (s[2]) {
                        objectToAdd["UM"] = s[2];
                    }
                    _this.bulkSearch.push(objectToAdd);
                });
                this.bulkSearchProducts();
            };
            OrderUploadController.prototype.bulkSearchProducts = function () {
                var _this = this;
                this.productRequests = [];
                this.errorProducts = [];
                this.products = [];
                this.totalProductToProcess = this.bulkSearch.length;
                this.productProcessed = 0;
                if (this.bulkSearch.length > 0) {
                    this.bulkSearch.forEach(function (item, i) {
                        var index = i + (_this.firstRowHeading ? 2 : 1);
                        var parameter = { extendedNames: [item.Name] };
                        var expandParameter = ["pricing"];
                        var request = _this.productService.getProductCollectionData(parameter, expandParameter);
                        _this.productRequests.push(request);
                        request.then(function (result) {
                            if (_this.uploadCancelled) {
                                return;
                            }
                            var products = result.products;
                            if (products.length === 1) {
                                var product = products[0];
                                var error = _this.validateProduct(product);
                                if (error === 0 /* None */) {
                                    var errorProduct;
                                    var isErrorProdut = false;
                                    product.qtyOrdered = !item.Qty ? 1 : item.Qty;
                                    if (product.productUnitOfMeasures.some(function (u) { return u.unitOfMeasureDisplay === item.UM; })) {
                                        var um = product.productUnitOfMeasures.filter(function (u) { return u.unitOfMeasure === item.UM; })[0];
                                        product.selectedUnitOfMeasure = um.unitOfMeasure;
                                        product.selectedUnitOfMeasureDisplay = um.unitOfMeasureDisplay;
                                        product.unitOfMeasure = um.unitOfMeasure;
                                        product.unitOfMeasureDisplay = um.unitOfMeasureDisplay;
                                    }
                                    else if (item.UM) {
                                        errorProduct = _this.mapProductErrorInfo(index, 5 /* InvalidUnit */, item.Name, product);
                                        errorProduct.umRequested = item.UM;
                                        _this.errorProducts.push(errorProduct);
                                        isErrorProdut = true;
                                    }
                                    if (!isErrorProdut) {
                                        var baseUnits = product.productUnitOfMeasures.filter(function (u) { return u.isDefault; })[0];
                                        var currentUnits = product.productUnitOfMeasures.filter(function (u) { return u.unitOfMeasure === product.unitOfMeasure; })[0];
                                        if (!product.canBackOrder && baseUnits && currentUnits && product.qtyOrdered * currentUnits.qtyPerBaseUnitOfMeasure > product.qtyOnHand * baseUnits.qtyPerBaseUnitOfMeasure) {
                                            errorProduct = _this.mapProductErrorInfo(index, 1 /* NotEnough */, item.Name, product);
                                            errorProduct.conversionRequested = currentUnits.qtyPerBaseUnitOfMeasure;
                                            errorProduct.conversionOnHands = baseUnits.qtyPerBaseUnitOfMeasure;
                                            errorProduct.umOnHands = baseUnits.unitOfMeasureDisplay;
                                            _this.errorProducts.push(errorProduct);
                                        }
                                        else {
                                            _this.products.push(product);
                                        }
                                    }
                                }
                                else {
                                    _this.errorProducts.push(_this.mapProductErrorInfo(index, error, item.Name, product));
                                }
                            }
                            else {
                                _this.errorProducts.push(_this.mapProductErrorInfo(index, 6 /* NotFound */, item.Name, {
                                    qtyOrdered: item.Qty,
                                    unitOfMeasureDisplay: item.UM
                                }));
                            }
                            _this.checkCompletion();
                        }, function (error) {
                            if (error.status === 404) {
                                _this.errorProducts.push(_this.mapProductErrorInfo(index, 6 /* NotFound */, item.Name, {
                                    qtyOrdered: item.Qty,
                                    unitOfMeasureDisplay: item.UM
                                }));
                                _this.checkCompletion();
                            }
                        });
                    });
                }
            };
            OrderUploadController.prototype.checkCompletion = function () {
                var _this = this;
                this.productProcessed++;
                if (!this.uploadCancelled && this.productProcessed === this.totalProductToProcess) {
                    if (this.bulkSearch.length === this.products.length) {
                        this.continueToCart();
                    }
                    else {
                        this.coreService.closeModal("#orderUploadingPopup");
                        setTimeout(function () {
                            _this.coreService.displayModal(angular.element("#orderUploadingIssuesPopup"));
                        }, 250); // Foundation.libs.reveal.settings.animation_speed
                    }
                }
            };
            OrderUploadController.prototype.validateProduct = function (product) {
                if (product.qtyOnHand === 0 && !product.canBackOrder) {
                    return 7 /* OutOfStock */;
                }
                if (product.canConfigure || (product.isConfigured && !product.isFixedConfiguration)) {
                    return 2 /* ConfigurableProduct */;
                }
                if (product.isStyleProductParent) {
                    return 3 /* StyledProduct */;
                }
                if (!product.canAddToCart) {
                    return 4 /* Unavailable */;
                }
                return 0 /* None */;
            };
            OrderUploadController.prototype.fixdata = function (data) {
                var o = "", l = 0, w = 10240;
                for (; l < data.byteLength / w; ++l)
                    o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
                o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
                return o;
            };
            OrderUploadController.prototype.cancelUpload = function () {
                this.uploadCancelled = true;
                this.coreService.closeModal("#orderUploadingPopup");
                for (var i = 0; i < this.productRequests.length; i++) {
                    this.productRequests[i].cancel();
                }
                this.cleanupUploadData();
                this.fileName = null;
                this.file = null;
            };
            OrderUploadController.prototype.closeIssuesPopup = function () {
                this.coreService.closeModal("#orderUploadingIssuesPopup");
                this.cleanupUploadData();
            };
            OrderUploadController.prototype.continueToCart = function (popupSelector) {
                var _this = this;
                if (popupSelector) {
                    this.coreService.closeModal(popupSelector);
                }
                this.allowCancel = false;
                setTimeout(function () {
                    _this.coreService.displayModal(angular.element("#orderUploadingPopup"));
                }, 250);
                this.cartService.addLineCollectionFromProducts(this.products).then(function () {
                    _this.coreService.closeModal("#orderUploadingPopup");
                    _this.uploadedItemsCount = _this.products.length;
                    setTimeout(function () {
                        _this.showOrderUploadSuccessPopup();
                        _this.cleanupUploadData();
                    }, 250);
                });
            };
            OrderUploadController.prototype.getFileExtention = function (fileName) {
                var splittedFileName = fileName.split(".");
                return splittedFileName.length > 0 ? splittedFileName[splittedFileName.length - 1].toLowerCase() : "";
            };
            OrderUploadController.prototype.cleanupUploadData = function () {
                this.productRequests = null;
                this.errorProducts = null;
                this.products = null;
            };
            OrderUploadController.prototype.mapProductErrorInfo = function (index, error, name, product) {
                return {
                    index: index,
                    error: UploadError[error],
                    name: name,
                    qtyRequested: product.qtyOrdered,
                    umRequested: product.unitOfMeasureDisplay,
                    qtyOnHands: product.qtyOnHand
                };
            };
            OrderUploadController.prototype.limitExceeded = function (rowsCount) {
                this.uploadLimitExceeded = rowsCount > 500;
                return this.uploadLimitExceeded;
            };
            OrderUploadController.$inject = ["$scope", "productService", "cartService", "coreService"];
            return OrderUploadController;
        })();
        quickorder.OrderUploadController = OrderUploadController;
        angular.module("insite").controller("OrderUploadController", OrderUploadController);
    })(quickorder = insite.quickorder || (insite.quickorder = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.orderupload.controller.js.map