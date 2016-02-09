module insite.account {
    "use strict";

    export class CustomSelectCustomerController extends SelectCustomerController{

        
    }

    angular
        .module("insite")
        .controller("SelectCustomerController", SelectCustomerController)
        .filter('removeSequences', function() {
            return function(items) {
                var filtered = [];
                angular.forEach(items, function(item) {
                    if (item.label) {
                        item.label = item.label.replace(item.customerNumber, '');
                    }

                    filtered.push(item);
                });
                return filtered;
            };
        });
}
