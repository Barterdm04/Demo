var insite;
(function (insite) {
    var catalog;
    (function (catalog) {
        "use strict";
        var CategoryLeftNavController = (function () {
            function CategoryLeftNavController() {
                this.priceFilterMinimums = []; // a list of the prices selected by the user, used by productlist to request data
                this.quickSearchTerm = { term: "" };
                // local collections
                this.attributeValues = []; // private list of attributes for the ui to display
                this.priceFilters = []; // private list of price ranges for the ui to display
            }
            CategoryLeftNavController.prototype.toggleFilter = function (attributeValueId) {
                this.changeArrayValue(attributeValueId, this.attributeValueIds);
                this.products.pagination.currentPage = 1;
                this.getSelectedFilters();
                this.updateProductData();
            };
            // removes or adds item to array
            CategoryLeftNavController.prototype.changeArrayValue = function (item, array) {
                if (this.products.attributeTypeFacets.some(function (atf) { return atf.attributeTypeId === item; })) {
                    var facet = this.products.attributeTypeFacets.filter(function (atf) { return atf.attributeTypeId === item; })[0];
                    facet.attributeValueFacets.forEach(function (av) {
                        if ($.inArray(av.attributeValueId, array) !== -1) {
                            array.splice(array.indexOf(av.attributeValueId.toString()), 1);
                        }
                    });
                    return;
                }
                if ($.inArray(item, array) === -1) {
                    array.push(item);
                }
                else {
                    array.splice(array.indexOf(item), 1);
                }
            };
            CategoryLeftNavController.prototype.toggleCategory = function (categoryFacet) {
                this.products.pagination.currentPage = 1;
                if (categoryFacet && !categoryFacet.selected) {
                    this.filterCategory.categoryId = categoryFacet.categoryId;
                    this.filterCategory.shortDescription = categoryFacet.shortDescription;
                }
                else {
                    this.filterCategory.categoryId = "";
                }
                this.updateProductData();
            };
            CategoryLeftNavController.prototype.toggleCategoryId = function (categoryId) {
                var categoryFacet;
                this.products.categoryFacets.forEach(function (c) {
                    if (c.categoryId == categoryId)
                        categoryFacet = c;
                });
                this.toggleCategory(categoryFacet);
            };
            CategoryLeftNavController.prototype.togglePriceFilter = function (minimumPrice) {
                this.changeArrayValue(minimumPrice, this.priceFilterMinimums);
                this.products.pagination.currentPage = 1;
                this.getSelectedPriceFilters();
                this.updateProductData();
            };
            CategoryLeftNavController.prototype.priceRangeDisplay = function (priceFacet) {
                return "$" + priceFacet.minimumPrice + " - $" + (priceFacet.maximumPrice > 10 ? priceFacet.maximumPrice - 1 : priceFacet.maximumPrice - .01);
            };
            CategoryLeftNavController.prototype.clearFilters = function () {
                this.products.pagination.currentPage = 1;
                this.filterCategory.categoryId = "";
                this.attributeValueIds.length = 0;
                this.priceFilterMinimums.length = 0;
                this.quickSearchTerm.term = "";
                this.getSelectedFilters();
                this.getSelectedPriceFilters();
                this.updateProductData();
            };
            // builds attributeValues from the attributeValuesIds collection
            CategoryLeftNavController.prototype.getSelectedFilters = function () {
                var _this = this;
                this.attributeValues = [];
                var attributeValuesIdsCopy = this.attributeValueIds.slice();
                this.attributeValueIds.length = 0;
                this.products.attributeTypeFacets.forEach(function (attribute) {
                    attribute.attributeValueFacets.forEach(function (attributeValue) {
                        attributeValuesIdsCopy.forEach(function (attributeValueId) {
                            if (attributeValue.attributeValueId == attributeValueId) {
                                attributeValue.sectionNameDisplay = attribute.nameDisplay;
                                attribute.selectedAttributeValueId = attributeValue.attributeValueId;
                                _this.attributeValues.push(attributeValue);
                                _this.attributeValueIds.push(attributeValueId); // rebuild this.attributeValueIds in case any were removed
                            }
                        });
                    });
                });
            };
            // builds this.priceFilters and this.priceFilterMinimums collections
            CategoryLeftNavController.prototype.getSelectedPriceFilters = function () {
                var _this = this;
                this.priceFilters = [];
                var priceRange = this.products.priceRange;
                var priceFiltersMinimumsCopy = this.priceFilterMinimums.slice();
                this.priceFilterMinimums.length = 0;
                if (priceRange != null && priceRange.priceFacets != null) {
                    priceRange.priceFacets.forEach(function (priceFacet) {
                        priceFiltersMinimumsCopy.forEach(function (priceFilter) {
                            if (priceFacet.minimumPrice.toString() == priceFilter) {
                                _this.priceFilters.push(priceFacet);
                                _this.priceFilterMinimums.push(priceFilter); // rebuild this.priceFilterMinimums in case any were removed
                            }
                        });
                    });
                }
            };
            CategoryLeftNavController.prototype.leftNavBreadCrumbs = function () {
                var list = [];
                for (var i = 1; i < this.breadCrumbs.length - 1; i++) {
                    if (this.breadCrumbs[i].url)
                        list.push(this.breadCrumbs[i]);
                }
                return list;
            };
            CategoryLeftNavController.prototype.quickSearchChanged = function () {
                var _this = this;
                setTimeout(function (term) {
                    if (_this.quickSearchTerm.term == term) {
                        _this.products.pagination.currentPage = 1;
                        _this.updateProductData();
                    }
                }, 250, this.quickSearchTerm.term);
            };
            CategoryLeftNavController.prototype.clearQuickSearch = function () {
                this.quickSearchTerm.term = "";
                this.products.pagination.currentPage = 1;
                this.updateProductData();
            };
            return CategoryLeftNavController;
        })();
        catalog.CategoryLeftNavController = CategoryLeftNavController;
        angular.module("insite").controller("CategoryLeftNavController", CategoryLeftNavController);
    })(catalog = insite.catalog || (insite.catalog = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.categoryleftnav.controller.js.map