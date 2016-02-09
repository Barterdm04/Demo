/// <reference path="../core/insite.localstorage.factory.ts" />
module insite.catalog {
    "use strict";

    export class ProductListController {       
                 
        $storage: core.IWindowStorage;
        view: string;        
        attributeValueIds: string[] = [];
        priceFilterMinimums: string[] = [];
        filterCategory: CategoryFacetDto;
        quickSearchTerm = { term: "" };
        getSecondaryData = true;
        query: string;
        ready: boolean = false;
        products: ProductCollectionModel = <any>{};
        settings: ProductSettingsModel;
        categoryId: System.Guid;
        category: CategoryModel;  // regular category page      
        breadCrumbs: BreadCrumbModel[];        
        searchCategoryId: System.Guid;
        searchCategory: CategoryModel; // searching within a category
        page: number = null; //query string page
        pageSize: number = null; // query string pageSize
        sort: string = null; // query string sort
        isSearch: boolean;
        visibleTableProduct: ProductDto;
        customPagerContext: ICustomPagerContext;
        paginationStorageKey = "DefaultPagination-ProductList";
        settingsDeferred: ng.IDeferred<boolean>;
        noResults: boolean;
        pageChanged: boolean = false; // true when the pager has done something to change pages.
        imagesLoaded: number; // number of product images loaded. set by productlistimageonload directive

        public static $inject = [
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

        constructor(
            protected $scope: ng.IScope,
            protected coreService: core.ICoreService,
            protected cartService: cart.ICartService,
            protected productService: IProductService,
            protected compareProductsService: ICompareProductsService,
            protected $rootScope: ng.IRootScopeService,
            protected $window: ng.IWindowService,
            $localStorage: core.IWindowStorage,
            protected paginationService: core.IPaginationService,
            protected $q: ng.IQService)
        {
            this.$storage = $localStorage;
                        
            this.init();
        }

        init() {
            this.settingsDeferred = this.$q.defer();
            this.products.pagination = this.paginationService.getDefaultPagination(this.paginationStorageKey);
            this.cartService.preventCartLoad = true;
            this.filterCategory = { categoryId: null, selected: false, shortDescription: "", count:0, subCategoryDtos: null };
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
                    this.productService.getCategory(this.searchCategoryId.toString()).success(
                        (result: CategoryModel) => {
                            this.searchCategory = result;
                        });
                }
            } else {
                this.resolvePage();
            }

            this.$scope.$on("settingsLoaded",(event, data) => {
                this.settings = data.productSettings;
                this.settingsDeferred.resolve(true);
            });

            this.$rootScope.$on("compareProductsUpdated", () => {
                this.reloadCompareProducts();
            });

            this.$q.when(this.settingsDeferred.promise).then(() => {
                this.applySettings();
            });

            this.initBackButton();
        }

        // set up the handlers for the browser back button using popstate events
        initBackButton() {       
            // update the page when user hits the back button (without leaving the page)
            this.$window.addEventListener("popstate",(e) => {
                this.getQueryStringValues();
                this.getHistoryValues();

                if (this.isSearch) {
                    this.getProductData({
                        query: this.query,
                        categoryId: this.category ? this.category.id : (this.filterCategory ? this.filterCategory.categoryId : null),
                        pageSize: this.pageSize || (this.products.pagination ? this.products.pagination.pageSize : null),
                        sort: this.sort || this.$storage.get("productListSortType", null),
                        page: this.page,
                        attributeValueIds: this.attributeValueIds,
                        priceFilters: this.priceFilterMinimums
                    });
                } else {
                    this.getProductData({
                        categoryId: this.category.id,
                        pageSize: this.pageSize || (this.products.pagination ? this.products.pagination.pageSize : null),
                        sort: this.sort || this.$storage.get("productListSortType", ""),
                        page: this.page,
                        attributeValueIds: this.attributeValueIds,
                        priceFilters: this.priceFilterMinimums
                    });
                }
            });
        }

        // do actions that depend on the product settings
        applySettings() {
            this.view = this.view || this.settings.defaultViewType.toLowerCase();
            if (this.view != "list" && this.view != "grid" && this.view != "table") {
                this.view= "list";
            }

            this.customPagerContext = {
                isSearch: this.isSearch,
                view: this.view,
                selectView: this.selectView,
                attributeTypeFacets: this.products.attributeTypeFacets,
                changeTableColumn: ((attr) => this.changeTableColumn(attr)),
                sortedTableColumns: this.sortedTableColumns()
            };

            this.customPagerContext.selectView(this.customPagerContext.view);
        }

        // get query string values (only query and categoryID are used normally)
        getQueryStringValues() {
            var queryString = this.coreService.getQueryStringCollection();
            this.query = queryString.hasOwnProperty("criteria") ? queryString["criteria"] : "";
            this.page = queryString.hasOwnProperty("page") ? parseInt(queryString["page"]) : null;
            this.pageSize = queryString.hasOwnProperty("pageSize") ? parseInt(queryString["pageSize"]) : null;
            this.sort = queryString.hasOwnProperty("sort") ? queryString["sort"] : null;
            this.searchCategoryId = queryString.hasOwnProperty("categoryId") ? queryString["categoryId"] : "";
        }

