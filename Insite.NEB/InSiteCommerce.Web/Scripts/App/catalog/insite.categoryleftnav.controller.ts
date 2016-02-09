module insite.catalog {
    "use strict";

   export class CategoryLeftNavController {

        // shared scope
        products: ProductCollectionModel; // full product collection model from the last rest api call
        breadCrumbs: BreadCrumbModel[];        
        updateProductData: () => void; // callback to request new product data
        attributeValueIds: string[]; // a list of selected atributes, used by productlist to request data
        filterCategory: CategoryFacetDto; // category selected by user, used by productlist to request data
        priceFilterMinimums: string[] = []; // a list of the prices selected by the user, used by productlist to request data
        quickSearchTerm = { term: "" };

        // local collections
        attributeValues: AttributeValueFacetDto[] = []; // private list of attributes for the ui to display
        priceFilters: PriceFacetDto[] = []; // private list of price ranges for the ui to display

        toggleFilter(attributeValueId: string) {
            this.changeArrayValue(attributeValueId, this.attributeValueIds);
            this.products.pagination.currentPage = 1;
            this.getSelectedFilters();
            this.updateProductData();
        }

        // removes or adds item to array
        changeArrayValue(item: string, array: string[]) {
            if (this.products.attributeTypeFacets.some(atf => atf.attributeTypeId === item)) {
                var facet = this.products.attributeTypeFacets.filter(atf => atf.attributeTypeId === item)[0];
                facet.attributeValueFacets.forEach((av) => {
                    if ($.inArray(av.attributeValueId, array) !== -1) {
                        array.splice(array.indexOf(av.attributeValueId.toString()), 1);
                    }
                });
                return;
            }
            if ($.inArray(item, array) === -1) {
                array.push(item);
            } else {
                array.splice(array.indexOf(item), 1);
            }
        }

        toggleCategory(categoryFacet: CategoryFacetDto) {
            this.products.pagination.currentPage = 1;
            if (categoryFacet && !categoryFacet.selected) {
                this.filterCategory.categoryId = categoryFacet.categoryId;
                this.filterCategory.shortDescription = categoryFacet.shortDescription;
            } else {
                this.filterCategory.categoryId = "";
            }
            this.updateProductData();
        }

        toggleCategoryId(categoryId: string) {
            var categoryFacet: CategoryFacetDto;
            this.products.categoryFacets.forEach((c) => {
                if (c.categoryId == categoryId) categoryFacet = c;
            });
            this.toggleCategory(categoryFacet);
        }

        togglePriceFilter(minimumPrice: string) {
            this.changeArrayValue(minimumPrice, this.priceFilterMinimums);
            this.products.pagination.currentPage = 1;
            this.getSelectedPriceFilters();
            this.updateProductData();
        }

        priceRangeDisplay(priceFacet: PriceFacetDto) {
            return "$" + priceFacet.minimumPrice + " - $" + (priceFacet.maximumPrice > 10 ? priceFacet.maximumPrice - 1 : priceFacet.maximumPrice - .01);
        }

        clearFilters() {
            this.products.pagination.currentPage = 1;
            this.filterCategory.categoryId = "";
            this.attributeValueIds.length = 0;
            this.priceFilterMinimums.length = 0;
            this.quickSearchTerm.term = "";
            this.getSelectedFilters();
            this.getSelectedPriceFilters();
            this.updateProductData();
        }

        // builds attributeValues from the attributeValuesIds collection
        getSelectedFilters() {
            this.attributeValues = [];
            var attributeValuesIdsCopy = this.attributeValueIds.slice();
            this.attributeValueIds.length = 0;
            this.products.attributeTypeFacets.forEach((attribute) => { //
                attribute.attributeValueFacets.forEach((attributeValue) => {
                    attributeValuesIdsCopy.forEach((attributeValueId) => {
                        if (attributeValue.attributeValueId == attributeValueId) {
                            (<any>attributeValue).sectionNameDisplay = attribute.nameDisplay;
                            (<any>attribute).selectedAttributeValueId = attributeValue.attributeValueId;
                            this.attributeValues.push(attributeValue);
                            this.attributeValueIds.push(attributeValueId); // rebuild this.attributeValueIds in case any were removed
                        }
                    });
                });
            });
        }

        // builds this.priceFilters and this.priceFilterMinimums collections
        getSelectedPriceFilters() {
            this.priceFilters = [];            
            var priceRange = this.products.priceRange;
            var priceFiltersMinimumsCopy = this.priceFilterMinimums.slice(); 
            this.priceFilterMinimums.length = 0;
            if (priceRange != null && priceRange.priceFacets != null) {
                priceRange.priceFacets.forEach((priceFacet) => {
                    priceFiltersMinimumsCopy.forEach((priceFilter) => {
                        if (priceFacet.minimumPrice.toString() == priceFilter) {
                            this.priceFilters.push(priceFacet);
                            this.priceFilterMinimums.push(priceFilter); // rebuild this.priceFilterMinimums in case any were removed
                        }
                    });
                });                
            }
        }

        leftNavBreadCrumbs(): BreadCrumbModel[] {
            var list: BreadCrumbModel[] = [];
            for (var i = 1; i < this.breadCrumbs.length - 1; i++) {
                if (this.breadCrumbs[i].url)
                    list.push(this.breadCrumbs[i]);
            }
            return list;
        }

        quickSearchChanged() {
            setTimeout((term: string) => {
                    if (this.quickSearchTerm.term == term) {
                        this.products.pagination.currentPage = 1;
                        this.updateProductData();
                    }
                },
                250,
                this.quickSearchTerm.term);
        }

        clearQuickSearch() {
            this.quickSearchTerm.term = "";
            this.products.pagination.currentPage = 1;
            this.updateProductData();
        }
    }

   angular.module("insite")
       .controller("CategoryLeftNavController", CategoryLeftNavController);
} 