/// <reference path="../core/insite.localstorage.factory.ts" />
var insite;
(function (insite) {
    var catalog;
    (function (catalog) {
        "use strict";
        var ProductListController = (function () {
            function ProductListController($scope, coreService, cartService, productService, compareProductsService, $rootScope, $window, $localStorage, paginationService, $q) {
                var _this = this;
                this.$scope = $scope;
                this.coreService = coreService;
                this.cartService = cartService;
                this.productService = productService;
                this.compareProductsService = compareProductsService;
                this.$rootScope = $rootScope;
                this.$window = $window;
                this.paginationService = paginationService;
                this.$q = $q;
                this.attributeValueIds = [];
                this.priceFilterMinimums = [];
                this.quickSearchTerm = { term: "" };
                this.getSecondaryData = true;
                this.ready = false;
                this.products = {};
                this.page = null; //query string page
                this.pageSize = null; // query string pageSize
                this.sort = null; // query string sort
                this.paginationStorageKey = "DefaultPagination-ProductList";
                this.pageChanged = false; // true when the pager has done something to change pages.
                // called by pager when a different view is selected, and also once at startup
                this.selectView = function (viewName) {
                    _this.killHeights();
                    _this.view = viewName;
                    // product will be undefined if this was called on startup. let getProductData call waitForDom.
                    if (viewName == "grid" && _this.products.products) {
                        _this.waitForDom();
                    }
                    _this.$storage.set("productListViewName", viewName);
                    _this.customPagerContext.view = viewName;
                };
                this.$storage = $localStorage;
                this.init();
            }
            ProductListController.prototype.init = function () {
                var _this = this;
                this.settingsDeferred = this.$q.defer();
                this.products.pagination = this.paginationService.getDefaultPagination(this.paginationStorageKey);
                this.cartService.preventCartLoad = true;
                this.filterCategory = { categoryId: null, selected: false, shortDescription: "", count: 0, subCategoryDtos: null };
                this.view = this.$storage.get("productListViewName");
                this.cartService.preventCartLoad = true;
                this.getQueryStringValues();
                this.getHistoryValues();
                this.isSearch = this.query !== "";
                if (this.isSearch && this.view == "table") {
                    this.view = "list";
                }
                if (this.isSearch) {
                    this.getProductData({
                        query: this.query,
                        categoryId: this.searchCategoryId ? this.searchCategoryId : (this.filterCategory ? this.filterCategory.categoryId : null),
                        pageSize: this.pageSize || (this.products.pagination ? this.products.pagination.pageSize : null),
                        sort: this.sort || this.$storage.get("productListSortType", null),
                        page: this.page,
                        attributeValueIds: this.attributeValueIds
                    });
                    if (this.searchCategoryId) {
                        // searchCategory is only used when a category is selected in the header dropdown with a search
                        this.productService.getCategory(this.searchCategoryId.toString()).success(function (result) {
                            _this.searchCategory = result;
                        });
                    }
                }
                else {
                    this.resolvePage();
                }
                this.$scope.$on("settingsLoaded", function (event, data) {
                    _this.settings = data.productSettings;
                    _this.settingsDeferred.resolve(true);
                });
                this.$rootScope.$on("compareProductsUpdated", function () {
                    _this.reloadCompareProducts();
                });
                this.$q.when(this.settingsDeferred.promise).then(function () {
                    _this.applySettings();
                });
                this.initBackButton();
            };
            // set up the handlers for the browser back button using popstate events
            ProductListController.prototype.initBackButton = function () {
                var _this = this;
                // update the page when user hits the back button (without leaving the page)
                this.$window.addEventListener("popstate", function (e) {
                    _this.getQueryStringValues();
                    _this.getHistoryValues();
                    if (_this.isSearch) {
                        _this.getProductData({
                            query: _this.query,
                            categoryId: _this.category ? _this.category.id : (_this.filterCategory ? _this.filterCategory.categoryId : null),
                            pageSize: _this.pageSize || (_this.products.pagination ? _this.products.pagination.pageSize : null),
                            sort: _this.sort || _this.$storage.get("productListSortType", null),
                            page: _this.page,
                            attributeValueIds: _this.attributeValueIds,
                            priceFilters: _this.priceFilterMinimums
                        });
                    }
                    else {
                        _this.getProductData({
                            categoryId: _this.category.id,
                            pageSize: _this.pageSize || (_this.products.pagination ? _this.products.pagination.pageSize : null),
                            sort: _this.sort || _this.$storage.get("productListSortType", ""),
                            page: _this.page,
                            attributeValueIds: _this.attributeValueIds,
                            priceFilters: _this.priceFilterMinimums
                        });
                    }
                });
            };
            // do actions that depend on the product settings
            ProductListController.prototype.applySettings = function () {
                var _this = this;
                this.view = this.view || this.settings.defaultViewType.toLowerCase();
                if (this.view != "list" && this.view != "grid" && this.view != "table") {
                    this.view = "list";
                }
                this.customPagerContext = {
                    isSearch: this.isSearch,
                    view: this.view,
                    selectView: this.selectView,
                    attributeTypeFacets: this.products.attributeTypeFacets,
                    changeTableColumn: (function (attr) { return _this.changeTableColumn(attr); }),
                    sortedTableColumns: this.sortedTableColumns()
                };
                this.customPagerContext.selectView(this.customPagerContext.view);
            };
            // get query string values (only query and categoryID are used normally)
            ProductListController.prototype.getQueryStringValues = function () {
                var queryString = this.coreService.getQueryStringCollection();
                this.query = queryString.hasOwnProperty("criteria") ? queryString["criteria"] : "";
                this.page = queryString.hasOwnProperty("page") ? parseInt(queryString["page"]) : null;
                this.pageSize = queryString.hasOwnProperty("pageSize") ? parseInt(queryString["pageSize"]) : null;
                this.sort = queryString.hasOwnProperty("sort") ? queryString["sort"] : null;
                this.searchCategoryId = queryString.hasOwnProperty("categoryId") ? queryString["categoryId"] : "";
            };
            // get context values coming from the browser history (when back button was used)
            ProductListController.prototype.getHistoryValues = function () {
                if (this.$window.history.state) {
                    var state = this.$window.history.state;
                    this.page = state.page;
                    if (state.attributeValueIds) {
                        this.attributeValueIds = state.attributeValueIds;
                    }
                    if (state.filterCategory) {
                        this.filterCategory = state.filterCategory;
                    }
                    if (state.priceFilterMinimums) {
                        this.priceFilterMinimums = state.priceFilterMinimums;
                    }
                }
            };
            // set the isBeingCompared boolean on the products 
            ProductListController.prototype.reloadCompareProducts = function () {
                var productsToCompare = this.compareProductsService.getProductIds();
                for (var i in this.products.products) {
                    var product = this.products.products[i];
                    product.isBeingCompared = lodash.contains(productsToCompare, product.id);
                }
            };
            // tell the hopper to add the product to the compare list
            ProductListController.prototype.compareProduct = function (product) {
                if (!product.isBeingCompared) {
                    if (this.compareProductsService.getProductIds().length > 5) {
                        this.showExceedCompareLimitPopup();
                        return;
                    }
                    this.compareProductsService.addProduct(product);
                }
                else {
                    this.compareProductsService.removeProduct(product.id.toString());
                }
                product.isBeingCompared = !product.isBeingCompared;
            };
            ProductListController.prototype.showExceedCompareLimitPopup = function () {
                angular.element("#AddToCompareExceedsSixProducts").foundation("reveal", "open");
            };
            ProductListController.prototype.resolvePage = function () {
                var _this = this;
                var path = window.location.pathname;
                this.productService.getCatalogPage(path).then(function (result) {
                    _this.category = result.category;
                    _this.categoryId = _this.category ? _this.category.id : null, _this.breadCrumbs = result.breadCrumbs;
                    _this.getProductData({
                        categoryId: result.category.id,
                        pageSize: _this.pageSize || (_this.products.pagination ? _this.products.pagination.pageSize : null),
                        sort: _this.sort || _this.$storage.get("productListSortType", ""),
                        page: _this.page,
                        attributeValueIds: _this.attributeValueIds
                    });
                }, function (error) {
                });
            };
            // params: object with query string parameters for the products REST service
            ProductListController.prototype.getProductData = function (params, expand) {
                var _this = this;
                var selectedColumns;
                if (this.customPagerContext && this.customPagerContext.sortedTableColumns)
                    selectedColumns = this.customPagerContext.sortedTableColumns.filter(function (item) {
                        return item.checked;
                    });
                expand = expand != null ? expand : ["pricing", "attributes", "facets"];
                this.productService.getProductCollectionData(params, expand).then(function (result) {
                    // got product data
                    if (result.exactMatch) {
                        _this.$window.location.href = result.products[0].productDetailUrl;
                        return;
                    }
                    var oldAttributeTypeFacets = _this.products.attributeTypeFacets;
                    if (expand.length == 3) {
                        _this.products = result;
                    }
                    else {
                        result.attributeTypeFacets = _this.products.attributeTypeFacets;
                        result.categoryFacets = _this.products.categoryFacets;
                        result.priceRange = _this.products.priceRange;
                        _this.products = result;
                    }
                    _this.reloadCompareProducts();
                    angular.forEach(_this.products.products, function (product) {
                        product.qtyOrdered = 1;
                    });
                    if (_this.category == null && _this.products.categoryFacets) {
                        _this.filterCategory.categoryId = null;
                        var categoryFacet = lodash.first(lodash.where(_this.products.categoryFacets, { "selected": true }));
                        if (categoryFacet) {
                            _this.filterCategory.categoryId = categoryFacet.categoryId;
                            _this.filterCategory.shortDescription = categoryFacet.shortDescription;
                            _this.filterCategory.selected = true;
                            _this.searchCategory = null;
                            _this.searchCategoryId = null;
                        }
                    }
                    // context for custom pager to handle view selection                    
                    lodash.chain(_this.sortedTableColumns()).first(3).forEach(function (facet) {
                        facet.checked = true;
                    });
                    if (_this.customPagerContext) {
                        _this.customPagerContext.attributeTypeFacets = _this.products.attributeTypeFacets;
                        _this.customPagerContext.sortedTableColumns = _this.sortedTableColumns();
                        var sortedTableColumns = _this.customPagerContext.sortedTableColumns;
                        sortedTableColumns.forEach(function (item) {
                            item.checked = false;
                        });
                        sortedTableColumns.slice(0, Math.min(3, sortedTableColumns.length)).forEach(function (item) {
                            item.checked = true;
                        });
                    }
                    ;
                    // allow the page to show
                    _this.ready = true;
                    _this.noResults = result.products.length === 0;
                    if (_this.getSecondaryData) {
                        _this.cartService.preventCartLoad = false;
                        _this.cartService.getCart();
                        _this.getSecondaryData = false;
                    }
                    _this.imagesLoaded = 0;
                    if (_this.view == "grid") {
                        _this.waitForDom();
                    }
                }, function (error) {
                    // no results
                    _this.ready = true;
                    _this.noResults = true;
                });
            };
            // Equalize the product grid after all of the images have been downloaded or they will be misaligned (grid view only)
            ProductListController.prototype.waitForDom = function (tries) {
                var _this = this;
                if (isNaN(+tries)) {
                    tries = 1000; //Max 20000ms
                }
                //If DOM isn't ready after max number of tries then stop
                if (tries > 0) {
                    setTimeout(function () {
                        if (_this.imagesLoaded >= _this.products.products.length) {
                            _this.cEqualize();
                        }
                        else {
                            _this.waitForDom(tries - 1);
                        }
                    }, 20);
                }
            };
            // store state in the browser history so back button will work
            ProductListController.prototype.storeHistory = function () {
                var state = {
                    page: this.products.pagination.currentPage,
                    attributeValueIds: this.attributeValueIds,
                    filterCategory: this.filterCategory,
                    priceFilterMinimums: this.priceFilterMinimums
                };
                this.$window.history.pushState(state, 'any', null);
            };
            // updates products based on the state of this.pagination and the initial search/category query
            ProductListController.prototype.updateProductData = function () {
                this.storeHistory();
                this.$storage.set("productListSortType", this.products.pagination.sortType);
                var params = {
                    categoryId: this.category ? this.category.id : (this.filterCategory ? this.filterCategory.categoryId : null),
                    query: this.query + (this.quickSearchTerm.term ? (" " + this.quickSearchTerm.term) : ""),
                    page: this.products.pagination.currentPage,
                    pageSize: this.products.pagination.pageSize,
                    sort: this.products.pagination.sortType,
                    attributeValueIds: this.attributeValueIds,
                    priceFilters: this.priceFilterMinimums
                };
                this.getProductData(params, this.pageChanged ? ["pricing", "attributes"] : null);
                this.pageChanged = false;
            };
            ProductListController.prototype.attributeValueForSection = function (sectionFacet, product) {
                for (var i = 0; i < product.attributeTypes.length; i++) {
                    var productSection = product.attributeTypes[i];
                    if (productSection.id == sectionFacet.attributeTypeId) {
                        if (productSection.attributeValues.length > 0) {
                            return productSection.attributeValues[0];
                        }
                    }
                }
                return null;
            };
            ProductListController.prototype.addToCart = function (product) {
                this.cartService.addLineFromProduct(product);
            };
            ProductListController.prototype.changeUnitOfMeasure = function (product) {
                this.productService.changeUnitOfMeasure(product);
            };
            // in grid view, make all the boxes as big as the biggest one
            ProductListController.prototype.cEqualize = function () {
                var $itemBlocks = $(".item-block");
                if ($itemBlocks.length > 0) {
                    var maxHeight = -1;
                    var priceHeight = -1;
                    var thumbHeight = -1;
                    $itemBlocks.each(function () {
                        maxHeight = maxHeight > $(this).find(".item-inf-wrapper").height() ? maxHeight : $(this).find(".item-inf-wrapper").height();
                        priceHeight = priceHeight > $(this).find(".item-price").height() ? priceHeight : $(this).find(".item-price").height();
                        thumbHeight = thumbHeight > $(this).find(".item-thumb").height() ? thumbHeight : $(this).find(".item-thumb").height();
                    });
                    if (maxHeight > 0) {
                        $itemBlocks.each(function () {
                            $(this).find(".item-inf-wrapper").height(maxHeight);
                            $(this).find(".item-price").height(priceHeight);
                            $(this).find(".item-thumb").height(thumbHeight);
                            $(this).addClass("eq");
                        });
                    }
                }
            };
            ProductListController.prototype.killHeights = function () {
                $(".item-inf-wrapper").removeAttr("style");
                $(".item-price").removeAttr("style");
                $(".item-thumb").removeAttr("style");
            };
            ProductListController.prototype.openWishListPopup = function (product) {
                var products = [];
                products.push(product);
                this.coreService.openWishListPopup(products);
            };
            // changed handler on table view column check boxes (ui in pager.cshtml)
            ProductListController.prototype.changeTableColumn = function (attribute) {
                if (this.visibleTableColumns().length > 3) {
                    attribute.checked = false;
                    alert("You cannot select more than 3 attributes.");
                }
            };
            // all columns for table view check boxes
            ProductListController.prototype.sortedTableColumns = function () {
                if (!this.products)
                    return [];
                return lodash.chain(this.products.attributeTypeFacets).sortBy(["sort", "name"]).value();
            };
            // visible (checked) columns for table view
            ProductListController.prototype.visibleTableColumns = function () {
                if (!this.products)
                    return [];
                return lodash.chain(this.products.attributeTypeFacets).sortBy(["sort", "name"]).where({ "checked": true }).value();
            };
            ProductListController.prototype.toggleTablePanel = function (product) {
                if (this.visibleTableProduct == product) {
                    this.visibleTableProduct = null;
                }
                else {
                    this.visibleTableProduct = product;
                }
            };
            ProductListController.prototype.isTablePanelVisible = function (product) {
                return this.visibleTableProduct == product;
            };
            ProductListController.prototype.pagerPageChanged = function () {
                this.pageChanged = true;
            };
            ProductListController.$inject = [
                "$scope",
                "coreService",
                "cartService",
                "productService",
                "compareProductsService",
                "$rootScope",
                "$window",
                "$localStorage",
                "paginationService",
                "$q"
            ];
            return ProductListController;
        })();
        catalog.ProductListController = ProductListController;
        ;
        angular.module("insite").controller("ProductListController", ProductListController);
    })(catalog = insite.catalog || (insite.catalog = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.productlist.controller.js.map