        // get context values coming from the browser history (when back button was used)
        getHistoryValues() {
            if (this.$window.history.state) {
                var state = this.$window.history.state;
                this.page = state.page;
                
                if (state.attributeValueIds) {
                    this.attributeValueIds = state.attributeValueIds;
                }
                if (state.filterCategory) {
                    this.filterCategory = state.filterCategory
                }
                if (state.priceFilterMinimums) {
                    this.priceFilterMinimums = state.priceFilterMinimums;
                }
            }
        }

        // set the isBeingCompared boolean on the products 
        reloadCompareProducts() {
            var productsToCompare = this.compareProductsService.getProductIds();
            for (var i in this.products.products) {
                var product = this.products.products[i];
                product.isBeingCompared = lodash.contains(productsToCompare, product.id);
            }
        }

        // tell the hopper to add the product to the compare list
        compareProduct(product: ProductDto) {
            if (!product.isBeingCompared) {                
                if (this.compareProductsService.getProductIds().length > 5) {
                    this.showExceedCompareLimitPopup();
                    return;
                }
                this.compareProductsService.addProduct(product);
            } else {
                this.compareProductsService.removeProduct(product.id.toString());
            }
            product.isBeingCompared = !product.isBeingCompared;
        }
        
        showExceedCompareLimitPopup() {
            (<any>angular.element("#AddToCompareExceedsSixProducts")).foundation("reveal", "open");
        }

        resolvePage() {
            var path = window.location.pathname;
            this.productService.getCatalogPage(path).then(
                (result: CatalogPageModel) => {
                    this.category = result.category;
                    this.categoryId = this.category ? this.category.id : null,
                        this.breadCrumbs = result.breadCrumbs;
                    this.getProductData({
                        categoryId: result.category.id,
                        pageSize: this.pageSize || (this.products.pagination ? this.products.pagination.pageSize : null),
                        sort: this.sort || this.$storage.get("productListSortType", ""),
                        page: this.page,
                        attributeValueIds: this.attributeValueIds
                    });
                },
                (error) => {
                }
            );
        }

        // params: object with query string parameters for the products REST service
        getProductData(params: IProductCollectionParameters, expand?: string[]) {
            var selectedColumns: AttributeTypeFacetDto[];
            if (this.customPagerContext && this.customPagerContext.sortedTableColumns)
                selectedColumns = this.customPagerContext.sortedTableColumns.filter((item: any) => { return item.checked; });

            expand = expand != null ? expand : ["pricing", "attributes", "facets"];
            this.productService.getProductCollectionData(params, expand).then(
                (result: ProductCollectionModel) => {

                    // got product data
                    if (result.exactMatch) {
                        this.$window.location.href = result.products[0].productDetailUrl;
                        return;
                    }                    

                    var oldAttributeTypeFacets = this.products.attributeTypeFacets;
                    if (expand.length == 3) {
                        this.products = result;
                    } else {
                        
                        result.attributeTypeFacets = this.products.attributeTypeFacets;
                        result.categoryFacets = this.products.categoryFacets;
                        result.priceRange = this.products.priceRange;
                        this.products = result;
                    }
                    this.reloadCompareProducts();
                    angular.forEach(this.products.products, product => { product.qtyOrdered = 1; });                    
                    if (this.category == null && this.products.categoryFacets) {
                        this.filterCategory.categoryId = null;
                        var categoryFacet: CategoryFacetDto = lodash.first(lodash.where(this.products.categoryFacets, { "selected": true }));
                        if (categoryFacet) {
                            this.filterCategory.categoryId = categoryFacet.categoryId;
                            this.filterCategory.shortDescription = categoryFacet.shortDescription;
                            this.filterCategory.selected = true;
                            this.searchCategory = null;
                            this.searchCategoryId = null;
                        }
                    }
                    
                    // context for custom pager to handle view selection                    
                    lodash.chain(this.sortedTableColumns())
                        .first(3)
                        .forEach(facet => { (<any>facet).checked = true; });
                 
                    if (this.customPagerContext) {
                        this.customPagerContext.attributeTypeFacets = this.products.attributeTypeFacets;
                        this.customPagerContext.sortedTableColumns = this.sortedTableColumns();

                        var sortedTableColumns = this.customPagerContext.sortedTableColumns;
                        sortedTableColumns.forEach((item: any) => {
                            item.checked = false;
                        });
                        sortedTableColumns.slice(0, Math.min(3, sortedTableColumns.length)).forEach((item: any) => {
                            item.checked = true;
                        });
                    };

                    // allow the page to show
                    this.ready = true;
                    this.noResults = result.products.length === 0;

                    if (this.getSecondaryData) {
                        this.cartService.preventCartLoad = false;
                        this.cartService.getCart();
                        this.getSecondaryData = false;
                    }

                    this.imagesLoaded = 0;
                    if (this.view == "grid") {
                        this.waitForDom();
                    }
                },
                (error) => {
                    // no results
                    this.ready = true;
                    this.noResults = true;
                });
        }

