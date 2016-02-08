(function (angular) {
    "use strict";
    angular
        .module("insite")
        .directive("iscRequiresQuote", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                scope: false,
                templateUrl: coreService.getApiUri("/Directives/Rfq/RequiresQuote")
            };
        }])
        .directive("iscUserSelector", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                scope: false,
                templateUrl: coreService.getApiUri("/Directives/Rfq/UserSelector")
            };
        }])
        .directive("iscRequestedDetailsGrid", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/Rfq/RequestedDetailsGrid"),
                scope: {
                    quote: "="
                }
            };
        }])
        .directive("iscProposedDetailsGrid", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/Rfq/ProposedDetailsGrid"),
                scope: {
                    quote: "="
                },
                controller: "QuoteProposedDetailsController",
                controllerAs: "vm",
                bindToController: true
            };
        }])
        .directive("iscRequestQuoteView", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/Rfq/RequestQuoteView"),
                controller: "RfqController",
                controllerAs: "vm"
            };
        }])
        .directive("iscQuoteConfirmationView", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/Rfq/QuoteConfirmationView"),
                controller: "QuoteConfirmationController",
                controllerAs: "vm"
            };
        }])
        .directive("iscQuoteDetailsView", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/Rfq/QuoteDetailsView"),
                controller: "QuoteDetailsController",
                controllerAs: "vm"
            };
        }])
        .directive("iscQuoteDetailsSalesView", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/Rfq/QuoteDetailsSalesView"),
                controller: "QuoteDetailsController",
                controllerAs: "vm"
            };
        }])
        .directive("iscMyQuoteUserView", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/Rfq/MyQuoteUserView"),
                controller: "MyQuotesController",
                controllerAs: "vm"
            };
        }])
        .directive("iscMyQuoteSales", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/Rfq/MyQuoteSalesView"),
                controller: "MyQuotesController",
                controllerAs: "vm"
            };
        }])
        .directive("iscRecentQuotes", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                scope: {
                    isSalesPerson: "="
                },
                templateUrl: coreService.getApiUri("/Directives/Rfq/RecentQuotes"),
                controller: "RecentQuotesController",
                controllerAs: "vm",
                bindToController: true
            };
        }])
        .directive("iscRfqMessages", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/Rfq/RfqMessages"),
                scope: {
                    messageCollection: "="
                },
                controller: "QuoteMessagesController",
                controllerAs: "vm"
            };
        }])
        .directive("iscRfqMessageList", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/Rfq/RfqMessageList")
            };
        }])
        .directive("iscQuoteDetailHeader", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/Rfq/QuoteDetailHeader"),
                scope: {
                    quote: "="
                },
                controller: "QuoteHeaderDetailsController",
                controllerAs: "vm",
                bindToController: true
            };
        }])
        .directive("iscPopupCartNotification", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/Rfq/PopupCartNotification"),
            };
        }])
        .directive("iscScrollBottom", ["$timeout", function ($timeout) {
            return {
                link: function ($scope, element, attrs) {
                    $scope.$on("messagesloaded", function() {
                        $timeout(function() {
                            element.scrollTop(element[0].scrollHeight);
                        }, 0, false);
                    });
                }
            };
        }])
        .directive("iscUpdatedQuotesMessage", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/Rfq/UpdatedQuotesMessage"),
                link: function($scope, element, attrs) {
                    $scope.vm.dashboardUrl = attrs.dashboardUrl;
                }
            };
        }])
        .directive("iscQuoteOrderCalculator", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/Rfq/QuoteOrderCalculator"),
                scope: {
                    quote: "=",
                    calculationMethod: "="
                }
            };
        }])
        .directive("iscQuoteLineCalculatorPopup", ["coreService", function (coreService) {
            return {
                restrict: "E",
                replace: true,
                templateUrl: coreService.getApiUri("/Directives/Rfq/QuoteLineCalculator"),
                scope: {
                    quote: "="
                },
                controller: "QuoteLineCalculatorPopupController",
                controllerAs: "vm",
                bindToController: true
            };
        }]);
}(angular));