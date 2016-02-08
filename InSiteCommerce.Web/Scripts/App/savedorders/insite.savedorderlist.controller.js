var insite;
(function (insite) {
    var savedorders;
    (function (savedorders) {
        "use strict";
        var SavedOrderListController = (function () {
            function SavedOrderListController(cartService, coreService, paginationService) {
                this.cartService = cartService;
                this.coreService = coreService;
                this.paginationService = paginationService;
                this.paginationStorageKey = "DefaultPagination-SavedOrderList";
                this.searchFilter = {
                    status: "Saved",
                    sort: "OrderDate DESC",
                    shipToId: null
                };
                this.init();
            }
            SavedOrderListController.prototype.init = function () {
                this.pagination = this.paginationService.getDefaultPagination(this.paginationStorageKey);
                this.getCarts();
            };
            SavedOrderListController.prototype.clear = function () {
                this.pagination.currentPage = 1;
                this.searchFilter = {
                    status: "Saved",
                    sort: "OrderDate",
                    shipToId: null
                };
                this.getCarts();
            };
            SavedOrderListController.prototype.changeSort = function (sort) {
                if (this.searchFilter.sort === sort && this.searchFilter.sort.indexOf(" DESC") < 0) {
                    this.searchFilter.sort = sort + " DESC";
                }
                else {
                    this.searchFilter.sort = sort;
                }
                this.getCarts();
            };
            SavedOrderListController.prototype.search = function () {
                if (this.pagination)
                    this.pagination.currentPage = 1;
                this.getCarts();
            };
            SavedOrderListController.prototype.getCarts = function () {
                var _this = this;
                this.cartService.getCarts(this.searchFilter, this.pagination).success(function (data) {
                    _this.savedCarts = data.carts;
                    _this.pagination = data.pagination;
                });
            };
            SavedOrderListController.$inject = [
                "cartService",
                "coreService",
                "paginationService"
            ];
            return SavedOrderListController;
        })();
        savedorders.SavedOrderListController = SavedOrderListController;
        angular.module("insite").controller("SavedOrderListController", SavedOrderListController);
    })(savedorders = insite.savedorders || (insite.savedorders = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.savedorderlist.controller.js.map