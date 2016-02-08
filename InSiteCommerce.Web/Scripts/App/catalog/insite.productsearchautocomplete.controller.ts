module insite.catalog {
    "use strict";

    export class ProductSearchAutocompleteController {
        products: AutocompleteProductModel[];
        onsuggestionclick: (suggestion: { data: string }) => any;
        transformresult: any;
        categoryselectorid: string;
        template: string;

        public static $inject = [
            "$scope",
            "$element",
            "$window",
            "$localStorage",
            "sessionService",
            "coreService"
        ];

        constructor(
            protected $scope: ng.IScope,
            protected $element: any,
            protected $window: ng.IWindowService,
            protected $localStorage: core.IWindowStorage,
            protected sessionService: ISessionService,
            protected coreService: core.ICoreService) {
            var $autocomplete = $($element);
            $autocomplete.val("");
            (<any>$autocomplete).autocomplete(this.getAutoCompleteSettings($autocomplete, this.categoryselectorid));
        }

        getAutoCompleteSettings(autoCompleteElement, categoryId) {
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
                    categoryId() {
                        if (categoryId) {
                            if (!categoryElement) {
                                categoryElement = $("#" + categoryId);
                            }
                            if (categoryElement.prop("selectedIndex") === 0) {
                                return "";
                            }
                            return categoryElement.val();
                        } else {
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
        }

        autoCompleteFormatResult(suggestion, currentValue) {
            var pattern = '(' + currentValue.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + ')';
            var name = suggestion.name.replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>');
            var shortDescription = suggestion.shortDescription.replace(new RegExp(pattern, 'gi'), '<strong>$1<\/strong>');
            var html = "<img src='" + suggestion.imagePath + "' /><div><span class='shortDescription'>" + shortDescription + "</span><span class='name'>" + name + "</span></div>";
            return html;
        }
    };

    angular
        .module("insite")
        .controller("ProductSearchAutocompleteController", ProductSearchAutocompleteController);
}
