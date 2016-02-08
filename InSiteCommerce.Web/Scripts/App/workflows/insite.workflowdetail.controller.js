var insite;
(function (insite) {
    var workflow;
    (function (workflow) {
        "use strict";
        var WorkflowDetailController = (function () {
            function WorkflowDetailController($scope, workflowService, coreService) {
                this.$scope = $scope;
                this.workflowService = workflowService;
                this.coreService = coreService;
                this.init();
            }
            WorkflowDetailController.prototype.init = function () {
                this.getWorkflow();
            };
            WorkflowDetailController.prototype.getWorkflow = function () {
                var _this = this;
                var serviceName = this.coreService.getQueryStringParameter("serviceName", true);
                this.workflowService.getWorkflow(serviceName).then(function (result) {
                    _this.$scope.workflow = result.data;
                });
                var bootstrap = this.lookupBootstrap(serviceName);
                this.$scope.metrics = [];
                this.$scope.jsonItems = [];
                bootstrap.forEach(function (each) {
                    var serviceUrl = "/" + each;
                    _this.workflowService.bootstrapService(serviceUrl).then(function (result) {
                        var str = JSON.stringify(result, null, 4);
                        var button = "View " + serviceUrl.substring(serviceUrl.lastIndexOf("/") + 1) + " json";
                        _this.$scope.jsonItems.push({
                            json: _this.syntaxHighlight(str),
                            buttonText: button
                        });
                    });
                });
                this.$scope.getServiceResults = function (currentService, selectedItem) {
                    _this.$scope.currentService = currentService;
                    _this.$scope.selectedItem = _this.$scope.jsonItems[selectedItem].json;
                    _this.coreService.displayModal(angular.element("#showServiceResult"));
                };
            };
            WorkflowDetailController.prototype.lookupBootstrap = function (serviceName) {
                var name = [];
                if (serviceName === "RequisitionService") {
                    name[0] = "api/v1/requisitions";
                }
                if (serviceName === "CartService") {
                    name[0] = "api/v1/carts";
                }
                if (serviceName === "WishListService") {
                    name[0] = "api/v1/wishlists";
                }
                if (serviceName === "WebsiteService") {
                    name[0] = "api/v1/countries";
                    name[1] = "api/v1/states";
                }
                if (serviceName === "OrderService") {
                    name[0] = "api/v1/orders";
                }
                if (serviceName === "InvoiceService") {
                    name[0] = "api/v1/invoices";
                }
                if (serviceName === "CustomerService") {
                    name[0] = "api/v1/billtos";
                }
                if (serviceName === "EmailService") {
                    name[0] = "api/v1/email";
                }
                if (serviceName === "AccountService") {
                    name[0] = "api/v1/accounts";
                }
                if (serviceName === "SessionService") {
                    name[0] = "api/v1/sessions/current";
                }
                if (serviceName === "RmaService") {
                    name[0] = "api/v1/rma";
                }
                if (serviceName === "CategoryService") {
                    name[0] = "api/v1/categories";
                }
                if (serviceName === "ProductService") {
                    name[0] = "api/v1/products";
                }
                if (serviceName === "BudgetService") {
                    name[0] = "api/v1/products";
                }
                if (serviceName === "DashboardService") {
                    name[0] = "api/v1/dashboardpanels";
                }
                if (serviceName === "DealerService") {
                    name[0] = "api/v1/dealers";
                }
                if (serviceName === "MessageService") {
                    name[0] = "api/v1/dealers";
                }
                if (serviceName === "UserService") {
                    name[0] = "api/v1/users";
                }
                if (serviceName === "RfqService") {
                    name[0] = "api/v1/quotes";
                }
                return name;
            };
            WorkflowDetailController.prototype.syntaxHighlight = function (json) {
                if (typeof json != "string") {
                    json = JSON.stringify(json, undefined, 2);
                }
                json = json.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                    var cls = "number";
                    if (/^"/.test(match)) {
                        if (/:$/.test(match)) {
                            cls = "key";
                        }
                        else {
                            cls = "string";
                        }
                    }
                    else if (/true|false/.test(match)) {
                        cls = "boolean";
                    }
                    else if (/null/.test(match)) {
                        cls = "null";
                    }
                    return "<span class='" + cls + "'>" + match + "</span>";
                });
            };
            WorkflowDetailController.$inject = [
                "$scope",
                "workflowService",
                "coreService"
            ];
            return WorkflowDetailController;
        })();
        workflow.WorkflowDetailController = WorkflowDetailController;
        angular.module("insite").controller("WorkflowDetailController", WorkflowDetailController);
    })(workflow = insite.workflow || (insite.workflow = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.workflowdetail.controller.js.map