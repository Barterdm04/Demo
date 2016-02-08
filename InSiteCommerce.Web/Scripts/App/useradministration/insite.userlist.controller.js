var insite;
(function (insite) {
    var useradministration;
    (function (useradministration) {
        "use strict";
        var UserListController = (function () {
            function UserListController($scope, accountService, paginationService) {
                this.$scope = $scope;
                this.accountService = accountService;
                this.paginationService = paginationService;
                this.sort = "UserName";
                this.searchText = "";
                this.users = [];
                this.pagination = null;
                this.paginationStorageKey = "DefaultPagination-UserList";
                this.init();
            }
            UserListController.prototype.init = function () {
                this.pagination = this.paginationService.getDefaultPagination(this.paginationStorageKey, this.pagination);
                this.search();
            };
            UserListController.prototype.search = function (sort, newSearch) {
                var _this = this;
                if (sort === void 0) { sort = "UserName"; }
                if (newSearch === void 0) { newSearch = false; }
                this.sort = sort;
                if (newSearch) {
                    this.pagination.currentPage = 1;
                }
                this.accountService.expand = "administration";
                this.accountService.getAccounts(this.searchText, this.pagination, this.sort).success(function (result) {
                    _this.users = result.accounts;
                    _this.pagination = result.pagination;
                }).error(function (data) {
                    _this.users = [];
                    _this.pagination = null;
                });
            };
            UserListController.prototype.clearSearch = function () {
                if (this.searchText) {
                    this.searchText = "";
                    if (this.pagination) {
                        this.pagination.currentPage = 1;
                    }
                    this.search(this.sort);
                }
            };
            UserListController.prototype.sortBy = function (sortKey) {
                if (this.sort.indexOf(sortKey) >= 0) {
                    sortKey = this.sort.indexOf("DESC") >= 0 ? sortKey : sortKey + " DESC";
                }
                if (this.pagination) {
                    this.pagination.currentPage = 1;
                }
                this.search(sortKey);
            };
            UserListController.prototype.getSortClass = function (key) {
                return this.sort.indexOf(key) >= 0 ? (this.sort.indexOf("DESC") >= 0 ? "sort-descending" : "sort-ascending") : "";
            };
            UserListController.$inject = [
                "$scope",
                "accountService",
                "paginationService"
            ];
            return UserListController;
        })();
        useradministration.UserListController = UserListController;
        angular.module("insite").controller("UserListController", UserListController);
    })(useradministration = insite.useradministration || (insite.useradministration = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.userlist.controller.js.map