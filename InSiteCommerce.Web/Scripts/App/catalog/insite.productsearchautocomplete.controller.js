var insite;
(function (insite) {
    var catalog;
    (function (catalog) {
        "use strict";
        var ProductSearchAutocompleteController = (function () {
            function ProductSearchAutocompleteController($scope, $element, $window, $localStorage, sessionService, coreService) {
                this.$scope = $scope;
                this.$element = $element;
                this.$window = $window;
                this.$localStorage = $localStorage;
                this.sessionService = sessionService;
                this.coreService = coreService;
                var $autocomplete = $($element);
                $autocomplete.val("");
                $autocomplete.autocomplete(this.getAutoCompleteSettings($autocomplete, this.categoryselectorid));
            }
            ProductSearchAutocompleteController.prototype.getAutoCompleteSettings = function (autoCompleteElement, categoryId) {
                var context = this.$localStorage.getObject("context") || {};
                context.pageUrl = this.$window.location.href;
                var accessToken = this.sessionService.retrieveAccessToken();
                var categoryElement = null;
                return {
                    serviceUrl: autoCompleteElement.attr("data-autocompleteUrl"),
                    ajaxSettings: {
                        headers: {
                            'Authorization': accessToken ? ("Bearer " + accessToken) : ""
                        }
                    },
                    params: {
                        categoryId: function () {
                            if (categoryId) {
                                if (!categoryElement) {
                                    categoryElement = $("#" + categoryId);
                                }
                                if (categoryElement.prop("selectedIndex") === 0) {
                                    return "";
                                }
                                return categoryElement.val();
                            }
                            else {
                                return "";
                            }
                        }
                    },
                    paramName: "query",
                    minChars: 3,
                    deferRequestBy: 200,
                    onSelect: this.onsuggestionclick,
                    transformResult: this.transformresult,
                    formatResult: this.autoCompleteFormatResult,
                    triggerSelectOnValidInput: false,
                    onSearchStart: function (query) {
                        if (!query.query.toString().trim())
                            return false;
                        return true;
                    }
                };
            };
            ProductSearchAutocompleteController.prototype.autoCompleteFormatResult = function (suggestion, currentValue) {
                var pattern = '(' + currentValue.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + ')';
                var name = suggestion.name.replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>');
                var shortDescription = suggestion.shortDescription.replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>');
                var html = "<img src='" + suggestion.imagePath + "' /><div><span class='shortDescription'>" + shortDescription + "</span><span class='name'>" + name + "</span></div>";
                return html;
            };
            ProductSearchAutocompleteController.$inject = [
                "$scope",
                "$element",
                "$window",
                "$localStorage",
                "sessionService",
                "coreService"
            ];
            return ProductSearchAutocompleteController;
        })();
        catalog.ProductSearchAutocompleteController = ProductSearchAutocompleteController;
        ;
        angular.module("insite").controller("ProductSearchAutocompleteController", ProductSearchAutocompleteController);
    })(catalog = insite.catalog || (insite.catalog = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.productsearchautocomplete.controller.js.map