        // Equalize the product grid after all of the images have been downloaded or they will be misaligned (grid view only)
        waitForDom(tries?: number) {

            if (isNaN(+tries)) {
                tries = 1000; //Max 20000ms
            }

            //If DOM isn't ready after max number of tries then stop
            if (tries > 0) {
                setTimeout(() => {
                    if (this.imagesLoaded >= this.products.products.length) {
                        this.cEqualize();
                    } else {
                        this.waitForDom(tries - 1);
                    }
                }, 20);
            }
        }

        // store state in the browser history so back button will work
        storeHistory() {
            var state = {
                page: this.products.pagination.currentPage,
                attributeValueIds: this.attributeValueIds,
                filterCategory: this.filterCategory,
                priceFilterMinimums: this.priceFilterMinimums
            };
            this.$window.history.pushState(state, 'any', null);
        }

        // updates products based on the state of this.pagination and the initial search/category query
        updateProductData() {
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
        }

        attributeValueForSection(sectionFacet: AttributeTypeFacetDto, product: ProductDto) {
            for (var i = 0; i < product.attributeTypes.length; i++) {
                var productSection = product.attributeTypes[i];
                if (productSection.id == sectionFacet.attributeTypeId) {
                    if (productSection.attributeValues.length > 0) {
                        return productSection.attributeValues[0];
                    }
                }
            }
            return null;
        }

        addToCart(product: ProductDto) {
            this.cartService.addLineFromProduct(product);
        }

        changeUnitOfMeasure(product: ProductDto) {
            this.productService.changeUnitOfMeasure(product);
        }

        // called by pager when a different view is selected, and also once at startup
        selectView = (viewName: string) => {
            this.killHeights();
            this.view = viewName;
            // product will be undefined if this was called on startup. let getProductData call waitForDom.
            if (viewName == "grid" && this.products.products) {                
                this.waitForDom();
            } 
            this.$storage.set("productListViewName", viewName);
            this.customPagerContext.view = viewName;
        }

        // in grid view, make all the boxes as big as the biggest one
        cEqualize() {
            var $itemBlocks = $(".item-block");
            if ($itemBlocks.length > 0) {
                var maxHeight = -1;
                var priceHeight = -1;
                var thumbHeight = -1;

                $itemBlocks.each(function() {
                    maxHeight = maxHeight > $(this).find(".item-inf-wrapper").height() ? maxHeight : $(this).find(".item-inf-wrapper").height();
                    priceHeight = priceHeight > $(this).find(".item-price").height() ? priceHeight : $(this).find(".item-price").height();
                    thumbHeight = thumbHeight > $(this).find(".item-thumb").height() ? thumbHeight : $(this).find(".item-thumb").height();
                });
                if (maxHeight > 0) {
                    $itemBlocks.each(function() {
                        $(this).find(".item-inf-wrapper").height(maxHeight);
                        $(this).find(".item-price").height(priceHeight);
                        $(this).find(".item-thumb").height(thumbHeight);
                        $(this).addClass("eq");
                    });
                }
            }
        }

        killHeights() {
            $(".item-inf-wrapper").removeAttr("style");
            $(".item-price").removeAttr("style");
            $(".item-thumb").removeAttr("style");
        }

        openWishListPopup(product: ProductDto) {
            var products: ProductDto[] = [];
            products.push(product);
            this.coreService.openWishListPopup(products);
        }

        // changed handler on table view column check boxes (ui in pager.cshtml)
        changeTableColumn(attribute: AttributeTypeFacetDto) {
            if (this.visibleTableColumns().length > 3) {
                (<any>attribute).checked = false;
                alert("You cannot select more than 3 attributes.");
            }
        }

        // all columns for table view check boxes
        sortedTableColumns(): AttributeTypeFacetDto[] {
            if (!this.products) return [];           
            return lodash.chain(this.products.attributeTypeFacets)                
                .sortBy(["sort", "name"])
                .value();
        }

        // visible (checked) columns for table view
        visibleTableColumns(): any[] {
            if (!this.products) return [];
            return lodash.chain(this.products.attributeTypeFacets)
                .sortBy(["sort", "name"])
                .where({ "checked": true })                
                .value();
        }

        toggleTablePanel(product: ProductDto) {
            if (this.visibleTableProduct == product) {
                this.visibleTableProduct = null;
            } else {
                this.visibleTableProduct = product;
            }
        }

        isTablePanelVisible(product: ProductDto) {
            return this.visibleTableProduct == product;
        }

        pagerPageChanged() {
            this.pageChanged = true;
        }
    }    

    export interface ICustomPagerContext {
        isSearch: boolean;
        view: string;
        selectView: (viewName: string) => void;
        attributeTypeFacets: AttributeTypeFacetDto[];
        changeTableColumn: (attribute: AttributeTypeFacetDto) => void;
        sortedTableColumns: AttributeTypeFacetDto[];
    };    

    angular
        .module("insite")
        .controller("ProductListController", ProductListController);
}

interface JQueryStatic {
    QueryString: {};
}
