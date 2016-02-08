var insite;
(function (insite) {
    var core;
    (function (core) {
        "use strict";
        var PagerController = (function () {
            function PagerController(paginationService, $window) {
                this.paginationService = paginationService;
                this.$window = $window;
            }
            PagerController.prototype.showPager = function () {
                return this.pagination && (this.showPerPage() || this.showPagination() || this.showSortSelector());
            };
            PagerController.prototype.showSortSelector = function () {
                return !this.bottom && this.pagination.sortOptions != null && this.pagination.sortOptions.length > 1;
            };
            PagerController.prototype.showPerPage = function () {
                return !this.bottom && this.pagination.totalItemCount > this.pagination.defaultPageSize;
            };
            PagerController.prototype.showPagination = function () {
                return this.pagination.numberOfPages > 1;
            };
            PagerController.prototype.nextPage = function () {
                this.$window.scrollTo(0, 0);
                this.pagination.currentPage += 1;
                if (this.pageChanged) {
                    this.pageChanged();
                }
                this.updateData();
            };
            PagerController.prototype.prevPage = function () {
                this.$window.scrollTo(0, 0);
                this.pagination.currentPage -= 1;
                if (this.pageChanged) {
                    this.pageChanged();
                }
                this.updateData();
            };
            PagerController.prototype.pageInput = function () {
                if (this.pagination.currentPage > this.pagination.numberOfPages) {
                    this.pagination.currentPage = this.pagination.numberOfPages;
                }
                else if (this.pagination.currentPage < 1) {
                    this.pagination.currentPage = 1;
                }
                if (this.pageChanged) {
                    this.pageChanged();
                }
                this.updateData();
            };
            PagerController.prototype.updatePageSize = function () {
                if (this.storageKey)
                    this.paginationService.setDefaultPagination(this.storageKey, this.pagination);
                this.pagination.currentPage = 1;
                if (this.pageChanged) {
                    this.pageChanged();
                }
                this.updateData();
            };
            PagerController.prototype.updateSortOrder = function () {
                this.pagination.currentPage = 1;
                if (this.pageChanged) {
                    this.pageChanged();
                }
                this.updateData();
            };
            PagerController.$inject = [
                "paginationService",
                "$window"
            ];
            return PagerController;
        })();
        core.PagerController = PagerController;
        angular.module("insite").controller("PagerController", PagerController);
    })(core = insite.core || (insite.core = {}));
})(insite || (insite = {}));
//# sourceMappingURL=insite.pager.controller.js.map