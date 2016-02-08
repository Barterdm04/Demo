var insite;
(function (insite) {
    var catalog;
    (function (catalog) {
        "use strict";
        var CrossSellCarouselController = (function () {
            function CrossSellCarouselController($scope, cartService, coreService, productService, $timeout) {
                this.$scope = $scope;
                this.cartService = cartService;
                this.coreService = coreService;
                this.productService = productService;
                this.$timeout = $timeout;
                this.init();
            }
            CrossSellCarouselController.prototype.init = function () {
                var _this = this;
                this.$scope.$on("settingsLoaded", function (event, data) {
                    _this.productSettings = data.productSettings;
                });
                this.crossSellProducts = [];
                this.imagesLoaded = 0;
                if (!this.productCrossSell) {
                    this.productService.getCrossSells(null).then(function (result) {
                        _this.crossSellProducts = result.products;
                        _this.imagesLoaded = 0;
                        _this.waitForDom(_this.maxTries);
                    }, function (error) {
                    });
                }
                else {
                    this.waitForProduct(this.maxTries);
                }
            };
            CrossSellCarouselController.prototype.addToCart = function (product) {
                this.cartService.addLineFromProduct(product);
            };
            CrossSellCarouselController.prototype.changeUnitOfMeasure = function (product) {
                this.productService.changeUnitOfMeasure(product);
            };
            CrossSellCarouselController.prototype.openWishListPopup = function (product) {
                var products = [];
                products.push(product);
                this.coreService.openWishListPopup(products);
            };
            CrossSellCarouselController.prototype.showCrossSellCarousel = function () {
                return !!this.crossSellProducts && this.crossSellProducts.length > 0 && this.productSettings;
            };
            CrossSellCarouselController.prototype.showQuantityBreakPricing = function (product) {
                return product.canShowPrice && product.pricing && !!product.pricing.actualBreakPrices && product.pricing.actualBreakPrices.length > 1 && !product.quoteRequired;
            };
            CrossSellCarouselController.prototype.showUnitOfMeasure = function (product) {
                return product.canShowUnitOfMeasure && !!product.unitOfMeasureDisplay && !!product.productUnitOfMeasures && product.productUnitOfMeasures.length > 1 && this.productSettings.alternateUnitsOfMeasure;
            };
            CrossSellCarouselController.prototype.waitForProduct = function (tries) {
                var _this = this;
                if (isNaN(+tries)) {
                    tries = this.maxTries || 1000; //Max 20000ms
                }
                if (tries > 0) {
                    this.$timeout(function () {
                        if (_this.isProductLoaded()) {
                            _this.crossSellProducts = _this.product.crossSells;
                            _this.imagesLoaded = 0;
                            _this.waitForDom(_this.maxTries);
                        }
                        else {
                            _this.waitForProduct(tries - 1);
                        }
                    }, 20);
                }
            };
            //If jcarousel is initalized before the DOM is ready and images loaded
            //it will break...
            CrossSellCarouselController.prototype.waitForDom = function (tries) {
                var _this = this;
                if (isNaN(+tries)) {
                    tries = this.maxTries || 1000; //Max 20000ms
                }
                //If DOM isn't ready after max number of tries then stop
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
            CrossSellCarouselController.prototype.isCarouselDomReadyAndImagesLoaded = function () {
                return $(".cs-carousel").length > 0 && this.imagesLoaded >= this.crossSellProducts.length;
            };
            CrossSellCarouselController.prototype.isProductLoaded = function () {
                return this.product && typeof this.product === "object";
            };
            CrossSellCarouselController.prototype.initializeCarousel = function () {
                var _this = this;
                this.carousel = $(".cs-carousel").jcarousel();
                this.carousel.on("jcarousel:reload", function () { return _this.reloadCarousel(); }).jcarousel({
                    wrap: "circular"
                });
                this.setCarouselSpeed();
                this.carousel.touch();
                $(window).resize(function () {
                    _this.carousel.jcarousel("reload");
                    _this.setCarouselSpeed();
                    _this.carousel.touch();
                });
            };
            CrossSellCarouselController.prototype.setCarouselSpeed = function () {
                if (this.carousel.innerWidth() > 768) {
                    $("div[role='cross-sells'] .carousel-control-prev").jcarouselControl({
                        target: "-=2"
                    });
                    $("div[role='cross-sells'] .carousel-control-next").jcarouselControl({
                        target: "+=2"
                    });
                }
                else {
                    $("div[role='cross-sells'] .carousel-control-prev").jcarouselControl({
                        target: "-=1"
                    });
                    $("div[role='cross-sells'] .carousel-control-next").jcarouselControl({
                        target: "+=1"
                    });
                }
            };
            CrossSellCarouselController.prototype.reloadCarousel = function () {
                var num = $(".cs-carousel .isc-productContainer").length;
                var el = this.carousel, width = el.innerWidth();
                if (width > 768) {
                    width = width / 4;
                    this.showCarouselArrows(num > 4);
                }
                else if (width > 480) {
                    width = width / 3;
                    this.showCarouselArrows(num > 3);
                }
                else {
                    this.showCarouselArrows(num > 1);
                }
                el.jcarousel("items").css("width", width + "px");
                this.equalizeCarouselDimensions();
            };
            CrossSellCarouselController.prototype.equalizeCarouselDimensions = function () {
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
                    });
                    // set all to max heights
                    if (maxThumbHeight > 0) {
                        $(".carousel-item-equalize").each(function () {
                            $(this).find(".item-thumb").height(maxThumbHeight);
                            $(this).find(".item-name").height(maxNameHeight);
                            var height = $(this).height();
                            maxHeight = maxHeight > height ? maxHeight : height;
                            $(this).addClass("eq");
                        });
                        $(".carousel-item-equalize").height(maxHeight);
                    }
                }
            };
            CrossSellCarouselController.prototype.showCarouselArrows = function (shouldShowArrows) {
                if (shouldShowArrows) {
                    $(".carousel-control-prev,.carousel-control-next").show();
                }
                else {
                    $(".carousel-control-prev,.carousel-control-next").hide();
                }
            };
            CrossSellCarouselController.$inject = ["$scope", "cartService", "coreService", "productService", "$timeout"];
            return CrossSellCarouselController;
        })();
        catalog.CrossSellCarouselController = CrossSellCarouselController;
        angular.module("insite").controller("CrossSellCarouselController", CrossSellCarouselController);
    })(catalog = insite.catalog || (insite.catalog = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.crosssellcarousel.controller.js.map