var insite;
(function (insite) {
    var useradministration;
    (function (useradministration) {
        "use strict";
        var UserShipToController = (function () {
            function UserShipToController(userService, paginationService, coreService) {
                this.userService = userService;
                this.paginationService = paginationService;
                this.coreService = coreService;
                this.pageNumber = 1;
                this.pageSize = null;
                this.sort = "ShipTo";
                this.paginationStorageKey = "DefaultPagination-UserShipTo";
                this.errorMessage = "";
                this.saveSuccess = false;
                this.defaultShipTo = "";
                this.defaultShiptoNotAssigned = false;
                this.init();
            }
            UserShipToController.prototype.init = function () {
                this.pagination = this.paginationService.getDefaultPagination(this.paginationStorageKey);
                this.userProfileId = this.coreService.getQueryStringParameter("userId", true);
                this.search();
            };
            UserShipToController.prototype.search = function () {
                var _this = this;
                this.errorMessage = "";
                this.userService.getUserShipToCollection(this.userProfileId, this.pagination, this.sort).success(function (result) {
                    _this.pagination = result.pagination;
                    _this.costCodeCollection = result.costCodeCollection;
                    _this.userShipToCollection = result.userShipToCollection;
                    var defaultShipTos = result.userShipToCollection.filter(function (u) { return u.isDefaultShipTo; });
                    if (defaultShipTos.length === 1) {
                        _this.defaultShipTo = defaultShipTos[0].shipToNumber;
                    }
                    else {
                        _this.defaultShipTo = null;
                    }
                }).error(function (data) {
                    if (data && data.message) {
                        _this.errorMessage = data.message;
                    }
                });
            };
            UserShipToController.prototype.saveShipToCollection = function () {
                var _this = this;
                this.userShipToCollection.forEach(function (u) { return u.isDefaultShipTo = u.shipToNumber === _this.defaultShipTo; });
                this.errorMessage = "";
                this.saveSuccess = false;
                this.defaultShiptoNotAssigned = false;
                for (var i = 0; i < this.userShipToCollection.length; i++) {
                    if (this.userShipToCollection[i].isDefaultShipTo && !this.userShipToCollection[i].assign) {
                        this.defaultShiptoNotAssigned = true;
                    }
                }
                if (!this.defaultShiptoNotAssigned) {
                    this.userService.applyUserShipToCollection(this.userProfileId, this.userShipToCollection).success(function (data) {
                        _this.saveSuccess = true;
                    }).error(function (data) {
                        _this.saveSuccess = false;
                        _this.errorMessage = "";
                        if (data && data.message) {
                            _this.errorMessage = data.message;
                        }
                    });
                }
            };
            UserShipToController.prototype.sortBy = function (sortKey) {
                if (this.sort.indexOf(sortKey) >= 0) {
                    this.sort = this.sort.indexOf("DESC") >= 0 ? sortKey : sortKey + " DESC";
                }
                else {
                    this.sort = sortKey;
                }
                this.pagination.currentPage = 1;
                this.search();
            };
            UserShipToController.prototype.getSortClass = function (key) {
                return this.sort.indexOf(key) >= 0 ? (this.sort.indexOf("DESC") >= 0 ? "sort-descending" : "sort-ascending") : "";
            };
            UserShipToController.$inject = [
                "userService",
                "paginationService",
                "coreService"
            ];
            return UserShipToController;
        })();
        useradministration.UserShipToController = UserShipToController;
        angular.module("insite").controller("UserShipToController", UserShipToController);
    })(useradministration = insite.useradministration || (insite.useradministration = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.usershipto.controller.js.map