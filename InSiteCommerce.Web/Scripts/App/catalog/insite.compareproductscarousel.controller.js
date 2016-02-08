var insite;
(function (insite) {
    var catalog;
    (function (catalog) {
        "use strict";
        var CompareProductsCarouselController = (function () {
            function CompareProductsCarouselController($scope, productService, $timeout, $window) {
                this.$scope = $scope;
                this.productService = productService;
                this.$timeout = $timeout;
                this.$window = $window;
                this.removeEmptyAttributes = function () {
                    // delete attributes with products left
                    var removeList = [];
                    $(".isc-large-attr-container .pc-attr-list .pc-attr").each(function () {
                        var item = $(this);
                        var hasValues = false;
                        item.find("li span").each(function () {
                            var span = $(this);
                            if (span.html())
                                hasValues = true;
                        });
                        if (!hasValues) {
                            removeList.push(item);
                        }
                    });
                    $(".isc-small-attr-container .pc-attr-list .pc-attr").each(function () {
                        var item = $(this);
                        var hasValues = false;
                        item.find("li").each(function () {
                            hasValues = true;
                        });
                        if (!hasValues) {
                            removeList.push(item);
                        }
                    });
                    for (var i = 0; i < removeList.length; i++)
                        removeList[i].remove();
                };
                this.init();
            }
            CompareProductsCarouselController.prototype.init = function () {
                this.imagesLoaded = 0;
                this.waitForDom(this.maxTries);
            };
            CompareProductsCarouselController.prototype.changeUnitOfMeasure = function (product) {
                this.productService.changeUnitOfMeasure(product);
            };
            CompareProductsCarouselController.prototype.showQuantityBreakPricing = function (product) {
                return product.canShowPrice && product.pricing && !!product.pricing.actualBreakPrices && product.pricing.actualBreakPrices.length > 1 && !product.quoteRequired;
            };
            CompareProductsCarouselController.prototype.showUnitOfMeasure = function (product) {
                return product.canShowUnitOfMeasure && !!product.unitOfMeasureDisplay && !!product.productUnitOfMeasures && product.productUnitOfMeasures.length > 1;
            };
            //If jcarousel is initalized before the DOM is ready and images loaded
            //it will break...
            CompareProductsCarouselController.prototype.waitForDom = function (tries) {
                var _this = this;
                if (isNaN(+tries)) {
                    tries = this.maxTries || 1000; //Max 20000ms
                }
                //If DOM isn"t ready after max number of tries then stop
                if (tries > 0) {
                    this.$timeout(function () {
                        if (_this.isCarouselDomReadyAndImagesLoaded()) {
                            _this.initializeCarousel();
                        }
                        else {
                            _this.waitForDom(tries - 1);
                        }
                    }, 20);
                }
            };
            CompareProductsCarouselController.prototype.isCarouselDomReadyAndImagesLoaded = function () {
                return $(".isc-carousel").length > 0 && this.imagesLoaded === this.productsToCompare.length;
            };
            CompareProductsCarouselController.prototype.initializeCarousel = function () {
                var _this = this;
                $(".pc-attr-carousel-container").addClass("pc-carousel");
                this.carousel = $(".isc-carousel");
                this.carousel.on("jcarousel:create jcarousel:reload", function (event) {
                    var num = $(".top-carousel .items .isc-productContainer").length;
                    var element = $(event.currentTarget), width = element.innerWidth();
                    if (width > 700) {
                        width = width / 4;
                        _this.showCarouselArrows(num > 4);
                    }
                    else if (width > 480) {
                        width = width / 3;
                        _this.showCarouselArrows(num > 3);
                    }
                    else {
                        _this.showCarouselArrows(num > 1);
                    }
                    element.jcarousel("items").css("width", width + "px");
                    _this.equalizeCarouselDimensions();
                }).on("jcarousel:scrollend", function (event, car) {
                    if (car.first().hasClass("isc-productContainer")) {
                        _this.highlightProductAttributes(car.first());
                    }
                }).jcarousel({
                    wrap: "circular"
                });
                // top and bottom move together
                $(".carousel-control-prev").click(function (e) {
                    e.preventDefault();
                    var large = $(".pc-carousel").innerWidth() > 480;
                    _this.carousel.jcarousel("scroll", "-=" + (large ? "2" : "1"));
                });
                $(".carousel-control-next").click(function (e) {
                    e.preventDefault();
                    var large = $(".pc-carousel").innerWidth() > 480;
                    _this.carousel.jcarousel("scroll", "+=" + (large ? "2" : "1"));
                });
                if ($(".btn-panel-compare").length > 0) {
                    $(".btn-panel-compare").on("jcarousel:reload", function (e) {
                        e.preventDefault();
                        $(".pc-carousel").jcarousel("reload");
                    });
                }
                $(".isc-small-attr-container li.pc-attr").click(function (event) {
                    // expand attribute
                    event.preventDefault();
                    event.stopPropagation();
                    if ($("body").innerWidth() < 768) {
                        $("li.pc-attr.pc-active").removeClass("pc-active");
                        if ($(event.currentTarget).hasClass("pc-active")) {
                            $(event.currentTarget).removeClass("pc-active");
                        }
                        else {
                            $(event.currentTarget).addClass("pc-active");
                        }
                    }
                });
                $(".isc-small-attr-container li.pc-value").click(function (event) {
                    // expand attribute section
                    event.preventDefault();
                    event.stopPropagation();
                    if ($("body").innerWidth() < 768) {
                        $("li.pc-value.pc-active").removeClass("pc-active");
                        if ($(event.currentTarget).hasClass("pc-active")) {
                            $(event.currentTarget).removeClass("pc-active");
                        }
                        else {
                            $(event.currentTarget).addClass("pc-active");
                        }
                    }
                });
                // auto scroll to selected item in mobile size
                $(".isc-small-attr-container li.pc-attr .item-block").click(function (event) {
                    var productId = $(event.currentTarget).find("[data-productid]").data("productid");
                    _this.carousel.jcarousel("scroll", $(".isc-productContainer").find("[data-productid='" + productId + "']:first").closest("li").index());
                });
                $(".removeProductFromComparison").click(function (event) {
                    var productId = $(event.currentTarget).data("productid");
                    // remove several nodes relating to this product
                    $("[data-productid=" + productId + "]").closest("li").remove();
                    _this.removeEmptyAttributes();
                    _this.carousel = $(".isc-carousel");
                    _this.carousel.jcarousel("reload");
                    _this.removeComparedProduct({ productId: productId });
                    // update the total number of items
                    var itemCount = _this.carousel.jcarousel("items").length;
                    $(".pc-controls .results-count .result-num").html(itemCount.toString());
                    // update the highlights
                    _this.highlightProductAttributes(_this.currentProductElement());
                    if (itemCount == 0)
                        _this.$window.history.back();
                });
                this.carousel.jcarousel().touch();
            };
            CompareProductsCarouselController.prototype.highlightProductAttributes = function (productElement) {
                if ($("body").innerWidth() < 768) {
                    var productId = productElement.find("[data-productid]").data("productid");
                    $(".isc-small-attr-container li.pc-value .item-block").removeClass("pc-active-item");
                    $(".isc-small-attr-container li.pc-value [data-productid=" + productId + "]:first").closest("li.item-block").addClass("pc-active-item");
                }
            };
            CompareProductsCarouselController.prototype.equalizeCarouselDimensions = function () {
                if ($(".carousel-item-equalize").length > 0) {
                    var maxHeight = -1;
                    var maxThumbHeight = -1;
                    var maxNameHeight = -1;
                    var navHeight = "min-height:" + $("ul.item-list").height();
                    $(".left-nav-2").attr("style", navHeight);
                    // clear the height overrides
                    $(".carousel-item-equalize").each(function () {
                        $(this).find(".item-thumb").height("auto");
                        $(this).find(".item-name").height("auto");
                        $(this).height("auto");
                    });
                    // find the max heights
                    $(".carousel-item-equalize").each(function () {
                        var thumbHeight = $(this).find(".item-thumb").height();
                        maxThumbHeight = maxThumbHeight > thumbHeight ? maxThumbHeight : thumbHeight;
                        var nameHeight = $(this).find(".item-name").height();
                        maxNameHeight = maxNameHeight > nameHeight ? maxNameHeight : nameHeight;
                        var height = $(this).height();
                        maxHeight = maxHeight > height ? maxHeight : height;
                    });
                    // set all to max heights
                    if (maxThumbHeight > 0) {
                        $(".carousel-item-equalize").each(function () {
                            $(this).find(".item-thumb").height(maxThumbHeight);
                            $(this).find(".item-name").height(maxNameHeight);
                            $(this).height(maxHeight);
                            $(this).addClass("eq");
                        });
                    }
                }
            };
            CompareProductsCarouselController.prototype.showCarouselArrows = function (shouldShowArrows) {
                if (shouldShowArrows) {
                    $(".carousel-control-prev,.carousel-control-next").show();
                }
                else {
                    $(".carousel-control-prev,.carousel-control-next").hide();
                }
            };
            CompareProductsCarouselController.prototype.currentProductElement = function () {
                return $(".top-carousel").jcarousel("first");
            };
            CompareProductsCarouselController.$inject = ["$scope", "productService", "$timeout", "$window"];
            return CompareProductsCarouselController;
        })();
        catalog.CompareProductsCarouselController = CompareProductsCarouselController;
        angular.module("insite").controller("CompareProductsCarouselController", CompareProductsCarouselController);
    })(catalog = insite.catalog || (insite.catalog = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.compareproductscarousel.controller.js.map